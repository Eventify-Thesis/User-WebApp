import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsThisWeek = (userId?: string) => {
  return useQuery({
    queryKey: ["eventsThisWeek"],
    queryFn: () => searchClient.getEventsThisWeek(userId),
    refetchOnWindowFocus: false,
  });
};