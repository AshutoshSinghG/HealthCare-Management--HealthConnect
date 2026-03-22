const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Medication = require('../models/Medication');

/**
 * Get doctor profile by userId.
 */
const getProfile = async (userId) => {
  const doctor = await Doctor.findOne({ userId }).populate('userId', 'email role isActive');
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }
  return doctor;
};

/**
 * Get patients treated by this doctor (distinct).
 */
const getPatients = async (userId, query) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  // Find distinct patient IDs from treatments by this doctor
  const patientIds = await Treatment.distinct('patientId', { doctorId: doctor._id });

  const [patients, total] = await Promise.all([
    Patient.find({ _id: { $in: patientIds } })
      .skip(skip)
      .limit(Number(limit)),
    Patient.countDocuments({ _id: { $in: patientIds } }),
  ]);

  return {
    patients,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a specific patient's profile and treatment history (doctor view).
 */
const getPatientDetail = async (userId, patientId) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    const err = new Error('Patient not found');
    err.statusCode = 404;
    throw err;
  }

  const treatments = await Treatment.find({
    patientId: patient._id,
    doctorId: doctor._id,
  })
    .sort({ visitDate: -1 })
    .limit(50);

  // Get medications for each treatment
  const treatmentIds = treatments.map((t) => t._id);
  const medications = await Medication.find({ treatmentId: { $in: treatmentIds } });

  // Group medications by treatment
  const medicationMap = {};
  for (const med of medications) {
    const key = med.treatmentId.toString();
    if (!medicationMap[key]) medicationMap[key] = [];
    medicationMap[key].push(med);
  }

  const treatmentsWithMeds = treatments.map((t) => ({
    ...t.toObject(),
    medications: medicationMap[t._id.toString()] || [],
  }));

  return { patient, treatments: treatmentsWithMeds };
};

/**
 * Get doctor dashboard data (profile + aggregated stats).
 */
const getDashboard = async (userId) => {
  const doctor = await Doctor.findOne({ userId }).populate('userId', 'email role isActive');
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const patientIds = await Treatment.distinct('patientId', { doctorId: doctor._id });

  const [totalPatients, recentVisitsCount, flaggedMedicines, followUps] = await Promise.all([
    Promise.resolve(patientIds.length),
    Treatment.countDocuments({
      doctorId: doctor._id,
      visitDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    require('../models/UnsuitableMedicine').countDocuments({
      flaggedByDoctorId: doctor._id,
      isActive: true,
    }),
    Treatment.countDocuments({
      doctorId: doctor._id,
      followUpDate: { $gte: new Date() },
      outcomeStatus: { $in: ['ONGOING', 'FOLLOW_UP'] },
    }),
  ]);

  const recentPatients = await Patient.find({ _id: { $in: patientIds } })
    .sort({ updatedAt: -1 })
    .limit(5);

  // Get latest treatment for each recent patient
  const recentPatientsWithTreatment = await Promise.all(
    recentPatients.map(async (p) => {
      const lastTreatment = await Treatment.findOne({
        patientId: p._id,
        doctorId: doctor._id,
      }).sort({ visitDate: -1 });
      return {
        ...p.toObject(),
        lastTreatment: lastTreatment
          ? { visitDate: lastTreatment.visitDate, diagnosis: lastTreatment.diagnosis, outcomeStatus: lastTreatment.outcomeStatus }
          : null,
      };
    })
  );

  const pendingFollowups = await Treatment.find({
    doctorId: doctor._id,
    followUpDate: { $gte: new Date() },
    outcomeStatus: { $in: ['ONGOING', 'FOLLOW_UP'] },
  })
    .populate('patientId', 'firstName lastName')
    .sort({ followUpDate: 1 })
    .limit(5);

  return {
    profile: doctor,
    stats: {
      totalPatients,
      recentVisits: recentVisitsCount,
      flaggedMedicines,
      followupsRequired: followUps,
    },
    recentPatients: recentPatientsWithTreatment,
    pendingFollowups,
  };
};

module.exports = { getProfile, getPatients, getPatientDetail, getDashboard };
