const router = require('express').Router();
const ratingController = require('../controllers/ratingController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

router.use(authenticate);

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     tags: [Ratings]
 *     summary: Submit a doctor rating (Patient only)
 */
router.post('/', authorise('PATIENT'), ratingController.submitRating);

/**
 * @swagger
 * /api/ratings/check/{slotId}:
 *   get:
 *     tags: [Ratings]
 *     summary: Check if patient has rated this appointment (Patient only)
 */
router.get('/check/:slotId', authorise('PATIENT'), ratingController.checkRating);

/**
 * @swagger
 * /api/ratings/doctor/{doctorId}:
 *   get:
 *     tags: [Ratings]
 *     summary: Get all ratings for a doctor
 */
router.get('/doctor/:doctorId', ratingController.getDoctorRatings);

/**
 * @swagger
 * /api/ratings/doctor/{doctorId}/average:
 *   get:
 *     tags: [Ratings]
 *     summary: Get average rating and review count for a doctor
 */
router.get('/doctor/:doctorId/average', ratingController.getDoctorAverage);

module.exports = router;
