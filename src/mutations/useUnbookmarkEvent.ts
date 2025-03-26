import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GET_INTERESTED_EVENTS_QUERY_KEY } from "../queries/useGetInterestedEvents";
import { useState } from "react";

export const useUnbookmarkEvent = () => {
  const queryClient = useQueryClient();
  const [fadingEvents, setFadingEvents] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return id; // Simulate API call if needed
    },
    onMutate: async (id) => {
      setFadingEvents((prev) => [...prev, id]);

      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for animation

      // Update React Query cache
      queryClient.setQueryData([GET_INTERESTED_EVENTS_QUERY_KEY], (oldData: any) =>
        oldData ? oldData.filter((event: any) => event.id !== id) : []
      );

      setFadingEvents((prev) => prev.filter((eventId) => eventId !== id));
    },
  });

  return { unbookmarkEvent: mutation.mutate, fadingEvents };
};
