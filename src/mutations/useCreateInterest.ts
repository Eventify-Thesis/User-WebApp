import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '@/api/interest.client';
import { CreateInterestDto } from '@/types/interest';
import { useNotification } from '@/contexts/NotificationContext';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  const notify = useNotification();
  return useMutation({
    mutationFn: (payload: CreateInterestDto) => { 
      return create(payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate user's interests after creating
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
      notify(data?.message || 'Interest added successfully', 'success');
    },
    onError: (error: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
      notify(
        error?.response?.data?.message || error?.message || 'Failed to add interest',
        'error'
      );
    },
  });
};