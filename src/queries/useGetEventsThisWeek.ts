import { useQuery } from '@tanstack/react-query';
import { searchClient } from '@/api/search.client';

export const EVENTS_THIS_WEEK_QUERY_KEY = 'events-this-week';

export const useGetEventsThisWeek = (userId?: string) => {
  return useQuery({
    queryKey: [EVENTS_THIS_WEEK_QUERY_KEY, userId],
    queryFn: () => searchClient.getEventsThisWeek(userId),
    refetchOnWindowFocus: false,
  });
};
