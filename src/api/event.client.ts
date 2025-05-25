import { httpApi } from '@/api/http.api';
import { EventDetailResponse } from '@/domain/EventModel';
import { IdParam } from '@/types/types';
import { ShowModel } from '@/domain/ShowModel';

export const eventClient = {
  getDetail: async (eventId: IdParam): Promise<EventDetailResponse> => {
    const response = await httpApi.get<any>(`/events/${eventId}`);
    return response.data.data;
  },

  getShowDetail: async (
    eventId: IdParam,
    showId: IdParam,
  ): Promise<ShowModel> => {
    const response = await httpApi.get<any>(
      `/events/${eventId}/shows/${showId}`,
    );
    return response.data.data;
  },

  getEventQuestions: async (eventId: IdParam): Promise<any> => {
    const response = await httpApi.get<any>(`/events/${eventId}/questions`);
    return response.data.data.result;
  },
};
