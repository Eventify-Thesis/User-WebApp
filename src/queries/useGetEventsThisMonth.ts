import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsThisMonth = () => {
  return useQuery({
    queryKey: ["eventsThisMonth"],
    queryFn: searchClient.getEventsThisMonth,
    refetchOnWindowFocus: false,
  });
};