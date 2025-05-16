import { httpApi } from '@/api/http.api';
import EventModel from '@/domain/EventModel';

export interface SearchEventsParams {
  query: string;
  limit?: number;
  page?: number;
  city?: string;
  categories?: string[];
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export const searchClient = {
  searchSemanticEvents: async (params: SearchEventsParams): Promise<EventModel[]> => {
    let { query, limit, page, city, categories, startDate, endDate, userId } = params;
    // If query is undefined or null, set to empty string
    if (query === undefined || query === null) query = '';

    const response = await httpApi.get<any>("/search", {
      params: {
        ...(query !== undefined ? { q: query } : {}),
        ...(limit !== undefined ? { limit } : {}),
        ...(page !== undefined ? { page } : {}),
        ...(city ? { city } : {}),
        ...(categories ? { categories: categories.join(",") } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(userId ? { user_id: userId } : {}),
      },
    });
    return response.data.data.result;
  },

  getSearchMetadata: async (): Promise<any> => {
    const response = await httpApi.get<any>("/search/metadata");
    return response.data.data;
  },

  getRelatedEvents: async (eventId: string, limit: number = 4): Promise<EventModel[]> => {
    const response = await httpApi.get<any>(`/search/events/${eventId}/related`, { params: { limit } });
    return response.data.data.result;
  },

  getEventsThisMonth: async (): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-month');
    return response.data.data.events;
  },

  getEventsThisWeek: async (): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-week');
    return response.data.data.events;
  },

  getEventsByCategory: async (): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events-by-category');
    return response.data.data;
  },
};
