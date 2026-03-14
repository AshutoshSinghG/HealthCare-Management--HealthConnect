import api from './axios';

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const verifyMfa = async (payload) => {
  const { data } = await api.post('/auth/verify-mfa', payload);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};
