const Treatment = require('../models/Treatment');
const Medication = require('../models/Medication');
const Doctor = require('../models/Doctor');
const UnsuitableMedicine = require('../models/UnsuitableMedicine');
const { logAction } = require('./auditService');

/**
 * Create a treatment record and associated medications.
 */
const createTreatment = async ({
  patientId,
  userId,
  treatmentData,
  ipAddress,
  userAgent,
}) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const { medications: medsData, ...treatmentFields } = treatmentData;

  const treatment = await Treatment.create({
    ...treatmentFields,
    patientId,
    doctorId: doctor._id,
  });

  // Create medications if provided
  let medications = [];
  if (medsData && medsData.length > 0) {
    const medsToInsert = medsData.map((med) => ({
      ...med,
      treatmentId: treatment._id,
    }));
    medications = await Medication.insertMany(medsToInsert);
  }

  // Audit log
  await logAction({
    actorUserId: userId,
    actorRole: 'DOCTOR',
    actionType: 'CREATE',
    entityType: 'Treatment',
    entityId: treatment._id,
    newValues: treatment.toObject(),
    ipAddress,
    userAgent,
  });

  return { treatment, medications };
};

/**
 * Update a treatment record (only by the owning doctor).
 */
const updateTreatment = async ({
  treatmentId,
  userId,
  updates,
  ipAddress,
  userAgent,
}) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const treatment = await Treatment.findById(treatmentId);
  if (!treatment) {
    const err = new Error('Treatment not found');
    err.statusCode = 404;
    throw err;
  }

  if (treatment.doctorId.toString() !== doctor._id.toString()) {
    const err = new Error('You can only update treatments you created');
    err.statusCode = 403;
    throw err;
  }

  const oldValues = treatment.toObject();

  // Increment version
  updates.version = (treatment.version || 1) + 1;

  Object.assign(treatment, updates);
  await treatment.save();

  // Audit log
  await logAction({
    actorUserId: userId,
    actorRole: 'DOCTOR',
    actionType: 'UPDATE',
    entityType: 'Treatment',
    entityId: treatment._id,
    oldValues,
    newValues: treatment.toObject(),
    ipAddress,
    userAgent,
  });

  return treatment;
};

/**
 * Soft-delete a treatment record.
 */
const softDeleteTreatment = async ({
  treatmentId,
  userId,
  ipAddress,
  userAgent,
}) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const treatment = await Treatment.findById(treatmentId);
  if (!treatment) {
    const err = new Error('Treatment not found');
    err.statusCode = 404;
    throw err;
  }

  if (treatment.doctorId.toString() !== doctor._id.toString()) {
    const err = new Error('You can only delete treatments you created');
    err.statusCode = 403;
    throw err;
  }

  treatment.isDeleted = true;
  treatment.deletedAt = new Date();
  await treatment.save();

  // Audit log
  await logAction({
    actorUserId: userId,
    actorRole: 'DOCTOR',
    actionType: 'DELETE',
    entityType: 'Treatment',
    entityId: treatment._id,
    oldValues: { isDeleted: false },
    newValues: { isDeleted: true, deletedAt: treatment.deletedAt },
    ipAddress,
    userAgent,
  });

  return treatment;
};

/**
 * Flag an unsuitable medicine for a patient.
 */
const flagUnsuitableMedicine = async ({
  patientId,
  userId,
  data,
  ipAddress,
  userAgent,
}) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) {
    const err = new Error('Doctor profile not found');
    err.statusCode = 404;
    throw err;
  }

  const flag = await UnsuitableMedicine.create({
    patientId,
    flaggedByDoctorId: doctor._id,
    ...data,
  });

  await logAction({
    actorUserId: userId,
    actorRole: 'DOCTOR',
    actionType: 'CREATE',
    entityType: 'UnsuitableMedicine',
    entityId: flag._id,
    newValues: flag.toObject(),
    ipAddress,
    userAgent,
  });

  return flag;
};

/**
 * Remove an unsuitable medicine flag.
 */
const removeUnsuitableFlag = async ({
  flagId,
  userId,
  ipAddress,
  userAgent,
}) => {
  const flag = await UnsuitableMedicine.findById(flagId);
  if (!flag) {
    const err = new Error('Unsuitable medicine flag not found');
    err.statusCode = 404;
    throw err;
  }

  flag.isActive = false;
  flag.removedByUserId = userId;
  flag.removedAt = new Date();
  await flag.save();

  await logAction({
    actorUserId: userId,
    actorRole: 'DOCTOR',
    actionType: 'DELETE',
    entityType: 'UnsuitableMedicine',
    entityId: flag._id,
    oldValues: { isActive: true },
    newValues: { isActive: false, removedAt: flag.removedAt },
    ipAddress,
    userAgent,
  });

  return flag;
};

module.exports = {
  createTreatment,
  updateTreatment,
  softDeleteTreatment,
  flagUnsuitableMedicine,
  removeUnsuitableFlag,
};
