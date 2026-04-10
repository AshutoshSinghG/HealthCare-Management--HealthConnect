const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const UnsuitableMedicine = require('../models/UnsuitableMedicine');
const AuditLog = require('../models/AuditLog');
const { logAction } = require('./auditService');
const crypto = require('crypto');

// ─── User Management ──────────────────────────────────────────

/**
 * List all users with optional search and role filter.
 * Returns shape matching frontend UserManagement component expectations.
 */
const listUsers = async (query = {}) => {
  const filter = {};
  if (query.role) {
    filter.role = query.role.toUpperCase();
  }
  if (query.search) {
    filter.$or = [
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).lean();

  // Fetch associated profile names
  const doctorProfiles = await Doctor.find({
    userId: { $in: users.filter(u => u.role === 'DOCTOR').map(u => u._id) },
  }).lean();
  const patientProfiles = await Patient.find({
    userId: { $in: users.filter(u => u.role === 'PATIENT').map(u => u._id) },
  }).lean();

  const doctorMap = {};
  doctorProfiles.forEach(d => { doctorMap[d.userId.toString()] = `Dr. ${d.firstName} ${d.lastName}`; });
  const patientMap = {};
  patientProfiles.forEach(p => { patientMap[p.userId.toString()] = `${p.firstName} ${p.lastName}`; });

  return users.map(u => {
    let name = u.email;
    if (u.role === 'DOCTOR') name = doctorMap[u._id.toString()] || u.email;
    else if (u.role === 'PATIENT') name = patientMap[u._id.toString()] || u.email;
    else name = 'Admin User';

    return {
      id: u._id,
      name,
      email: u.email,
      role: u.role.toLowerCase(),
      status: u.isActive ? 'active' : 'disabled',
      locked: u.isLocked || false,
      lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never',
      mfa: u.mfaEnabled || false,
    };
  });
};

/**
 * Create a new user (and optionally associated profile).
 */
const createUser = async ({ name, email, role, phone }, adminUserId) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('User with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  // Generate a temporary password
  const tempPassword = crypto.randomBytes(8).toString('hex');

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash: tempPassword, // Will be hashed by pre-save hook
    role: role.toUpperCase(),
    isActive: true,
  });

  // Create associated profile
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  if (role.toUpperCase() === 'DOCTOR') {
    await Doctor.create({
      userId: user._id,
      firstName,
      lastName,
      specialisation: 'General Medicine',
      registrationNumber: `REG-${Date.now()}`,
      contactEmail: email,
      contactPhone: phone || '',
    });
  } else if (role.toUpperCase() === 'PATIENT') {
    await Patient.create({
      userId: user._id,
      firstName,
      lastName,
      dateOfBirth: new Date('2000-01-01'),
      gender: 'Other',
      phoneNumber: phone || '',
    });
  }

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'CREATE',
    entityType: 'User',
    entityId: user._id,
    newValues: { email, role },
  });

  return {
    id: user._id,
    name,
    email: user.email,
    role: role.toLowerCase(),
    status: 'active',
    locked: false,
    lastLogin: 'Never',
    mfa: false,
  };
};

/**
 * Toggle user active/disabled status.
 */
const toggleUserStatus = async (userId, adminUserId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  user.isActive = !user.isActive;
  await user.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'User',
    entityId: userId,
    newValues: { isActive: user.isActive },
  });

  return { status: user.isActive ? 'active' : 'disabled' };
};

/**
 * Toggle user lock status.
 */
const toggleUserLock = async (userId, adminUserId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  user.isLocked = !user.isLocked;
  if (!user.isLocked) user.failedLoginCount = 0;
  await user.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'User',
    entityId: userId,
    newValues: { isLocked: user.isLocked },
  });

  return { locked: user.isLocked };
};

/**
 * Change user role.
 */
const changeUserRole = async (userId, newRole, adminUserId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const oldRole = user.role;
  user.role = newRole.toUpperCase();
  await user.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'User',
    entityId: userId,
    oldValues: { role: oldRole },
    newValues: { role: user.role },
  });

  return { role: user.role.toLowerCase() };
};

/**
 * Reset user password (generate temp password).
 */
