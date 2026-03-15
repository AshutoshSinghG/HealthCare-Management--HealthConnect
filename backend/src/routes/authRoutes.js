const router = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const authorise = require('../middlewares/roleMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  mfaVerifySchema,
} = require('../validators/authValidator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & authorization
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role, firstName, lastName]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PATIENT, DOCTOR, ADMIN]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', authLimiter, validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful or MFA required
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout (revoke refresh tokens)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /api/auth/mfa/setup:
 *   post:
 *     tags: [Auth]
 *     summary: Setup MFA (Doctors & Admins)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA setup successful
 */
router.post('/mfa/setup', authenticate, authorise('DOCTOR', 'ADMIN'), authController.setupMFA);

/**
 * @swagger
 * /api/auth/mfa/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify MFA OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tempToken, token]
 *             properties:
 *               tempToken:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA verified
 */
router.post('/mfa/verify', validate(mfaVerifySchema), authController.verifyMFA);

module.exports = router;
