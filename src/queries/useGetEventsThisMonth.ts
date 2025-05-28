import { useQuery } from '@tanstack/react-query';
import { searchClient } from '@/api/search.client';

export const EVENTS_THIS_MONTH_QUERY_KEY = 'events-this-month';

export const useGetEventsThisMonth = (userId?: string) => {
  return useQuery({
    queryKey: [EVENTS_THIS_MONTH_QUERY_KEY, userId],
    queryFn: () => searchClient.getEventsThisMonth(userId),
    refetchOnWindowFocus: false,
  });
};
