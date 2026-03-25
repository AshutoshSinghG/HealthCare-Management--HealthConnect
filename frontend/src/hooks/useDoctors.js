import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorDashboard, getDoctorProfile, updateDoctorProfile,
  getPatients, getPatientDetail,
  createTreatment, getTreatmentById, updateTreatment,
  flagUnsuitableMedicine, removeUnsuitableFlag,
  getDoctorSlots, createDoctorSlot, deleteDoctorSlot, updateSlotStatus,
  getDoctorAvailability, updateDoctorAvailability,
} from '../api/doctorApi';

// ─── Dashboard ───

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ['doctor', 'dashboard'],
    queryFn: getDoctorDashboard,
    retry: 1,
  });
};

// ─── Profile ───

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: ['doctor', 'profile'],
    queryFn: getDoctorProfile,
    retry: 1,
  });
};

export const useUpdateDoctorProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDoctorProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'profile'] });
      qc.invalidateQueries({ queryKey: ['doctor', 'dashboard'] });
    },
  });
};

// ─── Patients ───

export const useDoctorPatients = (params) => {
  return useQuery({
    queryKey: ['doctor', 'patients', params],
    queryFn: () => getPatients(params),
    retry: 1,
  });
};

export const usePatientDetail = (id) => {
  return useQuery({
    queryKey: ['doctor', 'patient', id],
    queryFn: () => getPatientDetail(id),
    enabled: !!id,
    retry: 1,
  });
};

// ─── Treatments ───

export const useCreateTreatment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTreatment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'patients'] });
      qc.invalidateQueries({ queryKey: ['doctor', 'patient'] });
      qc.invalidateQueries({ queryKey: ['doctor', 'dashboard'] });
    },
  });
};

export const useTreatmentForEdit = (id) => {
  return useQuery({
    queryKey: ['treatment', id],
    queryFn: () => getTreatmentById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useUpdateTreatment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTreatment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'patient'] });
      qc.invalidateQueries({ queryKey: ['treatment'] });
    },
  });
};

// ─── Unsuitable Medicines ───

export const useFlagUnsuitableMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: flagUnsuitableMedicine,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'patient'] });
    },
  });
};

export const useRemoveUnsuitableFlag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeUnsuitableFlag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'patient'] });
    },
  });
};

// ─── Slots ───

export const useDoctorSlots = (params) => {
  return useQuery({
    queryKey: ['doctor', 'slots', params],
    queryFn: () => getDoctorSlots(params),
    retry: 1,
  });
};

export const useCreateDoctorSlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDoctorSlot,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'slots'] });
    },
  });
};

export const useDeleteDoctorSlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctorSlot,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'slots'] });
    },
  });
};

export const useUpdateSlotStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateSlotStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'slots'] });
    },
  });
};

// ─── Availability ───

export const useDoctorAvailability = () => {
  return useQuery({
    queryKey: ['doctor', 'availability'],
    queryFn: getDoctorAvailability,
    retry: 1,
  });
};

export const useUpdateDoctorAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDoctorAvailability,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor', 'availability'] });
    },
  });
};
