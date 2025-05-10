// src/utils/eventFormatter.ts
export const formatEvents = (events: any[]) => {
    return events.map((event: any) => ({
      id: event.id.toString(),
      eventName: event.eventName,
      minimumPrice: event.lowest_price,
      startTime: event.soonest_start_time,
      eventBannerUrl: event.event_logo_url,
      isInterested: event.bookmarked,
      ...event, // in case future data adds more
    }));
  };