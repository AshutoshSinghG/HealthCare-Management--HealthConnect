import { useQuery } from '@tanstack/react-query';
import { getPatientDashboard, getMyTreatments, getTreatmentById, getUnsuitableMedicines, getPatientProfile } from '../api/patientApi';

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
