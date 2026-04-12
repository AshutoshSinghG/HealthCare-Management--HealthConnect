import api from './axios';

export const getPatientDashboard = async () => {
  const { data } = await api.get('/patients/me/dashboard');
  return data.data;
};

export const getPatientProfile = async () => {
  const { data } = await api.get('/patients/me');
  return data.data;
};

export const updatePatientProfile = async (updates) => {
  const { data } = await api.put('/patients/me', updates);
  return data.data;
};

export const getMyTreatments = async (params) => {
  const { data } = await api.get('/patients/me/treatments', { params });
  return data.data;
};

export const getTreatmentById = async (id) => {
  const { data } = await api.get(`/patients/me/treatments/${id}`);
  return data.data;
};

export const getUnsuitableMedicines = async () => {
  const { data } = await api.get('/patients/me/unsuitable-medicines');
  return data.data;
};

export const exportPdf = async () => {
  const response = await api.get('/patients/me/export/pdf', { responseType: 'blob' });
  return response.data;
};

export const exportExcel = async () => {
  const response = await api.get('/patients/me/export/excel', { responseType: 'blob' });
  return response.data;
};

// ─── Appointments ───

export const getMyAppointments = async () => {
  const { data } = await api.get('/appointments/me');
  return data.data;
};

export const bookAppointment = async (payload) => {
  const { data } = await api.post('/appointments/book', payload);
  return data.data;
};

export const cancelAppointment = async (id) => {
  const { data } = await api.patch(`/appointments/${id}/cancel`);
  return data.data;
};

// ─── Medications ───

export const getMyMedications = async () => {
  const { data } = await api.get('/patients/me/medications');
  return data.data;
};

// ─── Public Doctor Listing (for booking) ───

export const getPublicDoctors = async (params) => {
  const { data } = await api.get('/public/doctors', { params });
  return data.data;
};

export const getPublicSpecialties = async () => {
  const { data } = await api.get('/public/specialties');
  return data.data;
};

export const getDoctorSlots = async (doctorId, date) => {
  // Normalize date to local YYYY-MM-DD to avoid UTC timezone drift
  const normalizedDate = date ? date.substring(0, 10) : date;
  const { data } = await api.get(`/public/doctors/${doctorId}/slots`, { params: { date: normalizedDate } });
  return data.data;
};

