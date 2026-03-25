const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All routes require authentication and PATIENT role
router.use(authenticate);
router.use(authorise('PATIENT'));

// Appointment CRUD
router.get('/me/appointments', appointmentController.getMyAppointments);
router.post('/me/appointments', appointmentController.bookAppointment);
router.patch('/me/appointments/:id/cancel', appointmentController.cancelAppointment);

// Doctor browsing (for booking)
router.get('/doctors', appointmentController.getAvailableDoctors);
router.get('/doctors/:doctorId/slots', appointmentController.getDoctorSlots);

module.exports = router;
