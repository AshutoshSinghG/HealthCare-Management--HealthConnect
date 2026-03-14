import api from './axios';

export const getDoctorDashboard = async () => {
  const { data } = await api.get('/doctor/dashboard');
  return data;
};

export const getPatients = async (params) => {
  const { data } = await api.get('/doctor/patients', { params });
  return data;
};

export const getPatientDetail = async (id) => {
  const { data } = await api.get(`/doctor/patients/${id}`);
  return data;
};

export const createTreatment = async (payload) => {
  const { data } = await api.post('/doctor/treatments', payload);
  return data;
};

export const updateTreatment = async (id, payload) => {
  const { data } = await api.put(`/doctor/treatments/${id}`, payload);
  return data;
};

export const getTreatmentsByPatient = async (patientId) => {
  const { data } = await api.get(`/doctor/patients/${patientId}/treatments`);
  return data;
};

export const getMedicationsByPatient = async (patientId) => {
  const { data } = await api.get(`/doctor/patients/${patientId}/medications`);
  return data;
};
