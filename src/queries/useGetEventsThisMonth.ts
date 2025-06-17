import { useQuery } from '@tanstack/react-query';
import { searchClient } from '@/api/search.client';

export const EVENTS_THIS_MONTH_QUERY_KEY = 'events-this-month';

export const useGetEventsThisMonth = (userId?: string) => {
  return useQuery({
    queryKey: [EVENTS_THIS_MONTH_QUERY_KEY, userId],
    queryFn: () => searchClient.getEventsThisMonth(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (gcTime is the new name for cacheTime)
    refetchOnWindowFocus: false,
  });
};
