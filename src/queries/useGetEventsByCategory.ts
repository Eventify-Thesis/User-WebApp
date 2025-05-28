import { useQuery } from '@tanstack/react-query';
import { searchClient } from '@/api/search.client';

export const EVENTS_BY_CATEGORY_QUERY_KEY = 'events-by-category';

export const useGetEventsByCategory = (userId?: string) => {
  return useQuery({
    queryKey: [EVENTS_BY_CATEGORY_QUERY_KEY, userId],
    queryFn: () => searchClient.getEventsByCategory(userId),
    refetchOnWindowFocus: false,
  });
};
