const router = require('express').Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { updatePatientSchema } = require('../validators/patientValidator');

// All routes require authentication and PATIENT role
router.use(authenticate);
router.use(authorise('PATIENT'));

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient self-service endpoints
 */

router.get('/me/dashboard', patientController.getDashboard);

/**
 * @swagger
 * /api/patients/me:
 *   get:
 *     tags: [Patients]
 *     summary: Get patient profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile
 */
router.get('/me', patientController.getProfile);

/**
 * @swagger
 * /api/patients/me:
 *   put:
 *     tags: [Patients]
 *     summary: Update patient profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me', validate(updatePatientSchema), patientController.updateProfile);

/**
 * @swagger
 * /api/patients/me/treatments:
 *   get:
 *     tags: [Patients]
 *     summary: Get treatment history
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
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment list
 */
router.get('/me/treatments', patientController.getTreatments);

/**
 * @swagger
 * /api/patients/me/treatments/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Get treatment detail
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
 *         description: Treatment detail with medications
 */
router.get('/me/treatments/:id', patientController.getTreatmentById);

/**
 * @swagger
 * /api/patients/me/unsuitable-medicines:
 *   get:
 *     tags: [Patients]
 *     summary: Get unsuitable medicines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unsuitable medicines list
 */
router.get('/me/unsuitable-medicines', patientController.getUnsuitableMedicines);

router.get('/me/medications', patientController.getMedications);

module.exports = router;
