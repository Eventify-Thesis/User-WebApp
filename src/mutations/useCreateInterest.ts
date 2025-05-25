import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '@/api/interest.client';
import { CreateInterestDto } from '@/types/interest';
import { showError, showSuccess } from '@/utils/notifications';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInterestDto) => {
      return create(payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate user's interests after creating
      queryClient.invalidateQueries({
        queryKey: ['user-interests', variables.userId],
      });
      showSuccess(data?.message || 'Interest added successfully');
    },
    onError: (error: any, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-interests', variables.userId],
      });
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add interest',
      );
    },
  });
};
