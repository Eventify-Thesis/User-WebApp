import { useQuery } from '@tanstack/react-query';
import { eventClient } from '@/api/event.client';
import EventModel from '@/domain/EventModel';

export const GET_EVENTS_QUERY_KEY = 'events';

export const useGetEvents = () => {
  return useQuery<EventModel[]>({
    queryKey: [GET_EVENTS_QUERY_KEY],
    queryFn: eventClient.getList,
    refetchOnWindowFocus: false,
  });
};

export const useGetEventById = (eventId: number) => {
  return useQuery<EventModel>({
    queryKey: ['event', eventId],
    queryFn: () => eventClient.getById(eventId),
    enabled: !!eventId,
  });
};
