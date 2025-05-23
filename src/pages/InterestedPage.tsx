import { useState } from 'react';
import { Box, Divider, Loader, Pagination, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { EventGrid } from '@/components/interested/EventGrid/EventGrid';
import * as s from '@/components/interested/InterestedPage.styles';
import { useGetInterests } from '@/queries/useGetInterests';
import { useDeleteInterest } from '@/mutations/useDeleteInterest';
import { useAuth } from '@clerk/clerk-react';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import { EventGrid as EventGridRecommended } from '@/components/EventList/EventGrid/EventGrid';
import './OrderHistory.css';

export default function InterestedPage() {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    isLoading,
    error,
    refetch,
} = useGetInterests(userId!, page, limit, !!userId);
  const { mutate: deleteInterest, fadingEvents } = useDeleteInterest();
  // Map InterestModel[] to EventModel[] for EventGrid
  const interestEvents = (data?.docs || []).map((interest: any) => ({
    id: interest.eventId,
    eventName: interest.event?.eventName,
    eventDescription: interest.event?.eventDescription,
    eventType: interest.event?.eventType,
    status: interest.event?.status,
    eventLogoUrl: interest.event?.eventLogoUrl,
    eventBannerUrl: interest.event?.eventBannerUrl,
    venueName: interest.event?.venueName,
    street: interest.event?.street,
    categories: interest.event?.categories, // or [] if you want a default
    minimumPrice: interest.lowest_price,
    startTime: interest.soonest_start_time,
    city: interest.city,
    district: interest.district,
    ward: interest.ward,
    isInterested: true,
    // ...add other EventModel fields as needed
  }));

  // Recommended events logic
  const { data: recommendedEvents, isLoading: recommendedEventsLoading } = interestEvents?.[0]?.id
    ? useRelatedEvents(
        interestEvents[0].id,
        DEFAULT_LIMIT,
        userId || ''
      )
    : useSearchSemanticEvents({
        limit: DEFAULT_LIMIT,
        userId: userId || '',
        query: '',
      });
  console.log("recommendedEvents: ", recommendedEvents);
  // Normalize and map for EventGrid
  const relatedEvents = (!recommendedEventsLoading)?(() => {
    const eventsArr = Array.isArray(recommendedEvents)
      ? recommendedEvents
      : [];
    return eventsArr.map((event: any) => ({
    ...event,
    eventLogoUrl: event.eventLogoUrl ?? event.event_logo_url,
    minimumPrice: event.minimumPrice ?? event.lowest_price,
    startTime: event.startTime
      ? new Date(event.startTime)
      : event.soonest_start_time
      ? new Date(event.soonest_start_time * 1000)
      : undefined,
    isInterested: event.isInterested ?? event.bookmarked,
  }));
  })():[];

  // Function to handle unbookmarking
  const handleUnbookmark = (id: number) => {
    if (!userId) return;
    deleteInterest({ userId: String(userId), eventId: Number(id) });
  };

  const filteredEvents = interestEvents.filter((event: any) =>
    event.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <s.Container>
      <s.Title>{t('interested.title')}</s.Title>
      <s.SearchInput
        type="text"
        placeholder={t('interested.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading ? (
        <s.NoEventsContainer>
          <s.NoEventsText>{t('loading')}</s.NoEventsText>
        </s.NoEventsContainer>
      ) : error ? (
        <s.NoEventsContainer>
          <s.NoEventsText>{t('error.loadingEvents')}</s.NoEventsText>
        </s.NoEventsContainer>
      ) : filteredEvents.length > 0 ? (
        <>
          <EventGrid
            events={filteredEvents}
            onUnbookmark={handleUnbookmark}
            fadingEvents={fadingEvents}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <Pagination
              value={page}
              onChange={setPage}
              total={data?.totalPages || 1}
            />
          </div>
        </>
      ) : (
        <s.NoEventsContainer>
          <s.SadIcon />
          <s.NoEventsText>{t('interested.noInterested')}</s.NoEventsText>
        </s.NoEventsContainer>
      )}

      {recommendedEventsLoading ? (
        <Loader color="yellow" size="lg" variant="dots" />
      ) : (
        <>
          <Title style={{ color: 'white' }} order={2} className="section-title">
            {t('orderHistory.recommended')}
          </Title>
          <Box className="recommended-events">
            <EventGridRecommended events={relatedEvents} userId={userId} onBookmarkChange={refetch} />
          </Box>
        </>
      )}
    </s.Container>
  );
}
