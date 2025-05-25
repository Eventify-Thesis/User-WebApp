import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsByCategory = (userId?: string) => {
  return useQuery({
    queryKey: ["eventsByCategory"],
    queryFn: () => searchClient.getEventsByCategory(userId),
    refetchOnWindowFocus: false,
  });
};