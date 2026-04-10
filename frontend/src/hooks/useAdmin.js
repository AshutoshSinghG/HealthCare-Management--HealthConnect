import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers, createAdminUser, toggleUserStatus, toggleUserLock,
  changeUserRole, resetUserPassword,
  getAdminDoctors, createAdminDoctor, updateAdminDoctor, removeAdminDoctor,
  getAdminPatients, updateAdminPatient, softDeletePatient, restorePatient,
  getAdminMedicines, removeAdminMedicineFlag,
  getSecurityData,
  getExportPatients, adminExportPdf, adminExportExcel,
} from '../api/adminApi';

// ─── User Management ──────────────────────────────────────────

export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsers(params),
    retry: 1,
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useToggleUserLock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleUserLock,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useChangeUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useResetUserPassword = () => {
  return useMutation({ mutationFn: resetUserPassword });
};

// ─── Doctor Management ──────────────────────────────────────────

export const useAdminDoctors = (params) => {
  return useQuery({
    queryKey: ['admin', 'doctors', params],
    queryFn: () => getAdminDoctors(params),
    retry: 1,
  });
};

export const useCreateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminDoctor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'doctors'] }),
  });
};

export const useUpdateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminDoctor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'doctors'] }),
  });
};

export const useRemoveDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeAdminDoctor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'doctors'] }),
  });
};

// ─── Patient Management ──────────────────────────────────────────

export const useAdminPatients = (params) => {
  return useQuery({
    queryKey: ['admin', 'patients', params],
    queryFn: () => getAdminPatients(params),
    retry: 1,
  });
};

export const useUpdatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminPatient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'patients'] }),
  });
};

export const useSoftDeletePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: softDeletePatient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'patients'] }),
  });
};

export const useRestorePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restorePatient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'patients'] }),
  });
};

// ─── Medicine Safety ──────────────────────────────────────────

export const useAdminMedicines = (params) => {
  return useQuery({
    queryKey: ['admin', 'medicines', params],
    queryFn: () => getAdminMedicines(params),
    retry: 1,
  });
};

export const useRemoveMedicineFlag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeAdminMedicineFlag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'medicines'] }),
  });
};

// ─── Security ──────────────────────────────────────────

export const useSecurityData = () => {
  return useQuery({
    queryKey: ['admin', 'security'],
    queryFn: getSecurityData,
    retry: 1,
    refetchInterval: 30000, // Refresh every 30s
  });
};

// ─── Export ──────────────────────────────────────────

export const useExportPatients = (params) => {
  return useQuery({
    queryKey: ['admin', 'export-patients', params],
    queryFn: () => getExportPatients(params),
    retry: 1,
  });
};

export const useAdminExportPdf = () => {
  return useMutation({ mutationFn: adminExportPdf });
};

export const useAdminExportExcel = () => {
  return useMutation({ mutationFn: adminExportExcel });
};