const resetUserPassword = async (userId, adminUserId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const tempPassword = crypto.randomBytes(8).toString('hex');
  user.passwordHash = tempPassword;
  await user.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'User',
    entityId: userId,
    newValues: { passwordReset: true },
  });

  return { message: 'Password reset successfully' };
};

// ─── Doctor Management ──────────────────────────────────────────

/**
 * List all doctors for admin view.
 */
const listDoctorsAdmin = async (query = {}) => {
  const filter = {};
  if (query.search) {
    const term = query.search;
    filter.$or = [
      { firstName: { $regex: term, $options: 'i' } },
      { lastName: { $regex: term, $options: 'i' } },
      { specialisation: { $regex: term, $options: 'i' } },
      { contactEmail: { $regex: term, $options: 'i' } },
    ];
  }

  const doctors = await Doctor.find(filter).lean();

  // Get patient & treatment counts per doctor
  const doctorIds = doctors.map(d => d._id);
  const treatmentCounts = await Treatment.aggregate([
    { $match: { doctorId: { $in: doctorIds } } },
    { $group: { _id: '$doctorId', count: { $sum: 1 }, patients: { $addToSet: '$patientId' } } },
  ]);

  const countMap = {};
  treatmentCounts.forEach(t => {
    countMap[t._id.toString()] = { treatments: t.count, patients: t.patients.length };
  });

  return doctors.map(doc => ({
    id: doc._id,
    name: `Dr. ${doc.firstName} ${doc.lastName}`,
    email: doc.contactEmail || '',
    phone: doc.contactPhone || '',
    specialty: doc.specialisation || '',
    department: doc.department || '',
    qualifications: doc.qualifications || '',
    status: 'active',
    patients: countMap[doc._id.toString()]?.patients || 0,
    treatments: countMap[doc._id.toString()]?.treatments || 0,
  }));
};

/**
 * Create a new doctor (with User account).
 */
const createDoctor = async (data, adminUserId) => {
  const nameParts = (data.name || '').trim().split(' ');
  const firstName = (nameParts[0] || '').replace('Dr.', '').trim();
  const lastName = nameParts.slice(1).join(' ').replace('Dr.', '').trim();

  // Create user account
  const tempPassword = crypto.randomBytes(8).toString('hex');
  const user = await User.create({
    email: (data.email || '').toLowerCase(),
    passwordHash: tempPassword,
    role: 'DOCTOR',
    isActive: true,
  });

  const doctor = await Doctor.create({
    userId: user._id,
    firstName: firstName || 'New',
    lastName: lastName || 'Doctor',
    specialisation: data.specialty || 'General Medicine',
    registrationNumber: `REG-${Date.now()}`,
    department: data.department || '',
    contactEmail: data.email || '',
    contactPhone: data.phone || '',
    qualifications: data.qualifications || '',
  });

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'CREATE',
    entityType: 'Doctor',
    entityId: doctor._id,
    newValues: { name: data.name, email: data.email },
  });

  return {
    id: doctor._id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    email: doctor.contactEmail,
    phone: doctor.contactPhone,
    specialty: doctor.specialisation,
    department: doctor.department,
    qualifications: doctor.qualifications,
    status: 'active',
    patients: 0,
    treatments: 0,
  };
};

/**
 * Update doctor details.
 */
const updateDoctor = async (doctorId, data, adminUserId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const err = new Error('Doctor not found');
    err.statusCode = 404;
    throw err;
  }

  if (data.name) {
    const nameParts = data.name.replace('Dr.', '').trim().split(' ');
    doctor.firstName = nameParts[0] || doctor.firstName;
    doctor.lastName = nameParts.slice(1).join(' ') || doctor.lastName;
  }
  if (data.email !== undefined) doctor.contactEmail = data.email;
  if (data.phone !== undefined) doctor.contactPhone = data.phone;
  if (data.specialty !== undefined) doctor.specialisation = data.specialty;
  if (data.department !== undefined) doctor.department = data.department;
  if (data.qualifications !== undefined) doctor.qualifications = data.qualifications;

  await doctor.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'Doctor',
    entityId: doctorId,
    newValues: data,
  });

  return {
    id: doctor._id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    email: doctor.contactEmail,
    phone: doctor.contactPhone,
    specialty: doctor.specialisation,
    department: doctor.department,
    qualifications: doctor.qualifications,
  };
};

