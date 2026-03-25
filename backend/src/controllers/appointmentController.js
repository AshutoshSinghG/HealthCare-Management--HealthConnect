const appointmentService = require('../services/appointmentService');
const { success } = require('../utils/apiResponse');

const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(
      req.user.userId,
      req.query.status
    );
    return success(res, 'Appointments retrieved', appointments);
  } catch (err) {
    next(err);
  }
};

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment(
      req.user.userId,
      req.body
    );
    return success(res, 'Appointment booked successfully', appointment, 201);
  } catch (err) {
    next(err);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      req.user.userId,
      req.params.id
    );
    return success(res, 'Appointment cancelled', appointment);
  } catch (err) {
    next(err);
  }
};

const getAvailableDoctors = async (req, res, next) => {
  try {
    const doctors = await appointmentService.getAvailableDoctors(req.query);
    return success(res, 'Doctors retrieved', doctors);
  } catch (err) {
    next(err);
  }
};

const getDoctorSlots = async (req, res, next) => {
  try {
    const slots = await appointmentService.getDoctorSlots(
      req.params.doctorId,
      req.query.date
    );
    return success(res, 'Slots retrieved', slots);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
  getDoctorSlots,
};
