const doctorService = require('../services/doctorService');
const { success } = require('../utils/apiResponse');

/**
 * GET /doctors/me
 */
const getProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.getProfile(req.user.userId);
    return success(res, 'Doctor profile retrieved', doctor);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /doctors/me/patients
 */
const getPatients = async (req, res, next) => {
  try {
    const result = await doctorService.getPatients(req.user.userId, req.query);
    return success(res, 'Patients retrieved', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /doctors/me/patients/:patientId
 */
const getPatientDetail = async (req, res, next) => {
  try {
    const result = await doctorService.getPatientDetail(req.user.userId, req.params.patientId);
    return success(res, 'Patient detail retrieved', result);
  } catch (err) {
    next(err);
  }
};




/**
 * GET /doctors/me/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const result = await doctorService.getDashboard(req.user.userId);
    return success(res, 'Doctor dashboard retrieved', result);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /doctors/me
 */
const updateProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateProfile(req.user.userId, req.body);
    return success(res, 'Profile updated', doctor);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getPatients, getPatientDetail, getDashboard };
