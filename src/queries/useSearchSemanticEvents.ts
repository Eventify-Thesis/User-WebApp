// useSearchSemanticEvents.ts
import { useQuery } from "@tanstack/react-query";
import { eventClient } from "@/api/event.client";
import { useAuth } from "@clerk/clerk-react";

export const useSearchSemanticEvents = (query: string, limit: number = 15) => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["semanticSearch", query, limit],
    queryFn: () => {
      return eventClient.searchSemanticEvents(query, userId, limit);
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
