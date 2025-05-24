import { useMutation, useQueryClient } from '@tanstack/react-query';
import { remove } from '@/api/interest.client';
import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();
  const [fadingEvents, setFadingEvents] = useState<number[]>([]);
  const notify = useNotification();

  const mutation = useMutation({
    mutationFn: async (payload: { userId: string; eventId: number }) => {
      return remove(payload.userId, payload.eventId);
    },
    onMutate: async ({ eventId }) => {
      setFadingEvents((prev) => [...prev, eventId]);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate fade-out
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
      setFadingEvents((prev) => prev.filter((id) => id !== variables.eventId));
      notify(data?.message || 'Interest removed successfully', 'success');
    },
    onError: (error: any, variables) => {
      setFadingEvents((prev) => prev.filter((id) => id !== variables.eventId));
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
      notify(
        error?.response?.data?.message || error?.message || 'Failed to remove interest',
        'error'
      );
    },
  });

  return { mutate: mutation.mutate, fadingEvents };
};