const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

/**
 * Get patient appointments filtered by status.
 */
const getPatientAppointments = async (userId, status) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const filter = { patientId: patient._id };
  if (status) filter.status = status.toUpperCase();

  const appointments = await Appointment.find(filter)
    .populate({
      path: 'doctorId',
      select: 'firstName lastName specialisation contactEmail contactPhone',
    })
    .sort({ date: -1, time: -1 });

  return appointments;
};

/**
 * Book a new appointment.
 */
const bookAppointment = async (userId, data) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  // Check the slot is not already taken
  const existing = await Appointment.findOne({
    doctorId: data.doctorId,
    date: data.date,
    time: data.time,
    status: { $ne: 'CANCELLED' },
  });

  if (existing) {
    const err = new Error('This time slot is already booked');
    err.statusCode = 409;
    throw err;
  }

  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId: data.doctorId,
    date: data.date,
    time: data.time,
    type: data.type || 'In-person',
    fee: data.fee || 0,
    notes: data.notes || '',
    status: 'UPCOMING',
  });

  return appointment;
};

/**
 * Cancel an appointment.
 */
const cancelAppointment = async (userId, appointmentId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patientId: patient._id,
  });

  if (!appointment) {
    const err = new Error('Appointment not found');
    err.statusCode = 404;
    throw err;
  }

  if (appointment.status === 'CANCELLED') {
    const err = new Error('Appointment already cancelled');
    err.statusCode = 400;
    throw err;
  }

  appointment.status = 'CANCELLED';
  appointment.cancelledAt = new Date();
  await appointment.save();

  return appointment;
};

/**
 * Get available doctors (optionally filtered).
 */
const getAvailableDoctors = async (filters = {}) => {
  const query = {};
  if (filters.specialisation) {
    query.specialisation = { $regex: filters.specialisation, $options: 'i' };
  }
  if (filters.search) {
    const s = filters.search;
    query.$or = [
      { firstName: { $regex: s, $options: 'i' } },
      { lastName: { $regex: s, $options: 'i' } },
      { specialisation: { $regex: s, $options: 'i' } },
    ];
  }

  const doctors = await Doctor.find(query)
    .populate('userId', 'email')
    .select('firstName lastName specialisation registrationNumber department contactEmail contactPhone');

  return doctors;
};

/**
 * Get doctor's time slots for a given date.
 * Returns fixed 30-minute slots (09:00–17:00) with booked status.
 */
const getDoctorSlots = async (doctorId, dateStr) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const err = new Error('Doctor not found');
    err.statusCode = 404;
    throw err;
  }

  // Generate standard 30-min slots
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const timeStr = `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
      slots.push({ time: timeStr, status: 'vacant' });
    }
  }

  // Check which are already booked
  const date = new Date(dateStr);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const bookedAppointments = await Appointment.find({
    doctorId,
    date: { $gte: date, $lt: nextDay },
    status: { $ne: 'CANCELLED' },
  }).select('time');

  const bookedTimes = new Set(bookedAppointments.map(a => a.time));

  return slots.map(slot => ({
    ...slot,
    status: bookedTimes.has(slot.time) ? 'booked' : 'vacant',
  }));
};

module.exports = {
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
  getDoctorSlots,
};
