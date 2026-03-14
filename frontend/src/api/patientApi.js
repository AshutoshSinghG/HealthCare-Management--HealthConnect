import api from './axios';

export const getPatientDashboard = async () => {
  const { data } = await api.get('/patient/dashboard');
  return data;
};

export const getMyTreatments = async (params) => {
  const { data } = await api.get('/patient/treatments', { params });
  return data;
};

export const getTreatmentById = async (id) => {
  const { data } = await api.get(`/patient/treatments/${id}`);
  return data;
};

export const getUnsuitableMedicines = async () => {
  const { data } = await api.get('/patient/unsuitable-medicines');
  return data;
};

export const getPatientProfile = async () => {
  const { data } = await api.get('/patient/profile');
  return data;
};
