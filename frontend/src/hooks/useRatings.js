import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitRating, checkRating, getDoctorRatings, getDoctorAverageRating } from '../api/ratingApi';

export const useSubmitRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitRating,
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after a successful rating submission
      queryClient.invalidateQueries({ queryKey: ['rating', 'check', variables.appointmentSlotId] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'ratings'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'average'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'doctors'] });
    },
  });
};

export const useCheckRating = (slotId) => {
  return useQuery({
    queryKey: ['rating', 'check', slotId],
    queryFn: () => checkRating(slotId),
    enabled: !!slotId,
    retry: 1,
  });
};

export const useDoctorRatings = (doctorId) => {
  return useQuery({
    queryKey: ['doctor', 'ratings', doctorId],
    queryFn: () => getDoctorRatings(doctorId),
    enabled: !!doctorId,
    retry: 1,
  });
};

export const useDoctorAverageRating = (doctorId) => {
  return useQuery({
    queryKey: ['doctor', 'average', doctorId],
    queryFn: () => getDoctorAverageRating(doctorId),
    enabled: !!doctorId,
    retry: 1,
  });
};
