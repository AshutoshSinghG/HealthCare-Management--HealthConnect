import api from './axios';

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.data;
};

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const verifyMfa = async (payload) => {
  const { data } = await api.post('/auth/mfa/verify', payload);
  return data.data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
};

export const refreshToken = async (refreshTokenStr) => {
  const { data } = await api.post('/auth/refresh', { refreshToken: refreshTokenStr });
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};
