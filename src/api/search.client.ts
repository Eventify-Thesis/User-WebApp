import { httpApi } from '@/api/http.api';
import EventModel from '@/domain/EventModel';

export interface SearchEventsParams {
  query: string;
  limit?: number;
  city?: string;
  categories?: string[];
  start_date?: string;
  end_date?: string;
  userId?: string;
}

export const searchClient = {
  searchSemanticEvents: async (params: SearchEventsParams): Promise<EventModel[]> => {
    const { query, limit, city, categories, start_date, end_date, userId } = params;
    const response = await httpApi.get<any>("/search", {
      params: {
        q: query,
        ...(limit !== undefined ? { limit } : {}),
        ...(city ? { city } : {}),
        ...(categories ? { categories: categories.join(",") } : {}),
        ...(start_date ? { start_date } : {}),
        ...(end_date ? { end_date } : {}),
        ...(userId ? { user_id: userId } : {}),
      },
    });
    return response.data.data.result;
  },
};
