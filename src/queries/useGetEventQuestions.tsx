import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IdParam } from '@/types/types';
import { eventClient } from '@/api/event.client';

export const GET_EVENT_QUESTIONS_QUERY_KEY = 'getEventQuestions';

export const useGetEventQuestions = (eventId: IdParam | undefined) => {
  return useQuery<any, AxiosError>({
    queryKey: [GET_EVENT_QUESTIONS_QUERY_KEY, eventId],
    queryFn: async () => {
      console.log('event get questions', eventId);
      if (!eventId) return null;
      const data = await eventClient.getEventQuestions(eventId);
      return data;
    },
    enabled: !!eventId,
  });
};
