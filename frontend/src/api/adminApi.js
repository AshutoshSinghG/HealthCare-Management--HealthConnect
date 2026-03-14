import api from './axios';

export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

export const getAuditLogs = async (params) => {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data;
};

export const getUsers = async (params) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const getSystemHealth = async () => {
  const { data } = await api.get('/admin/system-health');
  return data;
};
