import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTreatment, updateTreatment } from '../api/doctorApi';
import toast from 'react-hot-toast';

export const useCreateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTreatment,
    onSuccess: () => {
      toast.success('Treatment created successfully');
      queryClient.invalidateQueries({ queryKey: ['doctor'] });
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create treatment');
    },
  });
};

export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => updateTreatment(id, data),
    onSuccess: () => {
      toast.success('Treatment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['doctor'] });
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update treatment');
    },
  });
};
