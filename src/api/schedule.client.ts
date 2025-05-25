import { eventHttpApi } from './eventHttp.api';

export const scheduleClient = {
  getShowSchedules: async (eventId: string, showId: string) => {
    const response = await eventHttpApi.get<any>(
      `/events/${eventId}/show-schedules/shows/${showId}`,
    );
    return response.data.data.result;
  },
};
