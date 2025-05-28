import { useMutation, useQueryClient } from '@tanstack/react-query';
import { remove } from '@/api/interest.client';
import { useState } from 'react';
import { showError } from '@/utils/notifications';
import { INTERESTS_QUERY_KEY } from '@/queries/useGetInterests';
import { EVENTS_THIS_WEEK_QUERY_KEY } from '@/queries/useGetEventsThisWeek';
import { EVENTS_THIS_MONTH_QUERY_KEY } from '@/queries/useGetEventsThisMonth';
import { EVENTS_BY_CATEGORY_QUERY_KEY } from '@/queries/useGetEventsByCategory';

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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [INTERESTS_QUERY_KEY, variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: [EVENTS_THIS_WEEK_QUERY_KEY, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [EVENTS_THIS_MONTH_QUERY_KEY, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [EVENTS_BY_CATEGORY_QUERY_KEY, variables.userId],
      });
    },
    onError: (error: any, variables) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to remove interest',
      );
    },
  });

  return { mutate: mutation.mutate, fadingEvents };
};
