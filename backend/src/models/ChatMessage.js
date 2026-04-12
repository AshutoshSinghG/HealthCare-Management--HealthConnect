const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    appointmentSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorSlot',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['DOCTOR', 'PATIENT'],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 2000,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

chatMessageSchema.index({ appointmentSlotId: 1, sentAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
