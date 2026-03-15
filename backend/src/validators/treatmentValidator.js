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
  icdCode: Joi.string().trim().allow('').optional(),
  treatmentPlan: Joi.string().trim().allow('').optional(),
  followUpDate: Joi.date().allow(null).optional(),
  followUpInstructions: Joi.string().trim().allow('').optional(),
  outcomeStatus: Joi.string()
    .valid('ONGOING', 'RESOLVED', 'REFERRED', 'FOLLOW_UP')
    .default('ONGOING'),
  notes: Joi.string().trim().allow('').optional(),
  medications: Joi.array()
    .items(
      Joi.object({
        medicineName: Joi.string().trim().required(),
        dosage: Joi.string().trim().required(),
        frequency: Joi.string().trim().required(),
        durationDays: Joi.number().integer().min(1).required(),
        routeOfAdmin: Joi.string()
          .valid('ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'SUBLINGUAL', 'RECTAL', 'OTHER')
          .default('ORAL'),
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
  followUpInstructions: Joi.string().trim().allow('').optional(),
  outcomeStatus: Joi.string()
    .valid('ONGOING', 'RESOLVED', 'REFERRED', 'FOLLOW_UP')
    .optional(),
  notes: Joi.string().trim().allow('').optional(),
}).min(1);

module.exports = { createTreatmentSchema, updateTreatmentSchema };