/**
 * Remove a doctor.
 */
const removeDoctor = async (doctorId, adminUserId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const err = new Error('Doctor not found');
    err.statusCode = 404;
    throw err;
  }

  // Also disable the user account
  if (doctor.userId) {
    await User.findByIdAndUpdate(doctor.userId, { isActive: false });
  }

  await Doctor.findByIdAndDelete(doctorId);

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'DELETE',
    entityType: 'Doctor',
    entityId: doctorId,
  });

  return { message: 'Doctor removed' };
};

// ─── Patient Management ──────────────────────────────────────────

/**
 * List all patients for admin view.
 */
const listPatientsAdmin = async (query = {}) => {
  const filter = {};
  if (query.search) {
    const term = query.search;
    filter.$or = [
      { firstName: { $regex: term, $options: 'i' } },
      { lastName: { $regex: term, $options: 'i' } },
    ];
  }

  const patients = await Patient.find(filter).populate('userId', 'email isActive').lean();

  // Get treatment counts
  const patientIds = patients.map(p => p._id);
  const treatmentCounts = await Treatment.aggregate([
    { $match: { patientId: { $in: patientIds } } },
    { $group: { _id: '$patientId', count: { $sum: 1 }, lastVisit: { $max: '$visitDate' } } },
  ]);
  const countMap = {};
  treatmentCounts.forEach(t => {
    countMap[t._id.toString()] = { count: t.count, lastVisit: t.lastVisit };
  });

  return patients.map(p => ({
    id: p._id.toString().slice(-4).padStart(4, '0'),
    _id: p._id,
    name: `${p.firstName} ${p.lastName}`,
    email: p.userId?.email || '',
    dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
    bloodGroup: p.bloodGroup || '',
    gender: p.gender || '',
    phone: p.phoneNumber || '',
    status: p.userId?.isActive === false ? 'deleted' : 'active',
    treatments: countMap[p._id.toString()]?.count || 0,
    lastVisit: countMap[p._id.toString()]?.lastVisit
      ? new Date(countMap[p._id.toString()].lastVisit).toISOString().split('T')[0]
      : '',
    conditions: p.chronicConditions || [],
  }));
};

/**
 * Update patient (admin).
 */
const updatePatientAdmin = async (patientId, data, adminUserId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const err = new Error('Patient not found');
    err.statusCode = 404;
    throw err;
  }

  if (data.name) {
    const parts = data.name.trim().split(' ');
    patient.firstName = parts[0];
    patient.lastName = parts.slice(1).join(' ') || patient.lastName;
  }
  if (data.email && patient.userId) {
    await User.findByIdAndUpdate(patient.userId, { email: data.email.toLowerCase() });
  }
  if (data.phone !== undefined) patient.phoneNumber = data.phone;

  await patient.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'Patient',
    entityId: patientId,
    newValues: data,
  });

  return { message: 'Patient updated' };
};

/**
 * Soft delete patient.
 */
const softDeletePatient = async (patientId, adminUserId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const err = new Error('Patient not found');
    err.statusCode = 404;
    throw err;
  }

  if (patient.userId) {
    await User.findByIdAndUpdate(patient.userId, { isActive: false });
  }

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'DELETE',
    entityType: 'Patient',
    entityId: patientId,
  });

  return { status: 'deleted' };
};

/**
 * Restore soft-deleted patient.
 */
const restorePatient = async (patientId, adminUserId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const err = new Error('Patient not found');
    err.statusCode = 404;
    throw err;
  }

  if (patient.userId) {
    await User.findByIdAndUpdate(patient.userId, { isActive: true });
  }

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'UPDATE',
    entityType: 'Patient',
    entityId: patientId,
    newValues: { restored: true },
  });

  return { status: 'active' };
};

// ─── Medicine Safety ──────────────────────────────────────────

/**
 * List all unsuitable medicine flags across system.
 */
