const authService = require('../services/authService');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /auth/register
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, 'Registration successful', { user: user.toJSON() }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (result.mfaRequired) {
      return success(res, 'MFA verification required', {
        mfaRequired: true,
        tempToken: result.tempToken,
      });
    }

    return success(res, 'Login successful', {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/refresh
 */
const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    return success(res, 'Token refreshed', result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/logout
 */
const logout = async (req, res, next) => {
  try {
    await authService.logout({
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/mfa/setup
 */
const setupMFA = async (req, res, next) => {
  try {
    const result = await authService.setupMFA(req.user.userId);
    return success(res, 'MFA setup successful', result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/mfa/verify
 */
const verifyMFA = async (req, res, next) => {
  try {
    const result = await authService.verifyMFA({
      tempToken: req.body.tempToken,
      otpToken: req.body.token,
    });
    return success(res, 'MFA verified successfully', result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, setupMFA, verifyMFA };
