import { useQuery } from '@tanstack/react-query';
import { ShowSchedule } from '@/types/show-schedule';
import { scheduleClient } from '@/api/schedule.client';

export const useGetShowSchedules = (eventId?: string, showId?: string) => {
  return useQuery({
    queryKey: ['showSchedules', eventId, showId],
    queryFn: async () => {
      if (!eventId || !showId) return [];
      const data = await scheduleClient.getShowSchedules(eventId, showId);
      return data as ShowSchedule[];
    },
    enabled: !!eventId && !!showId,
  });
};
