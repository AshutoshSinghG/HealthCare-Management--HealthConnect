const Joi = require('joi');

const updatePatientSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).optional(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  phoneNumber: Joi.string().trim().optional(),
  address: Joi.object({
    street: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    state: Joi.string().allow('').optional(),
    zipCode: Joi.string().allow('').optional(),
    country: Joi.string().allow('').optional(),
  }).optional(),
  emergencyContactName: Joi.string().allow('').optional(),
  emergencyContactRelation: Joi.string().allow('').optional(),
  emergencyContactPhone: Joi.string().allow('').optional(),
  emergencyContactAddress: Joi.string().allow('').optional(),
  chronicConditions: Joi.array().items(Joi.string()).optional(),
  knownAllergies: Joi.array().items(Joi.string()).optional(),
}).min(1);

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
