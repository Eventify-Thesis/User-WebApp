import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useRelatedEvents = (eventId: number, limit: number = 4, userId?: string) => {
  return useQuery({
    queryKey: ["relatedEvents", eventId, limit],
    queryFn: () => searchClient.getRelatedEvents(eventId, limit, userId),
    enabled: !!eventId,
    refetchOnWindowFocus: false,
  });
};
