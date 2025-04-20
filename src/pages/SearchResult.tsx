import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import type { Dayjs } from "dayjs";
import EventFilters from "@/components/search-result/FilterContainer/FilterContainer";
import { EventGrid } from "@/components/EventList/EventGrid/EventGrid";
import { useSearchSemanticEvents } from "@/queries/useSearchSemanticEvents"; // make sure this is usable here

const Container = styled.div`
  background-color: black;
  min-height: 100vh;
  padding: 20px;
  color: white;
  box-sizing: border-box;
  @media (max-width: 991px) {
    padding: 0 40px;
  }
  @media (max-width: 640px) {
    padding: 0 20px;
  }
`;

function useQueryParam(key: string) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(key);
}

export default function SearchResults() {
  const query = useQueryParam("query") || "";
  const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [filterData, setFilterData] = useState<{
    location: string;
    isFree: boolean;
    categories: string[];
  }>({
    location: "Toàn quốc",
    isFree: false,
    categories: [],
  });

  const { data: searchResults = [], refetch, isFetching } = useSearchSemanticEvents(query, 4);

  const formattedEvents = searchResults.map((event: any) => ({
    id: event.id.toString(),
    eventName: event.eventName,
    price: "Miễn phí", // or some fallback logic
    date: new Date(), // fallback since API has no date
    eventBannerURL: event.event_logo_url, // placeholder
    ...event, // in case future data adds more
  }));

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, refetch]);

  return (
    <Container>
      <EventFilters
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      <EventGrid events={formattedEvents} />
    </Container>
  );
}
