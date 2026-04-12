const mongoose = require('mongoose');

const doctorSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    from: {
      type: String,
      required: [true, 'Start time is required'],
    },
    to: {
      type: String,
      required: [true, 'End time is required'],
    },
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
    patient: {
      type: String,
      default: '',
    },
    patientId: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['booked', 'pending', 'rejected', 'vacant'],
      default: 'vacant',
    },
  },
  { timestamps: true }
);

doctorSlotSchema.index({ doctorId: 1, date: 1 });

module.exports = mongoose.model('DoctorSlot', doctorSlotSchema);
