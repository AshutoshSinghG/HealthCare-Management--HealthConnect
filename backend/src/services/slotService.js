const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const DoctorAvailability = require('../models/DoctorAvailability');

const findDoctor = async (userId) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }
  return doctor;
};

const getSlots = async (userId, query) => {
  const doctor = await findDoctor(userId);
  const filter = { doctorId: doctor._id };
  if (query.from && query.to) {
    filter.date = { $gte: query.from, $lte: query.to };
  } else if (query.date) {
    filter.date = query.date;
  }
  return DoctorSlot.find(filter).sort({ date: 1, from: 1 });
};

const createSlot = async (userId, data) => {
  const doctor = await findDoctor(userId);
  
  const [baseY, baseM, baseD] = data.date.split('-').map(Number);
  const [h, m] = data.from.split(':').map(Number);
  const [th, tm] = data.to.split(':').map(Number);
  
  // Simple logic: startDateTime = date + from, endDateTime = date + to
  const startDateTime = new Date(baseY, baseM - 1, baseD, h, m, 0);
  const endDateTime = new Date(baseY, baseM - 1, baseD, th, tm, 0);
  
  // Only add +1 day to endDateTime if the slot itself crosses midnight (to <= from)
  if (endDateTime <= startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }
  
  return DoctorSlot.create({
    doctorId: doctor._id,
    date: data.date,
    from: data.from,
    to: data.to,
    startDateTime,
    endDateTime,
    patient: data.patient || '',
    patientId: data.patientId || '',
    reason: data.reason || '',
    status: data.patient ? 'pending' : 'vacant',
  });
};

const deleteSlot = async (userId, slotId) => {
  const doctor = await findDoctor(userId);
  const slot = await DoctorSlot.findOneAndDelete({ _id: slotId, doctorId: doctor._id });
  if (!slot) {
    const err = new Error('Slot not found');
    err.statusCode = 404;
    throw err;
  }
  return slot;
};

const updateSlotStatus = async (userId, slotId, status) => {
  const doctor = await findDoctor(userId);
  const slot = await DoctorSlot.findOneAndUpdate(
    { _id: slotId, doctorId: doctor._id },
    { status },
    { new: true }
  );
  if (!slot) {
    const err = new Error('Slot not found');
    err.statusCode = 404;
    throw err;
  }
  return slot;
};

const getAvailability = async (userId) => {
  const doctor = await findDoctor(userId);
  let avail = await DoctorAvailability.findOne({ doctorId: doctor._id });
  if (!avail) avail = await DoctorAvailability.create({ doctorId: doctor._id });
  return avail;
};

const updateAvailability = async (userId, data) => {
  const doctor = await findDoctor(userId);
  return DoctorAvailability.findOneAndUpdate(
    { doctorId: doctor._id },
    { startTime: data.startTime, endTime: data.endTime, consultationFee: data.consultationFee, workingDays: data.workingDays },
    { new: true, upsert: true }
  );
};

module.exports = { getSlots, createSlot, deleteSlot, updateSlotStatus, getAvailability, updateAvailability };
