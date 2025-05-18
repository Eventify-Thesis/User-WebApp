import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import type { Dayjs } from "dayjs";
import EventFilters from "@/components/search-result/FilterContainer/FilterContainer";
import { EventGrid } from "@/components/EventList/EventGrid/EventGrid";
import { useSearchSemanticEvents } from "@/queries/useSearchSemanticEvents";
import * as s from "@/components/search-result/SearchResult.styles";
import { Loading } from "@/components/common/Loading/Loading";
import { FilterData } from "@/components/search-result/FilterContainer/FilterDropdown/FilterDropdown.styles";

function useQueryParam(key: string) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(key);
}

export default function SearchResults() {
  const { t } = useTranslation();
  const query = useQueryParam("query") || "";
  const categoryParam = useQueryParam("categories");
  const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [filterData, setFilterData] = useState<FilterData>({
    categories: categoryParam ? categoryParam.split(',') : [],
  });
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isFetching } = useSearchSemanticEvents({
    query,
    limit: 3,
    page,
    startDate: selectedDates[0] ? selectedDates[0].format("YYYY-MM-DD") : undefined,
    endDate: selectedDates[1] ? selectedDates[1].format("YYYY-MM-DD") : undefined,
    categories: filterData?.categories?.length ? filterData.categories : [],
    city: filterData.locationValue || undefined
  });

  // Accumulate results and check if we have more to load
  useEffect(() => {
    if (page === 1) {
      setEvents(searchResults);
    } else if (searchResults.length) {
      setEvents(prev => [...prev, ...searchResults]);
    }
    setHasMore(searchResults.length >= 1);
  }, [searchResults, page]);

  // Handle scroll to bottom
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (categoryParam) {
      setFilterData(fd => ({ ...fd, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  useEffect(() => {
    if (query) {
      setPage(1); // Reset to first page when query changes
    }
  }, [query]);

  const formattedEvents = events.map(event => ({
    id: event.id.toString(),
    eventName: event.eventName,
    minimumPrice: event.lowest_price,
    startTime: event.soonest_start_time,
    eventBannerUrl: event.event_logo_url,
    isInterested: event.bookmarked,
    ...event
  }));

  return (
    <s.Container id="sub-main-content" ref={containerRef}>
      <EventFilters
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      {isFetching && page === 1 ? (
        <Loading />
      ) : formattedEvents.length > 0 ? (
        <>
          <EventGrid events={formattedEvents} />
          {isFetching && <Loading />}
          {!hasMore && <p>No more events to load</p>}
        </>
      ) : (
        <s.NoEventsContainer>
          <s.SadIcon />
          <s.NoEventsText>{t('searchResult.noAvailableEvents')}</s.NoEventsText>
        </s.NoEventsContainer>
      )}
    </s.Container>
  );
}