const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('PATIENT', 'DOCTOR', 'ADMIN').required().messages({
    'any.only': 'Role must be PATIENT, DOCTOR, or ADMIN',
    'any.required': 'Role is required',
  }),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),

  // Patient-specific fields
  dateOfBirth: Joi.date().when('role', { is: 'PATIENT', then: Joi.required() }),
  gender: Joi.string().valid('Male', 'Female', 'Other').when('role', { is: 'PATIENT', then: Joi.required() }),
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
  emergencyContactPhone: Joi.string().allow('').optional(),
  chronicConditions: Joi.array().items(Joi.string()).optional(),
  knownAllergies: Joi.array().items(Joi.string()).optional(),

  // Doctor-specific fields
  specialisation: Joi.string().trim().when('role', { is: 'DOCTOR', then: Joi.required() }),
  registrationNumber: Joi.string().trim().when('role', { is: 'DOCTOR', then: Joi.required() }),
  department: Joi.string().trim().optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().trim().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

const mfaVerifySchema = Joi.object({
  token: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP token is required',
  }),
  tempToken: Joi.string().required().messages({
    'any.required': 'Temporary token is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  mfaVerifySchema,
};
