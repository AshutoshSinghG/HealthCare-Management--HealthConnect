const router = require('express').Router();
const slotController = require('../controllers/slotController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

router.use(authenticate);
router.use(authorise('DOCTOR'));

router.get('/me/slots', slotController.getSlots);
router.post('/me/slots', slotController.createSlot);
router.delete('/me/slots/:id', slotController.deleteSlot);
router.patch('/me/slots/:id/status', slotController.updateSlotStatus);
router.get('/me/availability', slotController.getAvailability);
router.put('/me/availability', slotController.updateAvailability);

module.exports = router;
