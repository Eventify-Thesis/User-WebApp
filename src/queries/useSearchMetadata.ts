import { useQuery } from "@tanstack/react-query";
import { searchClient } from "@/api/search.client";

export const useSearchMetadata = () => {
  return useQuery({
    queryKey: ["searchMetadata"],
    queryFn: searchClient.getSearchMetadata,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};
