const router = require('express').Router();
const treatmentController = require('../controllers/treatmentController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { updateTreatmentSchema } = require('../validators/treatmentValidator');

// All routes require authentication and DOCTOR role
router.use(authenticate);
router.use(authorise('DOCTOR'));

/**
 * @swagger
 * tags:
 *   name: Treatments
 *   description: Treatment management
 */

/**
 * @swagger
 * /api/treatments/{treatmentId}:
 *   put:
 *     tags: [Treatments]
 *     summary: Update a treatment record (owner doctor only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: treatmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment updated
 */
router.get('/:treatmentId', treatmentController.getTreatmentById);
router.put('/:treatmentId', validate(updateTreatmentSchema), treatmentController.updateTreatment);

/**
 * @swagger
 * /api/treatments/{treatmentId}:
 *   delete:
 *     tags: [Treatments]
 *     summary: Soft-delete a treatment record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: treatmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment deleted
 */
router.delete('/:treatmentId', treatmentController.deleteTreatment);

module.exports = router;
