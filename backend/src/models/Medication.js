const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
  {
    treatmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment',
      required: true,
      index: true,
    },
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true,
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    routeOfAdmin: {
      type: String,
      enum: ['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'SUBLINGUAL', 'RECTAL', 'OTHER'],
      default: 'ORAL',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Medication', medicationSchema);
