import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interestedEventsClient } from "@/api/interestedEvents.client";
import { GET_INTERESTED_EVENTS_QUERY_KEY } from "../queries/useGetInterestedEvents";
import { useState } from "react";

export const useUpdateInterestedEvent = () => {
  const queryClient = useQueryClient();
  const [fadingEvents, setFadingEvents] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async ({ eventId, isInterested }: { eventId: string; isInterested: boolean }) => {
      // Delete below code when API is ready
      return { eventId, isInterested };
      // Uncomment below code when API is ready
      // return interestedEventsClient.update(eventId, isInterested);
    },
    onMutate: async ({ eventId }) => {
      setFadingEvents((prev) => [...prev, eventId]); // Add event to fading list

      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate fade-out animation

      queryClient.setQueryData([GET_INTERESTED_EVENTS_QUERY_KEY], (oldData: any) =>
        oldData ? oldData.filter((event: any) => event.id !== eventId) : []
      );

      setFadingEvents((prev) => prev.filter((id) => id !== eventId)); // Remove event from fading list
    },
    onSuccess: () => {
      // Uncomment below code when API is ready
      // queryClient.invalidateQueries({ queryKey: [GET_INTERESTED_EVENTS_QUERY_KEY] });
    },
  });

  return { mutate: mutation.mutate, fadingEvents }; // ✅ Return fadingEvents
};
