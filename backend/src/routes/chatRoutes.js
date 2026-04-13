const router = require('express').Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All chat routes require authentication, allow Doctor OR Patient
router.use(authenticate);
router.use(authorise('DOCTOR', 'PATIENT'));

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time appointment chat
 */

router.get('/active', chatController.getActiveChats);
router.get('/history', chatController.getChatHistory);
router.get('/:slotId/messages', chatController.getMessages);

module.exports = router;
