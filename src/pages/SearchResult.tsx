import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import type { Dayjs } from "dayjs";
import EventFilters from "@/components/search-result/FilterContainer/FilterContainer";
import { EventGrid } from "@/components/EventList/EventGrid/EventGrid";
import { useSearchSemanticEvents } from "@/queries/useSearchSemanticEvents"; // make sure this is usable here
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

  // Pass selected filters to the useSearchSemanticEvents hook
  const { data: searchResults = [], refetch, isFetching } = useSearchSemanticEvents({
    query,
    limit: 5,
    startDate: selectedDates[0] ? selectedDates[0].format("YYYY-MM-DD") : undefined,  // Handle null or undefined for startDate
    endDate: selectedDates[1] ? selectedDates[1].format("YYYY-MM-DD") : undefined,    // Handle null or undefined for endDate
    categories: filterData?.categories?.length ? filterData.categories : [],       // Default to empty array if no categories
    city: filterData.locationValue || undefined                                
  });
  
  useEffect(() => {
    if (categoryParam) {
      setFilterData(fd => ({ ...fd, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  const formattedEvents = searchResults.map((event: any) => ({
    id: event.id.toString(),
    eventName: event.eventName,
    minimumPrice: event.lowest_price,
    startTime: event.soonest_start_time, 
    eventBannerUrl: event.event_logo_url,
    isInterested: event.bookmarked,
    ...event, // in case future data adds more
  }));

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, refetch]);

  return (
    <s.Container>
      <EventFilters
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      {isFetching ? (
        <Loading />
      ) : formattedEvents.length > 0 ? (
        <EventGrid events={formattedEvents}/>
      ) : (
        <s.NoEventsContainer>
          <s.SadIcon />
          <s.NoEventsText>{t('searchResult.noAvailableEvents')}</s.NoEventsText>
        </s.NoEventsContainer>
      )}
    </s.Container>
  );
}