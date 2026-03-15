const { getAuditLogs } = require('../services/auditService');
const { success } = require('../utils/apiResponse');

/**
 * GET /admin/audit-logs
 */
const listAuditLogs = async (req, res, next) => {
  try {
    const result = await getAuditLogs(req.query);
    return success(res, 'Audit logs retrieved', result);
  } catch (err) {
    next(err);
  }
};

module.exports = { listAuditLogs };
