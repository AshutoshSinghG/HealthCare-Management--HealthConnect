const Joi = require('joi');

const updatePatientSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'First name cannot be empty',
    'string.max': 'First name must not exceed 100 characters',
  }),
  lastName: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Last name cannot be empty',
    'string.max': 'Last name must not exceed 100 characters',
  }),
  dateOfBirth: Joi.date().optional().messages({
    'date.base': 'Please provide a valid date of birth',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional().messages({
    'any.only': 'Gender must be Male, Female, or Other',
  }),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional().messages({
    'any.only': 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
  }),
  phoneNumber: Joi.string().trim().pattern(/^\d{10,15}$/).optional().messages({
    'string.pattern.base': 'Phone number must be 10-15 digits',
  }),
  address: Joi.object({
    street: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    state: Joi.string().allow('').optional(),
    zipCode: Joi.string().allow('').pattern(/^[a-zA-Z0-9\s\-]{3,10}$/).optional().messages({
      'string.pattern.base': 'Zip/postal code must be 3-10 alphanumeric characters',
    }),
    country: Joi.string().allow('').optional(),
  }).optional(),
  emergencyContactName: Joi.string().allow('').optional(),
  emergencyContactRelation: Joi.string().allow('').optional(),
  emergencyContactPhone: Joi.string().allow('').optional(),
  emergencyContactAddress: Joi.string().allow('').optional(),
  chronicConditions: Joi.array().items(Joi.string()).optional(),
  knownAllergies: Joi.array().items(Joi.string()).optional(),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update',
});

const unsuitableMedicineSchema = Joi.object({
  medicineName: Joi.string().trim().min(1).required().messages({
    'any.required': 'Medicine name is required',
  }),
  reason: Joi.string().trim().min(1).required().messages({
    'any.required': 'Reason is required',
  }),
  severity: Joi.string().valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL').default('MODERATE'),
});

module.exports = { updatePatientSchema, unsuitableMedicineSchema };
