import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventGrid } from "@/components/interested/EventGrid/EventGrid";
import { useTranslation } from "react-i18next";
import { fetchInterestedEvents } from "@/api/interestedEvents";
import EventModel from "@/domain/EventModel";
import * as s from "@/components/interested/InterestedPage.styles";


export default function InterestedPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [fadingEvents, setFadingEvents] = useState<string[]>([]);
  const queryClient = useQueryClient(); //  Get query cache

  //  Fetch events using TanStack Query
  const { data: interestEvents = [], isLoading, error } = useQuery({
    queryKey: ["interestedEvents"],
    queryFn: fetchInterestedEvents,
    refetchOnWindowFocus: false,
  });

  //  Mutation to remove event from cache
  const { mutate: unbookmarkEvent } = useMutation({
    mutationFn: async (id: string) => {
      // Can call an API here if needed
      return id;
    },
    onMutate: async (id) => {
      setFadingEvents((prev) => [...prev, id]);

      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for animation

      //  Update React Query cache
      queryClient.setQueryData(["interestedEvents"], (oldData: EventModel[]) =>
        oldData.filter((event) => event.id !== id)
      );

      setFadingEvents((prev) => prev.filter((eventId) => eventId !== id));
    },
  });

  //  Filter events based on search query
  const filteredEvents = interestEvents.filter((event: EventModel) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <s.Container>
      <s.Title>{t("interested.title")}</s.Title>
      <s.SearchInput
        type="text"
        placeholder={t("interested.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading ? (
        <s.NoEventsContainer>
          <s.NoEventsText>{t("loading")}</s.NoEventsText>
        </s.NoEventsContainer>
      ) : error ? (
        <s.NoEventsContainer>
          <s.NoEventsText>{t("error.loadingEvents")}</s.NoEventsText>
        </s.NoEventsContainer>
      ) : filteredEvents.length > 0 ? (
        <EventGrid events={filteredEvents} onUnbookmark={unbookmarkEvent} fadingEvents={fadingEvents} />
      ) : (
        <s.NoEventsContainer>
          <s.SadIcon />
          <s.NoEventsText>{t("interested.noInterested")}</s.NoEventsText>
        </s.NoEventsContainer>
      )}
    </s.Container>
  );
}
