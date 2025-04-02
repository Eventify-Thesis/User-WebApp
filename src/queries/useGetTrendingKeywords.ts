import { useQuery } from "@tanstack/react-query";
import { trendingKeywordsClient } from "@/api/trendingKeywords.client";

export const GET_TRENDING_QUERY_KEY = "trendingKeywords";

export const useGetTrendingKeywords = () => {
  return useQuery<string[]>({
    queryKey: [GET_TRENDING_QUERY_KEY],
    queryFn: trendingKeywordsClient.getTrendingKeywords,
    refetchOnWindowFocus: false,
  });
};
