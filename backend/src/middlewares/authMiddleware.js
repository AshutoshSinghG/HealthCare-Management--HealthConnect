const { verifyAccessToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');

/**
 * Authenticate the request by verifying the JWT in the Authorization header.
 * Attaches decoded user payload to req.user.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired. Please refresh.', 401);
    }
    return error(res, 'Invalid token.', 401);
  }
};

module.exports = authenticate;
