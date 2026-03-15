const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to       Recipient email
 * @param {string} options.subject  Email subject
 * @param {string} options.html     HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"HealthConnect" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
