const Rating = require('../models/Rating');
const DoctorSlot = require('../models/DoctorSlot');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

/**
 * Submit or update a rating for an appointment
 */
const submitRating = async (userId, data) => {
  const { appointmentSlotId, rating, review } = data;

  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const slot = await DoctorSlot.findById(appointmentSlotId);
  if (!slot) {
    const err = new Error('Appointment slot not found');
    err.statusCode = 404;
    throw err;
  }

  if (slot.patientId !== patient._id.toString()) {
    const err = new Error('You can only rate your own appointments');
    err.statusCode = 403;
    throw err;
  }

  if (slot.status !== 'completed' && slot.status !== 'booked') {
     const err = new Error('You can only rate completed appointments');
     err.statusCode = 400;
     throw err;
  }

  // Use upsert to create or update existing rating for this slot
  const result = await Rating.findOneAndUpdate(
    { appointmentSlotId: slot._id },
    {
      doctorId: slot.doctorId,
      patientId: patient._id,
      rating,
      review: review || '',
    },
    { new: true, upsert: true, runValidators: true }
  );

  return result;
};

/**
 * Get all ratings for a specific doctor
 */
const getDoctorRatings = async (doctorId) => {
  const ratings = await Rating.find({ doctorId })
    .populate('patientId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .lean();

  return ratings.map(r => ({
    id: r._id,
    rating: r.rating,
    review: r.review,
    date: r.createdAt,
    patientName: r.patientId ? `${r.patientId.firstName} ${r.patientId.lastName}` : 'Unknown Patient',
  }));
};

/**
 * Get average rating and total count for a specific doctor
 */
const getDoctorAverageRating = async (doctorId) => {
  const result = await Rating.aggregate([
    { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    return {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews
    };
  }

  return { averageRating: 0, totalReviews: 0 };
};

/**
 * Batch fetch average ratings for multiple doctors
 * Useful for doctor listing pages to avoid N+1 queries
 */
const getMultipleDoctorAverages = async (doctorIds) => {
  if (!doctorIds || doctorIds.length === 0) return {};

  const objectIds = doctorIds.map(id => new mongoose.Types.ObjectId(id));

  const results = await Rating.aggregate([
    { $match: { doctorId: { $in: objectIds } } },
    {
      $group: {
        _id: '$doctorId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const map = {};
  results.forEach(r => {
    map[r._id.toString()] = {
      averageRating: Number(r.averageRating.toFixed(1)),
      totalReviews: r.totalReviews
    };
  });

  return map;
};

/**
 * Check if a patient has already rated a specific slot, and return it if so
 */
const getPatientRatingForSlot = async (userId, slotId) => {
   const patient = await Patient.findOne({ userId });
   if (!patient) return null;

   const rating = await Rating.findOne({ 
     patientId: patient._id,
     appointmentSlotId: slotId 
   }).lean();

   return rating;
};

module.exports = {
  submitRating,
  getDoctorRatings,
  getDoctorAverageRating,
  getMultipleDoctorAverages,
  getPatientRatingForSlot
};
