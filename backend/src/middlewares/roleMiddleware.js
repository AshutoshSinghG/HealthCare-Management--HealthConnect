const { error } = require('../utils/apiResponse');

/**
 * Factory that returns middleware restricting access to specific roles.
 * @param  {...string} allowedRoles  e.g. 'ADMIN', 'DOCTOR'
 */
const authorise = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action.', 403);
    }

    next();
  };
};

module.exports = authorise;
