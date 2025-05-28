import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '@/api/interest.client';
import { CreateInterestDto } from '@/types/interest';
import { showError, showSuccess } from '@/utils/notifications';
import { INTERESTS_QUERY_KEY } from '@/queries/useGetInterests';
import { EVENTS_THIS_WEEK_QUERY_KEY } from '@/queries/useGetEventsThisWeek';
import { EVENTS_THIS_MONTH_QUERY_KEY } from '@/queries/useGetEventsThisMonth';
import { EVENTS_BY_CATEGORY_QUERY_KEY } from '@/queries/useGetEventsByCategory';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInterestDto) => {
      return create(payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate user's interests after creating
      // queryClient.invalidateQueries({
      //   queryKey: ['user-interests', variables.userId],
      // });
      // showSuccess(data?.message || 'Interest added successfully');
    },
    onError: (error: any, variables) => {
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
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add interest',
      );
    },
  });
};
