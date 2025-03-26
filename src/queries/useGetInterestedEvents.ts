import { useQuery } from "@tanstack/react-query";
import { fetchInterestedEvents } from "@/api/interestedEvents";
import EventModel from "@/domain/EventModel";

export const GET_INTERESTED_EVENTS_QUERY_KEY = "interestedEvents";

export const useGetInterestedEvents = () => {
  return useQuery<EventModel[]>({
    queryKey: [GET_INTERESTED_EVENTS_QUERY_KEY],
    queryFn: fetchInterestedEvents,
    refetchOnWindowFocus: false,
  });
};
