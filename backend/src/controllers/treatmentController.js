const treatmentService = require('../services/treatmentService');
const { success } = require('../utils/apiResponse');

/**
 * POST /doctors/me/patients/:patientId/treatments
 */
const createTreatment = async (req, res, next) => {
  try {
    const result = await treatmentService.createTreatment({
      patientId: req.params.patientId,
      userId: req.user.userId,
      treatmentData: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Treatment created', result, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /treatments/:treatmentId
 */
const updateTreatment = async (req, res, next) => {
  try {
    const treatment = await treatmentService.updateTreatment({
      treatmentId: req.params.treatmentId,
      userId: req.user.userId,
      updates: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Treatment updated', treatment);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /treatments/:treatmentId
 */
const deleteTreatment = async (req, res, next) => {
  try {
    await treatmentService.softDeleteTreatment({
      treatmentId: req.params.treatmentId,
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Treatment deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /patients/:patientId/unsuitable-medicines
 */
const flagUnsuitableMedicine = async (req, res, next) => {
  try {
    const flag = await treatmentService.flagUnsuitableMedicine({
      patientId: req.params.patientId,
      userId: req.user.userId,
      data: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Medicine flagged as unsuitable', flag, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /unsuitable-medicines/:id
 */
const removeUnsuitableFlag = async (req, res, next) => {
  try {
    const flag = await treatmentService.removeUnsuitableFlag({
      flagId: req.params.id,
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Unsuitable medicine flag removed', flag);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTreatment,
  updateTreatment,
  deleteTreatment,
  flagUnsuitableMedicine,
  removeUnsuitableFlag,
};
