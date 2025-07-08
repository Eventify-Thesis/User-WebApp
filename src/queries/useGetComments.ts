import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { commentApi, Comment } from '@/api/commentApi';
import { IdParam } from '@/types/types';

export const GET_COMMENTS_QUERY_KEY = 'getComments';

export const useGetComments = (eventId: IdParam | undefined) => {
  return useQuery<Comment[], AxiosError>({
    queryKey: [GET_COMMENTS_QUERY_KEY, eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const data = await commentApi.getComments(eventId.toString());
      return data;
    },
    enabled: !!eventId,
  });
};
