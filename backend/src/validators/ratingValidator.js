const Joi = require('joi');

const submitRatingSchema = Joi.object({
  appointmentSlotId: Joi.string().trim().min(1).required().messages({
    'any.required': 'Appointment slot ID is required',
    'string.empty': 'Appointment slot ID is required',
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Rating is required',
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be a whole number',
    'number.min': 'Rating must be at least 1 star',
    'number.max': 'Rating cannot exceed 5 stars',
  }),
  review: Joi.string().trim().max(1000).allow('').optional().messages({
    'string.max': 'Review must not exceed 1000 characters',
  }),
});

module.exports = { submitRatingSchema };
