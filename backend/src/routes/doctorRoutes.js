const router = require('express').Router();
const doctorController = require('../controllers/doctorController');
const treatmentController = require('../controllers/treatmentController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createTreatmentSchema } = require('../validators/treatmentValidator');
const { unsuitableMedicineSchema } = require('../validators/patientValidator');

// All routes require authentication and DOCTOR role
router.use(authenticate);
router.use(authorise('DOCTOR'));

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor-facing endpoints
 */

router.get('/me/dashboard', doctorController.getDashboard);

/**
 * @swagger
 * /api/doctors/me:
 *   get:
 *     tags: [Doctors]
 *     summary: Get doctor profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile
 */
router.get('/me', doctorController.getProfile);

/**
 * @swagger
 * /api/doctors/me/patients:
 *   get:
 *     tags: [Doctors]
 *     summary: Get patients treated by this doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patients list
 */
router.get('/me/patients', doctorController.getPatients);

/**
 * @swagger
 * /api/doctors/me/patients/{patientId}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get patient detail with treatments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient detail
 */
router.get('/me/patients/:patientId', doctorController.getPatientDetail);

/**
 * @swagger
 * /api/doctors/me/patients/{patientId}/treatments:
 *   post:
 *     tags: [Doctors]
 *     summary: Create treatment record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [visitDate, chiefComplaint, diagnosis]
 *             properties:
 *               visitDate:
 *                 type: string
 *                 format: date
 *               chiefComplaint:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Treatment created
 */
router.post(
  '/me/patients/:patientId/treatments',
  validate(createTreatmentSchema),
  treatmentController.createTreatment
);

/**
 * @swagger
 * /api/doctors/patients/{patientId}/unsuitable-medicines:
 *   post:
 *     tags: [Doctors]
 *     summary: Flag an unsuitable medicine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Medicine flagged
 */
router.post(
  '/patients/:patientId/unsuitable-medicines',
  validate(unsuitableMedicineSchema),
  treatmentController.flagUnsuitableMedicine
);

/**
 * @swagger
 * /api/doctors/unsuitable-medicines/{id}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Remove unsuitable medicine flag
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
 *         description: Flag removed
 */
router.delete('/unsuitable-medicines/:id', treatmentController.removeUnsuitableFlag);

module.exports = router;