const listMedicineFlags = async (query = {}) => {
  const filter = { isActive: true };

  const meds = await UnsuitableMedicine.find(filter)
    .populate('patientId')
    .populate('flaggedByDoctorId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .lean();

  let results = meds.map(m => {
    const severityMap = { CRITICAL: 'critical', HIGH: 'high', MODERATE: 'medium', LOW: 'low' };
    return {
      id: m._id,
      patient: m.patientId ? `${m.patientId.firstName} ${m.patientId.lastName}` : 'Unknown',
      patientId: m.patientId?._id?.toString()?.slice(-4)?.padStart(4, '0') || '',
      medicine: m.medicineName,
      reason: m.reason,
      severity: severityMap[m.severity] || 'medium',
      flaggedBy: m.flaggedByDoctorId
        ? `Dr. ${m.flaggedByDoctorId.firstName} ${m.flaggedByDoctorId.lastName}`
        : 'Unknown',
      flagDate: m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : '',
    };
  });

  // Apply search filter on mapped fields
  if (query.search) {
    const q = query.search.toLowerCase();
    results = results.filter(
      r =>
        r.medicine.toLowerCase().includes(q) ||
        r.patient.toLowerCase().includes(q) ||
        r.flaggedBy.toLowerCase().includes(q)
    );
  }

  if (query.severity) {
    results = results.filter(r => r.severity === query.severity);
  }

  return results;
};

/**
 * Remove a medicine flag (admin).
 */
const removeMedicineFlag = async (flagId, adminUserId) => {
  const flag = await UnsuitableMedicine.findById(flagId);
  if (!flag) {
    const err = new Error('Medicine flag not found');
    err.statusCode = 404;
    throw err;
  }

  flag.isActive = false;
  flag.removedByUserId = adminUserId;
  flag.removedAt = new Date();
  await flag.save();

  await logAction({
    actorUserId: adminUserId,
    actorRole: 'ADMIN',
    actionType: 'DELETE',
    entityType: 'UnsuitableMedicine',
    entityId: flagId,
  });

  return { message: 'Medicine flag removed' };
};

// ─── Security Monitoring ──────────────────────────────────────────

/**
 * Get security monitoring data aggregated from audit logs and user records.
 */
const getSecurityData = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Failed logins from audit logs
  const failedLogins = await AuditLog.find({
    actionType: 'LOGIN',
    entityType: { $in: ['AuthFailure', 'LoginFailed', 'LOGIN_FAILED'] },
    occurredAt: { $gte: twentyFourHoursAgo },
  })
    .sort({ occurredAt: -1 })
    .limit(20)
    .lean();

  // Aggregate failed logins by email/IP
  const failedLoginMap = {};
  failedLogins.forEach(l => {
    const key = l.newValues?.email || l.ipAddress || 'unknown';
    if (!failedLoginMap[key]) {
      failedLoginMap[key] = {
        id: l._id,
        user: l.newValues?.email || 'Unknown',
        ip: l.ipAddress || 'Unknown',
        time: l.occurredAt ? new Date(l.occurredAt).toLocaleString() : '',
        attempts: 0,
        status: 'blocked',
        country: 'Unknown',
      };
    }
    failedLoginMap[key].attempts++;
  });
  const failedLoginsList = Object.values(failedLoginMap);

  // Account lockouts
  const lockedUsers = await User.find({ isLocked: true }).lean();
  const lockedIds = lockedUsers.map(u => u._id);

  // Get profile names for locked users
  const lockedDoctors = await Doctor.find({ userId: { $in: lockedIds } }).lean();
  const lockedPatients = await Patient.find({ userId: { $in: lockedIds } }).lean();
  const nameMap = {};
  lockedDoctors.forEach(d => { nameMap[d.userId.toString()] = `Dr. ${d.firstName} ${d.lastName}`; });
  lockedPatients.forEach(p => { nameMap[p.userId.toString()] = `${p.firstName} ${p.lastName}`; });

  const lockouts = lockedUsers.map(u => ({
    id: u._id,
    user: nameMap[u._id.toString()] || 'Admin User',
    email: u.email,
    lockedAt: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '',
    reason: u.failedLoginCount >= 5 ? 'Multiple failed login attempts' : 'Account locked by admin',
    ip: 'N/A',
  }));

  // MFA attempts from audit logs
  const mfaLogs = await AuditLog.find({
    entityType: { $in: ['MFA', 'MFAVerification', 'MFA_VERIFY'] },
    occurredAt: { $gte: twentyFourHoursAgo },
  })
    .sort({ occurredAt: -1 })
    .limit(20)
    .populate('actorUserId', 'email')
    .lean();

  const mfaAttempts = mfaLogs.map(m => ({
    id: m._id,
    user: m.actorUserId?.email || 'Unknown',
    time: m.occurredAt ? new Date(m.occurredAt).toLocaleString() : '',
    status: m.newValues?.success === false ? 'failed' : 'success',
    method: m.newValues?.method || 'TOTP',
  }));

  // Suspicious activity — recent unusual audit events
  const suspiciousLogs = await AuditLog.find({
    occurredAt: { $gte: twentyFourHoursAgo },
    actionType: { $in: ['DELETE', 'EXPORT'] },
  })
    .sort({ occurredAt: -1 })
    .limit(10)
    .populate('actorUserId', 'email')
    .lean();

  const suspicious = suspiciousLogs.map(s => {
    const ageMs = Date.now() - new Date(s.occurredAt).getTime();
    const hours = Math.floor(ageMs / (1000 * 60 * 60));
    const timeAgo = hours < 1 ? 'Less than 1 hour ago' : `${hours} hours ago`;

    return {
      id: s._id,
      type: s.actionType === 'DELETE' ? 'Data Deletion' : 'Data Export',
      desc: `${s.actorUserId?.email || 'Unknown user'} performed ${s.actionType} on ${s.entityType}`,
      severity: s.actionType === 'DELETE' ? 'high' : 'medium',
      time: timeAgo,
    };
  });

  // Stats
  const failedLoginCount24h = await AuditLog.countDocuments({
    actionType: 'LOGIN',
    entityType: { $in: ['AuthFailure', 'LoginFailed', 'LOGIN_FAILED'] },
    occurredAt: { $gte: twentyFourHoursAgo },
  });

  const mfaCount24h = await AuditLog.countDocuments({
    entityType: { $in: ['MFA', 'MFAVerification', 'MFA_VERIFY'] },
    occurredAt: { $gte: twentyFourHoursAgo },
  });

  return {
    stats: {
      failedLogins24h: failedLoginCount24h,
      accountLockouts: lockedUsers.length,
      mfaAttempts24h: mfaCount24h,
      activeAlerts: suspicious.length,
    },
    failedLogins: failedLoginsList,
    lockouts,
    mfaAttempts,
    suspicious,
  };
};

