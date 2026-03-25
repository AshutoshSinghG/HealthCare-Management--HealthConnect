const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    specialisation: {
      type: String,
      required: [true, 'Specialisation is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    qualifications: {
      type: String,
      trim: true,
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    consultationHours: {
      type: String,
      trim: true,
      default: '',
    },
    languages: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    dateOfBirth: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
