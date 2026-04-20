/**
 * Centralized error extraction utility.
 * Extracts the most specific, user-friendly error message from an axios error
 * or any thrown error object.
 *
 * Priority:
 *   1. err.response.data.errors[] — field-level validation messages (joined)
 *   2. err.response.data.message  — single backend error message
 *   3. err.message                — network / timeout / JS error
 *   4. Fallback                   — generic message
 */

/**
 * @param {Error|import('axios').AxiosError} err
 * @param {string} [fallback] Optional custom fallback message
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (err, fallback = 'An unexpected error occurred. Please try again.') => {
  // Axios error with a response from the server
  if (err?.response?.data) {
    const { data } = err.response;

    // Field-level validation errors array (from Joi middleware or Mongoose)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join('. ');
    }

    // Single backend message
    if (data.message && data.message !== 'Internal server error') {
      return data.message;
    }
  }

  // Network error, timeout, or other JS error
  if (err?.message) {
    // Axios wraps network errors with unhelpful messages — make them friendlier
    if (err.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (err.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }
    return err.message;
  }

  return fallback;
};
