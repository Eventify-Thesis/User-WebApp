import { httpApi } from "@/api/http.api";
import EventModel from "@/domain/EventModel";
import { IdParam } from "@/types/types";
import { mockInterestedEvents } from "@/mocks/interestedEvents";

export const interestedEventsClient = {
  getList: async (): Promise<EventModel[]> => {
    // Simulate API call and return mock data
        return mockInterestedEvents;
    // When API is implemented, use below
    // const response = await httpApi.get<any>("/interested");
    // return response.data.data;
  },

  update: async (eventId: IdParam, isInterested: boolean): Promise<EventModel> => {
    const response = await httpApi.patch<any>(`/events/${eventId}/interested`, { isInterested });
    return response.data.data;
  },
};
