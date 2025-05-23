import { useMutation, useQueryClient } from '@tanstack/react-query';
import { remove } from '@/api/interest.client';
import { useState } from 'react';

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();
  const [fadingEvents, setFadingEvents] = useState<number[]>([]);

  const mutation = useMutation({
    mutationFn: async (payload: { userId: string; eventId: number }) => {
      return remove(payload.userId, payload.eventId);
    },
    onMutate: async ({ eventId }) => {
      setFadingEvents((prev) => [...prev, eventId]);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate fade-out
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-interests', variables.userId] });
      setFadingEvents((prev) => prev.filter((id) => id !== variables.eventId));
    },
    onError: (_error, variables) => {
      setFadingEvents((prev) => prev.filter((id) => id !== variables.eventId));
    },
  });

  return { mutate: mutation.mutate, fadingEvents };
};