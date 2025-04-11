import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IdParam } from '@/types/types';
import { eventClient } from '@/api/event.client';

export const GET_EVENT_SHOW_DETAIL_QUERY_KEY = 'getEventShowDetail';

export const useGetEventShowDetail = (
  eventId: IdParam | undefined,
  showId: IdParam | undefined,
) => {
  return useQuery<any, AxiosError>({
    queryKey: [GET_EVENT_SHOW_DETAIL_QUERY_KEY, eventId, showId],
    queryFn: async () => {
      if (!eventId || !showId) return null;
      const data = await eventClient.getShowDetail(eventId, showId);
      return data;
    },
    enabled: !!eventId && !!showId,
  });
};
