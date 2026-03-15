const bcrypt = require('bcrypt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { generateSecret, generateQRCode, verifyOTP } = require('../utils/generateOTP');
const { logAction } = require('./auditService');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

const MAX_FAILED_ATTEMPTS = 5;

/**
 * Register a new user + role-specific profile.
 */
const register = async (data) => {
  const { email, password, role, firstName, lastName, ...profileData } = data;

  // Check existing user
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  // Create user
  const user = await User.create({
    email,
    passwordHash: password,
    role,
  });

  // Create role-specific profile
  if (role === 'PATIENT') {
    await Patient.create({
      userId: user._id,
      firstName,
      lastName,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      bloodGroup: profileData.bloodGroup || null,
      phoneNumber: profileData.phoneNumber || '',
      address: profileData.address || {},
      emergencyContactName: profileData.emergencyContactName || '',
      emergencyContactPhone: profileData.emergencyContactPhone || '',
      chronicConditions: profileData.chronicConditions || [],
      knownAllergies: profileData.knownAllergies || [],
    });
  } else if (role === 'DOCTOR') {
    await Doctor.create({
      userId: user._id,
      firstName,
      lastName,
      specialisation: profileData.specialisation,
      registrationNumber: profileData.registrationNumber,
      department: profileData.department || '',
      contactEmail: profileData.contactEmail || email,
      contactPhone: profileData.contactPhone || '',
    });
  }

  return user;
};

/**
 * Login a user.
 */
const login = async ({ email, password, ipAddress, userAgent }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is deactivated. Contact support.');
    err.statusCode = 403;
    throw err;
  }

  // Account lockout check
  if (user.isLocked) {
    const err = new Error('Account is locked due to too many failed attempts. Check your email for unlock instructions.');
    err.statusCode = 423;
    throw err;
  }

  // Verify password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.failedLoginCount += 1;

    if (user.failedLoginCount >= MAX_FAILED_ATTEMPTS) {
      user.isLocked = true;

      // Send lock notification email
      try {
        await sendEmail({
          to: user.email,
          subject: 'HealthConnect — Account Locked',
          html: `<p>Your account has been locked after ${MAX_FAILED_ATTEMPTS} failed login attempts. Please contact support to unlock your account.</p>`,
        });
      } catch (emailErr) {
        logger.error(`Failed to send lock email: ${emailErr.message}`);
      }
    }

    await user.save();

    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Reset failed login count on success
  user.failedLoginCount = 0;
  user.lastLoginAt = new Date();
  await user.save();

  // If MFA is enabled, return a temporary token instead
  if (user.mfaEnabled && (user.role === 'DOCTOR' || user.role === 'ADMIN')) {
    // Generate a short-lived temp token that requires MFA verification
    const tempToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      mfaVerified: false,
    });

    await logAction({
      actorUserId: user._id,
      actorRole: user.role,
      actionType: 'LOGIN',
      entityType: 'User',
      entityId: user._id,
      newValues: { mfaPending: true },
      ipAddress,
      userAgent,
    });

    return { mfaRequired: true, tempToken };
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    mfaVerified: true,
  });

  const refreshToken = generateRefreshToken({ userId: user._id });

  // Store refresh token hash
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo: userAgent || '',
  });

  // Log login action
  await logAction({
    actorUserId: user._id,
    actorRole: user.role,
    actionType: 'LOGIN',
    entityType: 'User',
    entityId: user._id,
    ipAddress,
    userAgent,
  });

  return {
    mfaRequired: false,
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };
};

/**
 * Refresh an access token.
 */
const refreshAccessToken = async (refreshTokenStr) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenStr);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  // Find all stored tokens for this user
  const storedTokens = await RefreshToken.find({
    userId: decoded.userId,
    revoked: false,
  });

  // Compare hash to find matching token
  let matchedToken = null;
  for (const stored of storedTokens) {
    const isMatch = await bcrypt.compare(refreshTokenStr, stored.tokenHash);
    if (isMatch) {
      matchedToken = stored;
      break;
    }
  }

  if (!matchedToken) {
    const err = new Error('Refresh token not found or revoked');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    const err = new Error('User not found or inactive');
    err.statusCode = 401;
    throw err;
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    mfaVerified: true,
  });

  return { accessToken };
};

/**
 * Logout — revoke all refresh tokens for the user.
 */
const logout = async ({ userId, ipAddress, userAgent }) => {
  await RefreshToken.updateMany({ userId, revoked: false }, { revoked: true });

  const user = await User.findById(userId);
  await logAction({
    actorUserId: userId,
    actorRole: user?.role || 'UNKNOWN',
    actionType: 'LOGOUT',
    entityType: 'User',
    entityId: userId,
    ipAddress,
    userAgent,
  });
};

/**
 * Setup MFA for a user (Doctor/Admin).
 */
const setupMFA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const secret = generateSecret(user.email);
  user.mfaSecret = secret.base32;
  user.mfaEnabled = true;
  await user.save();

  const qrCode = await generateQRCode(secret.otpauth_url);

  return { secret: secret.base32, qrCode };
};

/**
 * Verify MFA OTP and upgrade the temp token.
 */
const verifyMFA = async ({ tempToken, otpToken }) => {
  let decoded;
  try {
    const { verifyAccessToken } = require('../utils/jwt');
    decoded = verifyAccessToken(tempToken);
  } catch {
    const err = new Error('Invalid or expired temporary token');
    err.statusCode = 401;
    throw err;
  }

  if (decoded.mfaVerified) {
    const err = new Error('MFA already verified');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.mfaSecret) {
    const err = new Error('MFA not set up for this user');
    err.statusCode = 400;
    throw err;
  }

  const isValid = verifyOTP(otpToken, user.mfaSecret);
  if (!isValid) {
    const err = new Error('Invalid OTP token');
    err.statusCode = 401;
    throw err;
  }

  // Generate full access & refresh tokens
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    mfaVerified: true,
  });

  const refreshToken = generateRefreshToken({ userId: user._id });
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, user: user.toJSON() };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  setupMFA,
  verifyMFA,
};
