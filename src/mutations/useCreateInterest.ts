import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '@/api/interest.client';
import { CreateInterestDto } from '@/types/interest';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInterestDto) => { 
      return create(payload);
    },
    onSuccess: (variables) => {
      // Invalidate user's interests after creating
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
    },
  });
};