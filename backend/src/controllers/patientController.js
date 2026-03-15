const patientService = require('../services/patientService');
const { success } = require('../utils/apiResponse');
const { logAction } = require('../services/auditService');

/**
 * GET /patients/me
 */
const getProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getProfile(req.user.userId);

    await logAction({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      actionType: 'READ',
      entityType: 'Patient',
      entityId: patient._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return success(res, 'Patient profile retrieved', patient);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /patients/me
 */
const updateProfile = async (req, res, next) => {
  try {
    const patient = await patientService.updateProfile(req.user.userId, req.body);

    await logAction({
      actorUserId: req.user.userId,
      actorRole: req.user.role,
      actionType: 'UPDATE',
      entityType: 'Patient',
      entityId: patient._id,
      newValues: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return success(res, 'Profile updated', patient);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /patients/me/treatments
 */
const getTreatments = async (req, res, next) => {
  try {
    const result = await patientService.getTreatments(req.user.userId, req.query);
    return success(res, 'Treatments retrieved', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /patients/me/treatments/:id
 */
const getTreatmentById = async (req, res, next) => {
  try {
    const result = await patientService.getTreatmentById(req.user.userId, req.params.id);
    return success(res, 'Treatment detail retrieved', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /patients/me/unsuitable-medicines
 */
const getUnsuitableMedicines = async (req, res, next) => {
  try {
    const medicines = await patientService.getUnsuitableMedicines(req.user.userId);
    return success(res, 'Unsuitable medicines retrieved', medicines);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getTreatments, getTreatmentById, getUnsuitableMedicines };
