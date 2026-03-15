require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/healthconnect',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'default_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Email
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
};

module.exports = env;