// ─── Admin Export ──────────────────────────────────────────

/**
 * List patients with treatment counts for export selection.
 */
const listPatientsForExport = async (query = {}) => {
  const filter = {};
  if (query.search) {
    const term = query.search;
    filter.$or = [
      { firstName: { $regex: term, $options: 'i' } },
      { lastName: { $regex: term, $options: 'i' } },
    ];
  }

  const patients = await Patient.find(filter).lean();

  const patientIds = patients.map(p => p._id);
  const treatmentCounts = await Treatment.aggregate([
    { $match: { patientId: { $in: patientIds } } },
    { $group: { _id: '$patientId', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  treatmentCounts.forEach(t => { countMap[t._id.toString()] = t.count; });

  return patients.map(p => ({
    id: `P-${p._id.toString().slice(-4)}`,
    _id: p._id,
    userId: p.userId,
    name: `${p.firstName} ${p.lastName}`,
    treatments: countMap[p._id.toString()] || 0,
  }));
};

module.exports = {
  listUsers,
  createUser,
  toggleUserStatus,
  toggleUserLock,
  changeUserRole,
  resetUserPassword,
  listDoctorsAdmin,
  createDoctor,
  updateDoctor,
  removeDoctor,
  listPatientsAdmin,
  updatePatientAdmin,
  softDeletePatient,
  restorePatient,
  listMedicineFlags,
  removeMedicineFlag,
  getSecurityData,
  listPatientsForExport,
};
