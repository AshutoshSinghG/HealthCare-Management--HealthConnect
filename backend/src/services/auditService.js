const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry.
 * @param {Object} params
 */
const logAction = async ({
  actorUserId,
  actorRole,
  actionType,
  entityType,
  entityId = null,
  oldValues = null,
  newValues = null,
  ipAddress = '',
  userAgent = '',
}) => {
  await AuditLog.create({
    actorUserId,
    actorRole,
    actionType,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  });
};

/**
 * Query audit logs with pagination and filters.
 */
const getAuditLogs = async ({ page = 1, limit = 20, actionType, entityType, actorUserId }) => {
  const filter = {};
  if (actionType) filter.actionType = actionType;
  if (entityType) filter.entityType = entityType;
  if (actorUserId) filter.actorUserId = actorUserId;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ occurredAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actorUserId', 'email role'),
    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { logAction, getAuditLogs };
