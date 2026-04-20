const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 128 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password is required',
  }),
  role: Joi.string().valid('PATIENT', 'DOCTOR', 'ADMIN').required().messages({
    'any.only': 'Role must be PATIENT, DOCTOR, or ADMIN',
    'any.required': 'Role is required',
  }),
  firstName: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'First name is required',
    'string.empty': 'First name is required',
    'string.max': 'First name must not exceed 100 characters',
  }),
  lastName: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'Last name is required',
    'string.empty': 'Last name is required',
    'string.max': 'Last name must not exceed 100 characters',
  }),

  // Patient-specific fields
  dateOfBirth: Joi.date().when('role', { is: 'PATIENT', then: Joi.required() }).messages({
    'any.required': 'Date of birth is required for patients',
    'date.base': 'Please provide a valid date of birth',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').when('role', { is: 'PATIENT', then: Joi.required() }).messages({
    'any.required': 'Gender is required for patients',
    'any.only': 'Gender must be Male, Female, or Other',
  }),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional().messages({
    'any.only': 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
  }),
  phoneNumber: Joi.string().trim().optional().messages({
    'string.base': 'Phone number must be a valid string',
  }),
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
  specialisation: Joi.string().trim().when('role', { is: 'DOCTOR', then: Joi.required() }).messages({
    'any.required': 'Specialisation is required for doctors',
    'string.empty': 'Specialisation is required for doctors',
  }),
  registrationNumber: Joi.string().trim().when('role', { is: 'DOCTOR', then: Joi.required() }).messages({
    'any.required': 'Registration number is required for doctors',
    'string.empty': 'Registration number is required for doctors',
  }),
  department: Joi.string().trim().optional(),
  contactEmail: Joi.string().email().optional().messages({
    'string.email': 'Contact email must be a valid email address',
  }),
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
