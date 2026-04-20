import api from './axios';

/**
 * Submit a rating for a completed appointment (Patient only)
 * @param {Object} data { appointmentSlotId, rating, review }
 */
export const submitRating = async (data) => {
  const response = await api.post('/ratings', data);
  return response.data.data;
};

/**
 * Check if the patient has already rated this appointment slot (Patient only)
 * @param {string} slotId
 */
export const checkRating = async (slotId) => {
  const response = await api.get(`/ratings/check/${slotId}`);
  return response.data.data;
};

/**
 * Get all ratings for a specific doctor
 * @param {string} doctorId
 */
export const getDoctorRatings = async (doctorId) => {
  const response = await api.get(`/ratings/doctor/${doctorId}`);
  return response.data.data;
};

/**
 * Get the average rating and review count for a doctor
 * @param {string} doctorId
 */
export const getDoctorAverageRating = async (doctorId) => {
  const response = await api.get(`/ratings/doctor/${doctorId}/average`);
  return response.data.data;
};
