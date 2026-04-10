import api from './axios';

// ─── Dashboard ──────────────────────────────────────────
export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
};

// ─── Audit Logs ──────────────────────────────────────────
export const getAuditLogs = async (params) => {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data.data;
};

// ─── User Management ──────────────────────────────────────────
export const getAdminUsers = async (params) => {
  const { data } = await api.get('/admin/users', { params });
  return data.data;
};

export const createAdminUser = async (body) => {
  const { data } = await api.post('/admin/users', body);
  return data.data;
};

export const toggleUserStatus = async (id) => {
  const { data } = await api.put(`/admin/users/${id}/status`);
  return data.data;
};

export const toggleUserLock = async (id) => {
  const { data } = await api.put(`/admin/users/${id}/lock`);
  return data.data;
};

export const changeUserRole = async ({ id, role }) => {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data.data;
};

export const resetUserPassword = async (id) => {
  const { data } = await api.post(`/admin/users/${id}/reset-password`);
  return data.data;
};

// ─── Doctor Management ──────────────────────────────────────────
export const getAdminDoctors = async (params) => {
  const { data } = await api.get('/admin/doctors', { params });
  return data.data;
};

export const createAdminDoctor = async (body) => {
  const { data } = await api.post('/admin/doctors', body);
  return data.data;
};

export const updateAdminDoctor = async ({ id, ...body }) => {
  const { data } = await api.put(`/admin/doctors/${id}`, body);
  return data.data;
};

export const removeAdminDoctor = async (id) => {
  const { data } = await api.delete(`/admin/doctors/${id}`);
  return data.data;
};

// ─── Patient Management ──────────────────────────────────────────
export const getAdminPatients = async (params) => {
  const { data } = await api.get('/admin/patients', { params });
  return data.data;
};

export const updateAdminPatient = async ({ id, ...body }) => {
  const { data } = await api.put(`/admin/patients/${id}`, body);
  return data.data;
};

export const softDeletePatient = async (id) => {
  const { data } = await api.put(`/admin/patients/${id}/soft-delete`);
  return data.data;
};

export const restorePatient = async (id) => {
  const { data } = await api.put(`/admin/patients/${id}/restore`);
  return data.data;
};

// ─── Medicine Safety ──────────────────────────────────────────
export const getAdminMedicines = async (params) => {
  const { data } = await api.get('/admin/medicines', { params });
  return data.data;
};

export const removeAdminMedicineFlag = async (id) => {
  const { data } = await api.delete(`/admin/medicines/${id}`);
  return data.data;
};

// ─── Security Monitoring ──────────────────────────────────────────
export const getSecurityData = async () => {
  const { data } = await api.get('/admin/security');
  return data.data;
};

// ─── Export ──────────────────────────────────────────
export const getExportPatients = async (params) => {
  const { data } = await api.get('/admin/export/patients', { params });
  return data.data;
};

export const adminExportPdf = async (patientId) => {
  const response = await api.get(`/admin/export/${patientId}/pdf`, { responseType: 'blob' });
  return response.data;
};

export const adminExportExcel = async (patientId) => {
  const response = await api.get(`/admin/export/${patientId}/excel`, { responseType: 'blob' });
  return response.data;
};
