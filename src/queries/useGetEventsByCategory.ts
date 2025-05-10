import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useGetEventsByCategory = () => {
  return useQuery({
    queryKey: ["eventsByCategory"],
    queryFn: searchClient.getEventsByCategory,
    refetchOnWindowFocus: false,
  });
};