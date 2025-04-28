// useSearchSemanticEvents.ts
import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";
import { useAuth } from "@clerk/clerk-react";
import { SearchEventsParams } from "@/api/search.client";

export const useSearchSemanticEvents = (params: SearchEventsParams) => {
  const { userId: authUserId } = useAuth();
  return useQuery({
    queryKey: ["semanticSearch", params],
    queryFn: async () => {
      const result = await searchClient.searchSemanticEvents({
        ...params,
        userId: params.userId ?? authUserId ?? undefined,
      });
      return result ?? []; // Ensure fallback to [] if result is undefined
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });
};
