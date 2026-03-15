/**
 * Standardised API response helpers.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*} data
 * @param {number} statusCode
 */
const success = (res, message = 'Request successful', data = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {Array} errors
 */
const error = (res, message = 'Something went wrong', statusCode = 500, errors = []) => {
  const payload = { success: false, message };
  if (errors.length) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { success, error };
