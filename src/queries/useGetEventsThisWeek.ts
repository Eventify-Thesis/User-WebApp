import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsThisWeek = () => {
  return useQuery({
    queryKey: ["eventsThisWeek"],
    queryFn: searchClient.getEventsThisWeek,
    refetchOnWindowFocus: false,
  });
};