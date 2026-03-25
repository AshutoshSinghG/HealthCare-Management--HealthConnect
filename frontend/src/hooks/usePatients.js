import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatientDashboard,
  getMyTreatments,
  getTreatmentById,
  getUnsuitableMedicines,
  getPatientProfile,
  updatePatientProfile,
  getMedications,
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
  getDoctorSlots,
} from '../api/patientApi';

export const usePatientDashboard = () => {
  return useQuery({
    queryKey: ['patient', 'dashboard'],
    queryFn: getPatientDashboard,
    retry: 1,
  });
};

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: getPatientProfile,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'dashboard'] });
    },
  });
};

export const useMyTreatments = (params) => {
  return useQuery({
    queryKey: ['patient', 'treatments', params],
    queryFn: () => getMyTreatments(params),
    retry: 1,
  });
};

export const useTreatmentDetail = (id) => {
  return useQuery({
    queryKey: ['patient', 'treatment', id],
    queryFn: () => getTreatmentById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useUnsuitableMedicines = () => {
  return useQuery({
    queryKey: ['patient', 'unsuitable-medicines'],
    queryFn: getUnsuitableMedicines,
    retry: 1,
  });
};

export const useMedications = () => {
  return useQuery({
    queryKey: ['patient', 'medications'],
    queryFn: getMedications,
    retry: 1,
  });
};

// --- Appointment Hooks ---

export const useMyAppointments = (status) => {
  return useQuery({
    queryKey: ['patient', 'appointments', status],
    queryFn: () => getMyAppointments(status),
    retry: 1,
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] });
    },
  });
};

export const useAvailableDoctors = (filters) => {
  return useQuery({
    queryKey: ['doctors', 'available', filters],
    queryFn: () => getAvailableDoctors(filters),
    retry: 1,
  });
};

export const useDoctorSlots = (doctorId, date) => {
  return useQuery({
    queryKey: ['doctor', 'slots', doctorId, date],
    queryFn: () => getDoctorSlots(doctorId, date),
    enabled: !!doctorId && !!date,
    retry: 1,
  });
};
