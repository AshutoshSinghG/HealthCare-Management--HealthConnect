const appointmentService = require('../services/appointmentService');
const { success } = require('../utils/apiResponse');

/**
 * GET /appointments/me
 */
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getMyAppointments(req.user.userId);
    return success(res, 'Appointments retrieved', appointments);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /appointments/book
 */
const bookAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.bookAppointment(req.user.userId, req.body);
    return success(res, 'Appointment booked', result, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /appointments/:id/cancel
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.cancelAppointment(req.user.userId, req.params.id);
    return success(res, 'Appointment cancelled', result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyAppointments, bookAppointment, cancelAppointment };
