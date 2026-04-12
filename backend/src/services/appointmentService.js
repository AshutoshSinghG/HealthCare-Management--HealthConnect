const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const DoctorAvailability = require('../models/DoctorAvailability');

/**
 * Find patient by userId helper.
 */
const findPatient = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }
  return patient;
};

/**
 * Get patient appointments.
 * Maps DoctorSlot statuses to frontend-friendly statuses:
 *   booked/pending → upcoming, rejected → cancelled
 * Completed appointments are those with status 'booked' and date in the past.
 */
const getMyAppointments = async (userId) => {
  const patient = await findPatient(userId);

  const slots = await DoctorSlot.find({
    patientId: patient._id.toString(),
  })
    .populate('doctorId', 'firstName lastName specialisation department contactPhone')
    .sort({ date: -1, from: -1 });

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const appointments = slots.map((slot) => {
    let status;
    if (slot.status === 'rejected') {
      status = 'cancelled';
    } else if (slot.status === 'booked' && slot.date < todayStr) {
      status = 'completed';
    } else if (slot.status === 'booked' || slot.status === 'pending') {
      status = 'upcoming';
    } else {
      status = slot.status;
    }

    const doctor = slot.doctorId;
    const doctorName = doctor
      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
      : 'Unknown Doctor';
    const specialty = doctor?.specialisation || '';
    const hospital = doctor?.department || '';

    let displayType = 'In-person';
    if (slot.status === 'pending') {
      displayType = 'Pending';
    } else if (slot.status === 'booked' && slot.date >= todayStr) {
      displayType = 'Approved';
    }

    return {
      id: slot._id,
      doctor: doctorName,
      specialty,
      date: slot.date,
      time: slot.from,
      status, // keep upcoming, completed, cancelled to work with frontend filtering
      type: displayType, // Display "Pending" or "Approved" to fulfill UI Requirement
      hospital,
      fee: 0,
      _slotId: slot._id,
    };
  });

  // Populate fees from DoctorAvailability
  const doctorIds = [...new Set(slots.filter(s => s.doctorId).map(s => s.doctorId._id.toString()))];
  const availabilities = await DoctorAvailability.find({ doctorId: { $in: doctorIds } });
  const feeMap = {};
  availabilities.forEach(a => { feeMap[a.doctorId.toString()] = a.consultationFee || 0; });

  appointments.forEach((appt, i) => {
    const slot = slots[i];
    if (slot.doctorId) {
      appt.fee = feeMap[slot.doctorId._id.toString()] || 0;
    }
  });

  return appointments;
};

/**
 * Book an appointment.
 * 
 * Handles two cases:
 *   1. Booking an existing DB slot (slotId is a valid MongoDB ObjectId)
 *   2. Booking a "virtual" slot (slotId starts with "virtual_") —
 *      these are auto-generated from DoctorAvailability and don't exist
 *      in the DB yet. We create a new DoctorSlot record.
 */
const bookAppointment = async (userId, { slotId, reason }) => {
  const patient = await findPatient(userId);

  // Check if this is a virtual slot
  if (typeof slotId === 'string' && slotId.startsWith('virtual_')) {
    // Parse: virtual_{doctorId}_{date}_{from}
    const parts = slotId.split('_');
    // Format: virtual_<doctorId>_<YYYY>-<MM>-<DD>_<HH>:<MM>
    // We need to handle the fact that doctorId might contain underscores (unlikely for ObjectId)
    // Better approach: virtual_{doctorId}_{date}_{from}
    const doctorId = parts[1];
    const date = parts[2] ? parts[2].substring(0, 10) : parts[2]; // YYYY-MM-DD (normalized)
    const fromTime = parts[3]; // HH:MM

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      const err = new Error('Doctor not found');
      err.statusCode = 404;
      throw err;
    }

    // Determine real Datetime considering midnight rollover
    const avail = await DoctorAvailability.findOne({ doctorId });
    const shiftStartTime = avail ? avail.startTime : '09:00';
    
    const [baseY, baseM, baseD] = date.split('-').map(Number);
    const [h, m] = fromTime.split(':').map(Number);
    const [sh, sm] = shiftStartTime.split(':').map(Number);
    
    // Create base slot time
    const startDateTime = new Date(baseY, baseM - 1, baseD, h, m, 0);
    // If slot hour is less than shift start hour (or same hour and less minute), it rolled over to the next day
    if (h < sh || (h === sh && m < sm)) {
      startDateTime.setDate(startDateTime.getDate() + 1);
    }
    
    // Calculate end time (30 minutes later)
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    const toTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

    // Verify no existing slot for this time is currently booked or pending
    const existingSlot = await DoctorSlot.findOne({
      doctorId,
      date,
      from: fromTime,
    });
    if (existingSlot && existingSlot.status !== 'vacant' && existingSlot.status !== 'rejected') {
      const err = new Error('Slot is not available');
      err.statusCode = 400;
      throw err;
    }

    if (existingSlot) {
      // Update existing vacant slot
      existingSlot.patientId = patient._id.toString();
      existingSlot.patient = `${patient.firstName} ${patient.lastName}`;
      existingSlot.reason = reason || '';
      existingSlot.status = 'pending';
      existingSlot.startDateTime = startDateTime;
      existingSlot.endDateTime = endDateTime;
      await existingSlot.save();
      return existingSlot;
    }

    // Create a new DoctorSlot record
    const newSlot = await DoctorSlot.create({
      doctorId,
      date,
      from: fromTime,
      to: toTime,
      startDateTime,
      endDateTime,
      patientId: patient._id.toString(),
      patient: `${patient.firstName} ${patient.lastName}`,
      reason: reason || '',
      status: 'pending',
    });

    return newSlot;
  }

  // Standard case: booking an existing slot by ObjectId
  const slot = await DoctorSlot.findById(slotId);
  if (!slot) {
    const err = new Error('Slot not found');
    err.statusCode = 404;
    throw err;
  }
  if (slot.status !== 'vacant' && slot.status !== 'rejected') {
    const err = new Error('Slot is not available');
    err.statusCode = 400;
    throw err;
  }

  slot.patientId = patient._id.toString();
  slot.patient = `${patient.firstName} ${patient.lastName}`;
  slot.reason = reason || '';
  slot.status = 'pending';
  await slot.save();

  return slot;
};

/**
 * Cancel an appointment — set slot status to rejected.
 */
const cancelAppointment = async (userId, slotId) => {
  const patient = await findPatient(userId);

  const slot = await DoctorSlot.findOne({
    _id: slotId,
    patientId: patient._id.toString(),
  });

  if (!slot) {
    const err = new Error('Appointment not found');
    err.statusCode = 404;
    throw err;
  }

  if (slot.status === 'rejected') {
    const err = new Error('Appointment is already cancelled');
    err.statusCode = 400;
    throw err;
  }

  slot.status = 'rejected';
  await slot.save();

  return slot;
};

module.exports = { getMyAppointments, bookAppointment, cancelAppointment };
