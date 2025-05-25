import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsThisMonth = (userId?: string) => {
  return useQuery({
    queryKey: ["eventsThisMonth"],
    queryFn: () => searchClient.getEventsThisMonth(userId),
    refetchOnWindowFocus: false,
  });
};