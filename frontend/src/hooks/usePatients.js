import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatientDashboard, getMyTreatments, getTreatmentById,
  getUnsuitableMedicines, getPatientProfile, getMyAppointments,
  bookAppointment, cancelAppointment, getMyMedications,
  getPublicDoctors, getPublicSpecialties, getDoctorSlots,
  updatePatientProfile,
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

export const useUpdatePatientProfile = () => {
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

// ─── Appointments ───

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ['patient', 'appointments'],
    queryFn: getMyAppointments,
    retry: 1,
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'doctor-slots'] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'doctor-slots'] });
    },
  });
};

// ─── Medications ───

export const useMyMedications = () => {
  return useQuery({
    queryKey: ['patient', 'medications'],
    queryFn: getMyMedications,
    retry: 1,
  });
};

// ─── Public Doctor Listing ───

export const usePublicDoctors = (params) => {
  return useQuery({
    queryKey: ['public', 'doctors', params],
    queryFn: () => getPublicDoctors(params),
    retry: 1,
  });
};

export const usePublicSpecialties = () => {
  return useQuery({
    queryKey: ['public', 'specialties'],
    queryFn: getPublicSpecialties,
    retry: 1,
  });
};

export const useDoctorSlots = (doctorId, date) => {
  return useQuery({
    queryKey: ['public', 'doctor-slots', doctorId, date],
    queryFn: () => getDoctorSlots(doctorId, date),
    enabled: !!doctorId && !!date,
    retry: 1,
  });
};
