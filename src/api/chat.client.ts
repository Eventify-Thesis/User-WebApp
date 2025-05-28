import { httpApi } from '@/api/http.api';

export interface ChatRequest {
  query: string;
  userId?: string;
  language?: string;
  maxResults?: number;
}

export interface EventResult {
  id: string;
  title: string;
  description: string;
  city: string;
  start_time: string;
  end_time: string;
  category: string;
  score: number;
  url: string;
}

export interface ChatResponse {
  text: string;
  events: EventResult[];
  query_embedding_time: number;
  search_time: number;
  generation_time: number;
}

export const chatClient = {
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await httpApi.post<any>('/user/chat', request);
    return response.data.data;
  },
};
