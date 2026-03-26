const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All routes require authentication and PATIENT role
router.use(authenticate);
router.use(authorise('PATIENT'));

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Patient appointment management
 */

/**
 * @swagger
 * /api/appointments/me:
 *   get:
 *     tags: [Appointments]
 *     summary: Get patient's appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/me', appointmentController.getMyAppointments);

/**
 * @swagger
 * /api/appointments/book:
 *   post:
 *     tags: [Appointments]
 *     summary: Book an appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slotId]
 *             properties:
 *               slotId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked
 */
router.post('/book', appointmentController.bookAppointment);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     tags: [Appointments]
 *     summary: Cancel an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
