import { httpApi } from '@/api/http.api';
import EventModel, { EventDetailResponse } from '@/domain/EventModel';
import { IdParam } from '@/types/types';
import { mockEvents } from '@/mocks/events';
import { ShowModel } from '@/domain/ShowModel';
import { semanticApi } from "./semanticApi";

export const eventClient = {
  getList: async (): Promise<EventModel[]> => {
    // Simulate API call and return mock data
    return mockEvents;
    // When API is implemented, use below
    // const response = await httpApi.get<any>("/event");
    // return response.data.data;
  },

  getDetail: async (eventId: IdParam): Promise<EventDetailResponse> => {
    const response = await httpApi.get<any>(`/events/${eventId}`);
    return response.data.data;
  },
   
  searchSemanticEvents: async (
    query: string,
    userId?: string,
    limit: number = 15
  ): Promise<EventModel[]> => {

    const response = await semanticApi.get<any>("/api/search", {
      params: {
        q: query,
        limit,
        ...(userId ? { user_id: userId } : {}),
      },
    });

    console.log("In event client with result:", response.data.result);
    return response.data.result;
  },

  create: async (eventData: Partial<EventModel>): Promise<EventModel> => {
    const response = await httpApi.post<any>('/event', eventData);
    return response.data.data;
  },

  update: async (
    eventId: IdParam,
    eventData: Partial<EventModel>,
  ): Promise<EventModel> => {
    const response = await httpApi.patch<any>(`/event/${eventId}`, eventData);
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

  remove: async (eventId: IdParam): Promise<void> => {
    await httpApi.delete<any>(`/event/${eventId}`);
  },
};
