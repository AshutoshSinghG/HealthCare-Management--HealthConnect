const logger = require('../utils/logger');

/**
 * Global error handling middleware.
 * Always returns a structured JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  logger.error(err.message, { stack: err.stack });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(409).json({
      success: false,
      message: `Duplicate value for: ${field}`,
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired.' });
  }

  // Default
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
