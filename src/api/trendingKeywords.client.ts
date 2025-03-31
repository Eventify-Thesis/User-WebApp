import { httpApi } from "@/api/http.api";

// Mock data for trending keywords
const mockTrendingKeywords = ["ntpmm", "8wonder", "keshi"];

export const trendingKeywordsClient = {
  getTrendingKeywords: async (): Promise<string[]> => {
    // Simulate fetching from mock data
    return mockTrendingKeywords;
    
    // When API is implemented, use the actual API call:
    // const response = await httpApi.get<any>("/trending-keywords");
    // return response.data.data;
  },
};