import api from './axios';

export const getDoctorDashboard = async () => {
  const { data } = await api.get('/doctors/me/dashboard');
  return data.data;
};

export const getDoctorProfile = async () => {
  const { data } = await api.get('/doctors/me');
  return data.data;
};

export const getPatients = async (params) => {
  const { data } = await api.get('/doctors/me/patients', { params });
  return data.data;
};

export const getPatientDetail = async (id) => {
  const { data } = await api.get(`/doctors/me/patients/${id}`);
  return data.data;
};

export const createTreatment = async ({ patientId, ...treatmentData }) => {
  const { data } = await api.post(`/doctors/me/patients/${patientId}/treatments`, treatmentData);
  return data.data;
};

export const updateTreatment = async (id, payload) => {
  const { data } = await api.put(`/treatments/${id}`, payload);
  return data.data;
};

export const flagUnsuitableMedicine = async ({ patientId, ...medicineData }) => {
  const { data } = await api.post(`/doctors/patients/${patientId}/unsuitable-medicines`, medicineData);
  return data.data;
};

export const removeUnsuitableFlag = async (id) => {
  const { data } = await api.delete(`/doctors/unsuitable-medicines/${id}`);
  return data.data;
};
