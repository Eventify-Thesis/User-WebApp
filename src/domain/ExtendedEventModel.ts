import EventModel from "@/domain/EventModel";

// Extend EventModel with additional fields
export default interface ExtendedEventModel extends EventModel {
  soonest_start_time: any;
  lowest_price: undefined;
  event_logo_url: any;
  minimumPrice: number;
  startTime: Date;
  isInterested: boolean;
}