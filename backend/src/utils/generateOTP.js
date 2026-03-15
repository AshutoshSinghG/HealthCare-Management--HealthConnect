const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate a TOTP secret for MFA.
 */
const generateSecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `HealthConnect (${email})`,
    issuer: 'HealthConnect',
  });
  return secret;
};

/**
 * Generate a QR code data URL from an OTP auth URL.
 */
const generateQRCode = async (otpauthUrl) => {
  return QRCode.toDataURL(otpauthUrl);
};

/**
 * Verify a TOTP token against a secret.
 */
const verifyOTP = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allow 1 step tolerance
  });
};

module.exports = { generateSecret, generateQRCode, verifyOTP };
