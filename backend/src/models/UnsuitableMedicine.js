const mongoose = require('mongoose');

const unsuitableMedicineSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    flaggedByDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'MODERATE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    removedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    removedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UnsuitableMedicine', unsuitableMedicineSchema);
