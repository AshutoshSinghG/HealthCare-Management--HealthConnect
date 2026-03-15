const router = require('express').Router();
const exportController = require('../controllers/exportController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All routes require authentication and PATIENT role
router.use(authenticate);
router.use(authorise('PATIENT'));

/**
 * @swagger
 * tags:
 *   name: Exports
 *   description: Medical record exports
 */

/**
 * @swagger
 * /api/patients/me/export/pdf:
 *   get:
 *     tags: [Exports]
 *     summary: Export medical records as PDF
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/pdf', exportController.exportPDF);

/**
 * @swagger
 * /api/patients/me/export/excel:
 *   get:
 *     tags: [Exports]
 *     summary: Export medical records as Excel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/excel', exportController.exportExcel);

module.exports = router;
