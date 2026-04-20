const Joi = require('joi');

const createTreatmentSchema = Joi.object({
  visitDate: Joi.date().required().messages({
    'any.required': 'Visit date is required',
  }),
  chiefComplaint: Joi.string().trim().min(1).max(1000).required().messages({
    'any.required': 'Chief complaint is required',
  }),
  diagnosis: Joi.string().trim().min(1).max(1000).required().messages({
    'any.required': 'Diagnosis is required',
  }),
  icdCode: Joi.string().trim().allow('', null).optional(),
  treatmentPlan: Joi.string().trim().min(1).required().messages({
    'any.required': 'Treatment plan is required',
  }),
  followUpDate: Joi.date().allow('', null).optional(),
  instructions: Joi.string().trim().allow('', null).optional(),
  outcome: Joi.string()
    .valid('ONGOING', 'RESOLVED', 'REFERRED', 'FOLLOW_UP', '')
    .allow('', null)
    .default('ONGOING'),
  notes: Joi.string().trim().allow('', null).optional(),
  medications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          'any.required': 'Medicine name is required',
          'string.empty': 'Medicine name is required',
        }),
        dosage: Joi.string().trim().required().messages({
          'any.required': 'Dosage is required',
          'string.empty': 'Dosage is required',
        }),
        frequency: Joi.string().trim().allow('').optional(),
        duration: Joi.string().trim().allow('').optional(),
        route: Joi.string().trim().allow('').optional(),
        notes: Joi.string().trim().allow('').optional(),
      })
    )
    .optional(),
});

const updateTreatmentSchema = Joi.object({
  chiefComplaint: Joi.string().trim().min(1).max(1000).optional(),
  diagnosis: Joi.string().trim().min(1).max(1000).optional(),
  icdCode: Joi.string().trim().allow('').optional(),
  treatmentPlan: Joi.string().trim().allow('').optional(),
  followUpDate: Joi.date().allow(null).optional(),
  instructions: Joi.string().trim().allow('').optional(),
  outcome: Joi.string()
    .valid('ONGOING', 'RESOLVED', 'REFERRED', 'FOLLOW_UP', '')
    .optional(),
  notes: Joi.string().trim().allow('').optional(),
  medications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          'any.required': 'Medicine name is required',
          'string.empty': 'Medicine name is required',
        }),
        dosage: Joi.string().trim().required().messages({
          'any.required': 'Dosage is required',
          'string.empty': 'Dosage is required',
        }),
        frequency: Joi.string().trim().allow('').optional(),
        duration: Joi.string().trim().allow('').optional(),
        route: Joi.string().trim().allow('').optional(),
        notes: Joi.string().trim().allow('').optional(),
      })
    )
    .optional(),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update',
});

module.exports = { createTreatmentSchema, updateTreatmentSchema };
