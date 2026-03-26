const router = require('express').Router();
const publicDoctorController = require('../controllers/publicDoctorController');
const authenticate = require('../middlewares/authMiddleware');

// All public doctor routes require authentication (any role)
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Public Doctors
 *   description: Public doctor listing for appointment booking
 */

/**
 * @swagger
 * /api/public/doctors:
 *   get:
 *     tags: [Public Doctors]
 *     summary: List all doctors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctors list
 */
router.get('/doctors', publicDoctorController.listDoctors);

/**
 * @swagger
 * /api/public/specialties:
 *   get:
 *     tags: [Public Doctors]
 *     summary: Get list of specialties
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Specialties list
 */
router.get('/specialties', publicDoctorController.getSpecialties);

/**
 * @swagger
 * /api/public/doctors/{doctorId}/slots:
 *   get:
 *     tags: [Public Doctors]
 *     summary: Get available slots for a doctor on a date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slots list
 */
router.get('/doctors/:doctorId/slots', publicDoctorController.getDoctorSlots);

module.exports = router;
