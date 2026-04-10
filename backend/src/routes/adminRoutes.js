const router = require('express').Router();
const auditController = require('../controllers/auditController');
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const authorise = require('../middlewares/roleMiddleware');

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorise('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

// ─── Dashboard ──────────────────────────────────────────
router.get('/dashboard', auditController.getDashboard);

// ─── Audit Logs ──────────────────────────────────────────
router.get('/audit-logs', auditController.listAuditLogs);

// ─── User Management ──────────────────────────────────────────
router.get('/users', adminController.listUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/users/:id/lock', adminController.toggleUserLock);
router.put('/users/:id/role', adminController.changeUserRole);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// ─── Doctor Management ──────────────────────────────────────────
router.get('/doctors', adminController.listDoctors);
router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:id', adminController.updateDoctor);
router.delete('/doctors/:id', adminController.removeDoctor);

// ─── Patient Management ──────────────────────────────────────────
router.get('/patients', adminController.listPatients);
router.put('/patients/:id', adminController.updatePatient);
router.put('/patients/:id/soft-delete', adminController.softDeletePatient);
router.put('/patients/:id/restore', adminController.restorePatient);

// ─── Medicine Safety ──────────────────────────────────────────
router.get('/medicines', adminController.listMedicines);
router.delete('/medicines/:id', adminController.removeMedicineFlag);

// ─── Security Monitoring ──────────────────────────────────────────
router.get('/security', adminController.getSecurityData);

// ─── Export ──────────────────────────────────────────
router.get('/export/patients', adminController.listExportPatients);
router.get('/export/:patientId/pdf', adminController.adminExportPdf);
router.get('/export/:patientId/excel', adminController.adminExportExcel);

module.exports = router;
