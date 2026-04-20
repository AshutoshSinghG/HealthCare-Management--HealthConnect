const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorSlot',
      required: true,
      unique: true, // Prevents multiple ratings for the same appointment
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch all ratings for a doctor, sorted by newest
ratingSchema.index({ doctorId: 1, createdAt: -1 });

module.exports = mongoose.model('Rating', ratingSchema);
