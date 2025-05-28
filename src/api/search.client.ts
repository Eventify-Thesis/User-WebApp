import { httpApi } from '@/api/http.api';
import EventModel from '@/domain/EventModel';
import { ExtendedEventModel } from '@/domain/EventModel';

export interface SearchEventsParams {
  query: string;
  limit?: number;
  page?: number;
  city?: string;
  categories?: string[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  min_lat?: number;
  max_lat?: number;
  min_lon?: number;
  max_lon?: number;
}

export const searchClient = {
  searchSemanticEvents: async (
    params: SearchEventsParams,
  ): Promise<ExtendedEventModel[]> => {
    let {
      query,
      limit,
      page,
      city,
      categories,
      startDate,
      endDate,
      userId,
      min_lat,
      max_lat,
      min_lon,
      max_lon,
    } = params;
    // If query is undefined or null, set to empty string
    if (query === undefined || query === null) query = '';

    const response = await httpApi.get<any>('/search', {
      params: {
        ...(query !== undefined ? { q: query } : {}),
        ...(limit !== undefined ? { limit } : {}),
        ...(page !== undefined ? { page } : {}),
        ...(city ? { city } : {}),
        ...(categories ? { categories: categories.join(',') } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(userId ? { userId } : {}),
        ...(min_lat !== undefined ? { min_lat } : {}),
        ...(max_lat !== undefined ? { max_lat } : {}),
        ...(min_lon !== undefined ? { min_lon } : {}),
        ...(max_lon !== undefined ? { max_lon } : {}),
      },
    });
    return response.data.data.result;
  },

  getSearchMetadata: async (): Promise<any> => {
    const response = await httpApi.get<any>('/search/metadata');
    return response.data.data;
  },

  getRelatedEvents: async (
    eventId: number,
    limit: number = 4,
    userId?: string,
  ): Promise<any> => {
    const response = await httpApi.get<any>(
      `/search/events/${eventId}/related`,
      { params: { limit, userId } },
    );
    return response.data.data.related_events.map((event: any) => ({
      ...event,
      minimumPrice: event.minimumPrice,
      startTime: event.startTime,
      isInterested: event.isInterested,
    }));
  },

  getEventsThisMonth: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-month', {
      params: { userId },
    });
    return response.data.data.events;
  },

  getEventsThisWeek: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events/this-week', {
      params: { userId },
    });
    return response.data.data.events;
  },

  getEventsByCategory: async (userId?: string): Promise<any[]> => {
    const response = await httpApi.get<any>('/search/events-by-category', {
      params: { userId },
    });
    return response.data.data;
  },
};
