import { useQuery } from "@tanstack/react-query";
import { interestedEventsClient } from "@/api/interestedEvents.client";
import EventModel from "@/domain/EventModel";

export const GET_INTERESTED_EVENTS_QUERY_KEY = "interestedEvents";

export const useGetInterestedEvents = () => {
  return useQuery<EventModel[]>({
    queryKey: [GET_INTERESTED_EVENTS_QUERY_KEY],
    queryFn: interestedEventsClient.getList,
    refetchOnWindowFocus: false,
  });
};
