const router = require('express').Router();
const auditController = require('../controllers/auditController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorise('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/dashboard', auditController.getDashboard);

/**
 * @swagger
 * /api/admin/audit-logs:
 *   get:
 *     tags: [Admin]
 *     summary: List audit logs
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
 *         name: actionType
 *         schema:
 *           type: string
 *           enum: [LOGIN, LOGOUT, CREATE, READ, UPDATE, DELETE, EXPORT]
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *       - in: query
 *         name: actorUserId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated audit logs
 */
router.get('/audit-logs', auditController.listAuditLogs);

module.exports = router;
