const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
      required: true,
    },
    actionType: {
      type: String,
      enum: ['LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT'],
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Use occurredAt instead
  }
);

// Prevent modifications to audit logs
auditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('Audit logs cannot be modified');
});

auditLogSchema.pre('updateOne', function () {
  throw new Error('Audit logs cannot be modified');
});

auditLogSchema.pre('updateMany', function () {
  throw new Error('Audit logs cannot be modified');
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
