import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useRelatedEvents = (eventId: string, limit: number = 4) => {
  return useQuery({
    queryKey: ["relatedEvents", eventId, limit],
    queryFn: () => searchClient.getRelatedEvents(eventId, limit),
    enabled: !!eventId,
    refetchOnWindowFocus: false,
  });
};
