import { httpApi } from "@/api/http.api";
import EventModel from "@/domain/EventModel";
import { IdParam } from "@/types/types";
import { mockEvents } from "@/mocks/events";

export const eventClient = {
  getList: async (): Promise<EventModel[]> => {
    // Simulate API call and return mock data
    return mockEvents;
    // When API is implemented, use below
    // const response = await httpApi.get<any>("/event");
    // return response.data.data;
  },

  getById: async (eventId: IdParam): Promise<EventModel> => {
    const response = await httpApi.get<any>(`/event/${eventId}`);
    return response.data.data;
  },

  create: async (eventData: Partial<EventModel>): Promise<EventModel> => {
    const response = await httpApi.post<any>("/event", eventData);
    return response.data.data;
  },

  update: async (eventId: IdParam, eventData: Partial<EventModel>): Promise<EventModel> => {
    const response = await httpApi.patch<any>(`/event/${eventId}`, eventData);
    return response.data.data;
  },

  remove: async (eventId: IdParam): Promise<void> => {
    await httpApi.delete<any>(`/event/${eventId}`);
  },
};