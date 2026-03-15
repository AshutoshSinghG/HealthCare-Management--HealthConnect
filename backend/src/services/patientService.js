const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Medication = require('../models/Medication');
const UnsuitableMedicine = require('../models/UnsuitableMedicine');

/**
 * Get patient profile by userId.
 */
const getProfile = async (userId) => {
  const patient = await Patient.findOne({ userId }).populate('userId', 'email role isActive');
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }
  return patient;
};

/**
 * Update patient profile.
 */
const updateProfile = async (userId, updates) => {
  const patient = await Patient.findOneAndUpdate({ userId }, updates, {
    new: true,
    runValidators: true,
  });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }
  return patient;
};

/**
 * Get treatment history for a patient with pagination and filters.
 */
const getTreatments = async (userId, query) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    doctorId,
    search,
  } = query;

  const filter = { patientId: patient._id };

  if (startDate || endDate) {
    filter.visitDate = {};
    if (startDate) filter.visitDate.$gte = new Date(startDate);
    if (endDate) filter.visitDate.$lte = new Date(endDate);
  }

  if (doctorId) filter.doctorId = doctorId;

  if (search) {
    filter.$or = [
      { diagnosis: { $regex: search, $options: 'i' } },
      { chiefComplaint: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [treatments, total] = await Promise.all([
    Treatment.find(filter)
      .populate('doctorId', 'firstName lastName specialisation')
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Treatment.countDocuments(filter),
  ]);

  return {
    treatments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single treatment detail.
 */
const getTreatmentById = async (userId, treatmentId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const treatment = await Treatment.findOne({
    _id: treatmentId,
    patientId: patient._id,
  }).populate('doctorId', 'firstName lastName specialisation');

  if (!treatment) {
    const err = new Error('Treatment not found');
    err.statusCode = 404;
    throw err;
  }

  const medications = await Medication.find({ treatmentId: treatment._id });

  return { treatment, medications };
};

/**
 * Get unsuitable medicines for a patient.
 */
const getUnsuitableMedicines = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const medicines = await UnsuitableMedicine.find({
    patientId: patient._id,
    isActive: true,
  }).populate('flaggedByDoctorId', 'firstName lastName');

  return medicines;
};

module.exports = {
  getProfile,
  updateProfile,
  getTreatments,
  getTreatmentById,
  getUnsuitableMedicines,
};
