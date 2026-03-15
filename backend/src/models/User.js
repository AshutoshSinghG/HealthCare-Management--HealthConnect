const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
      required: [true, 'Role is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    failedLoginCount: {
      type: Number,
      default: 0,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

/**
 * Compare a candidate password against the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Strip sensitive fields from JSON output.
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.mfaSecret;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
