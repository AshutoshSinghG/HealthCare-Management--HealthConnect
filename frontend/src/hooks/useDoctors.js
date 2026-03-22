import { useQuery } from '@tanstack/react-query';
import { getDoctorDashboard, getPatients, getPatientDetail } from '../api/doctorApi';

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ['doctor', 'dashboard'],
    queryFn: getDoctorDashboard,
    retry: 1,
  });
};

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
