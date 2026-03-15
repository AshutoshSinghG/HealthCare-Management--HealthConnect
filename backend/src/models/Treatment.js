const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    chiefComplaint: {
      type: String,
      required: [true, 'Chief complaint is required'],
      trim: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    icdCode: {
      type: String,
      trim: true,
      default: '',
    },
    treatmentPlan: {
      type: String,
      trim: true,
      default: '',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    followUpInstructions: {
      type: String,
      trim: true,
      default: '',
    },
    outcomeStatus: {
      type: String,
      enum: ['ONGOING', 'RESOLVED', 'REFERRED', 'FOLLOW_UP'],
      default: 'ONGOING',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    version: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Exclude soft-deleted records by default
treatmentSchema.pre(/^find/, function () {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

module.exports = mongoose.model('Treatment', treatmentSchema);
