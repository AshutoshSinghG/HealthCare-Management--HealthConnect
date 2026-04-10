const adminService = require('../services/adminService');
const exportService = require('../services/exportService');
const { success, error } = require('../utils/apiResponse');
const { logAction } = require('../services/auditService');

// ─── User Management ──────────────────────────────────────────

const listUsers = async (req, res, next) => {
  try {
    const users = await adminService.listUsers(req.query);
    return success(res, 'Users retrieved', users);
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body, req.user.userId);
    return success(res, 'User created', user, 201);
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const result = await adminService.toggleUserStatus(req.params.id, req.user.userId);
    return success(res, 'User status updated', result);
  } catch (err) { next(err); }
};

const toggleUserLock = async (req, res, next) => {
  try {
    const result = await adminService.toggleUserLock(req.params.id, req.user.userId);
    return success(res, 'Lock status updated', result);
  } catch (err) { next(err); }
};

const changeUserRole = async (req, res, next) => {
  try {
    const result = await adminService.changeUserRole(req.params.id, req.body.role, req.user.userId);
    return success(res, 'Role updated', result);
  } catch (err) { next(err); }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const result = await adminService.resetUserPassword(req.params.id, req.user.userId);
    return success(res, 'Password reset', result);
  } catch (err) { next(err); }
};

// ─── Doctor Management ──────────────────────────────────────────

const listDoctors = async (req, res, next) => {
  try {
    const doctors = await adminService.listDoctorsAdmin(req.query);
    return success(res, 'Doctors retrieved', doctors);
  } catch (err) { next(err); }
};

const createDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.createDoctor(req.body, req.user.userId);
    return success(res, 'Doctor created', doctor, 201);
  } catch (err) { next(err); }
};

const updateDoctor = async (req, res, next) => {
  try {
    const result = await adminService.updateDoctor(req.params.id, req.body, req.user.userId);
    return success(res, 'Doctor updated', result);
  } catch (err) { next(err); }
};

const removeDoctor = async (req, res, next) => {
  try {
    const result = await adminService.removeDoctor(req.params.id, req.user.userId);
    return success(res, 'Doctor removed', result);
  } catch (err) { next(err); }
};

// ─── Patient Management ──────────────────────────────────────────

const listPatients = async (req, res, next) => {
  try {
    const patients = await adminService.listPatientsAdmin(req.query);
    return success(res, 'Patients retrieved', patients);
  } catch (err) { next(err); }
};

const updatePatient = async (req, res, next) => {
  try {
    const result = await adminService.updatePatientAdmin(req.params.id, req.body, req.user.userId);
    return success(res, 'Patient updated', result);
  } catch (err) { next(err); }
};

const softDeletePatient = async (req, res, next) => {
  try {
    const result = await adminService.softDeletePatient(req.params.id, req.user.userId);
    return success(res, 'Patient soft deleted', result);
  } catch (err) { next(err); }
};

const restorePatient = async (req, res, next) => {
  try {
    const result = await adminService.restorePatient(req.params.id, req.user.userId);
    return success(res, 'Patient restored', result);
  } catch (err) { next(err); }
};

// ─── Medicine Safety ──────────────────────────────────────────

const listMedicines = async (req, res, next) => {
  try {
    const medicines = await adminService.listMedicineFlags(req.query);
    return success(res, 'Medicine flags retrieved', medicines);
  } catch (err) { next(err); }
};

const removeMedicineFlag = async (req, res, next) => {
  try {
    const result = await adminService.removeMedicineFlag(req.params.id, req.user.userId);
    return success(res, 'Medicine flag removed', result);
  } catch (err) { next(err); }
};

// ─── Security ──────────────────────────────────────────

const getSecurityData = async (req, res, next) => {
  try {
    const data = await adminService.getSecurityData();
    return success(res, 'Security data retrieved', data);
  } catch (err) { next(err); }
};

// ─── Export ──────────────────────────────────────────

const listExportPatients = async (req, res, next) => {
  try {
    const patients = await adminService.listPatientsForExport(req.query);
    return success(res, 'Export patients retrieved', patients);
  } catch (err) { next(err); }
};

const adminExportPdf = async (req, res, next) => {
  try {
    // Find the patient to get their userId
    const Patient = require('../models/Patient');
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return error(res, 'Patient not found', 404);
    }

    // Log the admin export action
    await logAction({
      actorUserId: req.user.userId,
      actorRole: 'ADMIN',
      actionType: 'EXPORT',
      entityType: 'MedicalReport',
      entityId: patient._id,
      newValues: { format: 'PDF', adminExport: true },
    });

    await exportService.generatePDF(patient.userId, res);
  } catch (err) { next(err); }
};

const adminExportExcel = async (req, res, next) => {
  try {
    const Patient = require('../models/Patient');
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return error(res, 'Patient not found', 404);
    }

    await logAction({
      actorUserId: req.user.userId,
      actorRole: 'ADMIN',
      actionType: 'EXPORT',
      entityType: 'MedicalReport',
      entityId: patient._id,
      newValues: { format: 'Excel', adminExport: true },
    });

    await exportService.generateExcel(patient.userId, res);
  } catch (err) { next(err); }
};

module.exports = {
  listUsers,
  createUser,
  toggleUserStatus,
  toggleUserLock,
  changeUserRole,
  resetUserPassword,
  listDoctors,
  createDoctor,
  updateDoctor,
  removeDoctor,
  listPatients,
  updatePatient,
  softDeletePatient,
  restorePatient,
  listMedicines,
  removeMedicineFlag,
  getSecurityData,
  listExportPatients,
  adminExportPdf,
  adminExportExcel,
};
