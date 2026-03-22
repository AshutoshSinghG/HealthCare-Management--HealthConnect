import api from './axios';

export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
};

export const getAuditLogs = async (params) => {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data.data;
};
