import { mockInterestedEvents } from "@/mocks/interestedEvents";
import EventModel from "@/domain/EventModel";

export const fetchInterestedEvents = async (): Promise<EventModel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInterestedEvents);
    }, 1000); // Simulating API delay
  });
};
