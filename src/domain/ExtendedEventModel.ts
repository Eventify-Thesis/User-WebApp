import EventModel from "@/domain/EventModel";

// Extend EventModel with additional fields
export default interface ExtendedEventModel extends EventModel {
  minimumPrice: number;
  startTime: Date;
  isInterested: boolean;
}