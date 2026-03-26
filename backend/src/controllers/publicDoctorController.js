const publicDoctorService = require('../services/publicDoctorService');
const { success } = require('../utils/apiResponse');

/**
 * GET /public/doctors
 */
const listDoctors = async (req, res, next) => {
  try {
    const doctors = await publicDoctorService.listDoctors(req.query);
    return success(res, 'Doctors retrieved', doctors);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /public/specialties
 */
const getSpecialties = async (req, res, next) => {
  try {
    const specialties = await publicDoctorService.getSpecialties();
    return success(res, 'Specialties retrieved', specialties);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /public/doctors/:doctorId/slots
 */
const getDoctorSlots = async (req, res, next) => {
  try {
    const slots = await publicDoctorService.getDoctorSlots(req.params.doctorId, req.query.date);
    return success(res, 'Slots retrieved', slots);
  } catch (err) {
    next(err);
  }
};

module.exports = { listDoctors, getSpecialties, getDoctorSlots };
