const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate an access token.
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
};

/**
 * Generate a refresh token.
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
};

/**
 * Verify an access token.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify a refresh token.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
