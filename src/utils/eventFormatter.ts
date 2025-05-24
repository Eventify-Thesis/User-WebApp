// src/utils/eventFormatter.ts
export const formatEvents = (events: any[], userInterests: { eventId: string }[] = []) => {
  return events.map((event: any) => {
    // Check if this event is bookmarked by user
    const isInterested = userInterests.some(
      (interest) => interest.eventId === event.id || interest.eventId === event.id?.toString()
    ) || event.isInterested || false;
    return {
      id: event.id.toString(),
      eventName: event.eventName,
      minimumPrice: event.minimumPrice,
      startTime: event.startTime,
      eventBannerUrl: event.eventBannerUrl,
      isInterested,
      ...event, // in case future data adds more
    };
  });
};