import { httpApi } from '@/api/http.api';
import EventModel from '@/domain/EventModel';
import ExtendedEventModel from '@/domain/ExtendedEventModel';

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
  searchSemanticEvents: async (params: SearchEventsParams): Promise<ExtendedEventModel[]> => {
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
        ...(userId ? { userId } : {}),
      },
    });
    return response.data.data.result;
  },

  getSearchMetadata: async (): Promise<any> => {
    const response = await httpApi.get<any>("/search/metadata");
    return response.data.data;
  },

  getRelatedEvents: async (eventId: number, limit: number = 4, userId?: string): Promise<any> => {
    const response = await httpApi.get<any>(`/search/events/${eventId}/related`, { params: { limit, userId } });
    return response.data.data.related_events.map((event: any) => ({
      ...event,
      minimumPrice: event.lowest_price,
      startTime: event.soonest_start_time,
      isInterested: event.bookmarked,
    }));
  },

  getEventsThisMonth: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-month', { params: { userId } });
    return response.data.data.events;
  },

  getEventsThisWeek: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-week', { params: { userId } });
    return response.data.data.events;
  },

  getEventsByCategory: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events-by-category', { params: { userId } });
    return response.data.data;
  },
};
