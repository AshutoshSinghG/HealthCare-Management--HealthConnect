const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Medication = require('../models/Medication');
const UnsuitableMedicine = require('../models/UnsuitableMedicine');
const Doctor = require('../models/Doctor');

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
 * Get patient dashboard data (profile + aggregated stats).
 */
const getDashboard = async (userId) => {
  const patient = await Patient.findOne({ userId }).populate('userId', 'email role isActive');
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const [totalTreatments, unsuitableMeds, lastTreatment, recentTreatments] = await Promise.all([
    Treatment.countDocuments({ patientId: patient._id }),
    UnsuitableMedicine.countDocuments({ patientId: patient._id, isActive: true }),
    Treatment.findOne({ patientId: patient._id }).sort({ visitDate: -1 }),
    Treatment.find({ patientId: patient._id })
      .populate('doctorId', 'firstName lastName specialisation')
      .sort({ visitDate: -1 })
      .limit(5),
  ]);

  // Count distinct active medications across all treatments
  const treatmentIds = (await Treatment.find({ patientId: patient._id }).select('_id')).map(t => t._id);
  const activeMedicationsCount = await Medication.countDocuments({ treatmentId: { $in: treatmentIds } });

  const unsuitableMedicinesList = await UnsuitableMedicine.find({ patientId: patient._id, isActive: true })
    .populate('flaggedByDoctorId', 'firstName lastName')
    .limit(5);

  return {
    profile: patient,
    stats: {
      totalTreatments,
      activeMedications: activeMedicationsCount,
      flaggedMedicines: unsuitableMeds,
      lastVisit: lastTreatment?.visitDate || null,
    },
    recentTreatments,
    unsuitableMedicines: unsuitableMedicinesList,
  };
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

/**
 * Get all medications for a patient across all treatments.
 */
const getMedications = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  // Get all treatments for the patient with doctor info
  const treatments = await Treatment.find({ patientId: patient._id })
    .populate('doctorId', 'firstName lastName')
    .sort({ visitDate: -1 });

  const treatmentIds = treatments.map(t => t._id);
  const treatmentMap = {};
  treatments.forEach(t => {
    treatmentMap[t._id.toString()] = t;
  });

  // Get all medications for those treatments
  const medications = await Medication.find({ treatmentId: { $in: treatmentIds } }).sort({ createdAt: -1 });

  return medications.map(med => {
    const treatment = treatmentMap[med.treatmentId.toString()];
    const doctor = treatment?.doctorId;
    return {
      id: med._id,
      name: med.medicineName,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.durationDays ? `${med.durationDays} days` : 'Ongoing',
      route: med.routeOfAdmin || 'Oral',
      prescribedBy: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown',
      prescribedDate: treatment?.visitDate ? treatment.visitDate.toISOString().split('T')[0] : '',
      status: 'active', // All medications from Medication model are considered active
      notes: med.notes || '',
    };
  });
};

module.exports = {
  getProfile,
  getDashboard,
  updateProfile,
  getTreatments,
  getTreatmentById,
  getUnsuitableMedicines,
  getMedications,
};
