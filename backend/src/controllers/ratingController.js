const ratingService = require('../services/ratingService');
const { success } = require('../utils/apiResponse');

/**
 * POST /api/ratings
 * Body: { appointmentSlotId, rating, review }
 */
const submitRating = async (req, res, next) => {
  try {
    const rating = await ratingService.submitRating(req.user.userId, req.body);
    return success(res, 'Rating submitted successfully', rating, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings/doctor/:doctorId
 */
const getDoctorRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getDoctorRatings(req.params.doctorId);
    return success(res, 'Doctor ratings retrieved', ratings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings/doctor/:doctorId/average
 */
const getDoctorAverage = async (req, res, next) => {
  try {
    const stats = await ratingService.getDoctorAverageRating(req.params.doctorId);
    return success(res, 'Doctor average rating retrieved', stats);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings/check/:slotId
 */
const checkRating = async (req, res, next) => {
  try {
    const rating = await ratingService.getPatientRatingForSlot(req.user.userId, req.params.slotId);
    return success(res, 'Rating check complete', { hasRated: !!rating, rating });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitRating,
  getDoctorRatings,
  getDoctorAverage,
  checkRating
};
