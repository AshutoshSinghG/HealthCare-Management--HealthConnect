const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      unique: true,
      index: true,
    },
    startTime: {
      type: String,
      default: '09:00',
    },
    endTime: {
      type: String,
      default: '17:00',
    },
    consultationFee: {
      type: Number,
      default: 150,
    },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
