import { useState } from 'react';
import { Box, Divider, Loader, Pagination, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import * as s from '@/components/interested/InterestedPage.styles';
import { useGetInterests } from '@/queries/useGetInterests';
import { useDeleteInterest } from '@/mutations/useDeleteInterest';
import { useAuth } from '@clerk/clerk-react';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
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
    minimumPrice: interest.minimumPrice,
    startTime: interest.startTime,
    city: interest.city,
    district: interest.district,
    ward: interest.ward,
    isInterested: true,
    // ...add other EventModel fields as needed
  }));

  // Recommended events logic
  const relatedEventsQuery = useRelatedEvents(
    interestEvents?.[0]?.id ?? 0,
    DEFAULT_LIMIT,
    userId || ''
  );
  
  const semanticEventsQuery = useSearchSemanticEvents({
    limit: DEFAULT_LIMIT,
    userId: userId || '',
    query: '',
  });
  
  // Determine which data to use
  const recommendedEvents = interestEvents?.[0]?.id
    ? relatedEventsQuery.data
    : semanticEventsQuery.data;
  
  const recommendedEventsLoading = interestEvents?.[0]?.id
    ? relatedEventsQuery.isLoading
    : semanticEventsQuery.isLoading;

  // Normalize and map for EventGrid
  const relatedEvents = (!recommendedEventsLoading)?(() => {
    if (!recommendedEvents) return [];
    const eventsArr = Array.isArray(recommendedEvents)
      ? recommendedEvents
      : [];
    return eventsArr.map((event: any) => ({
    ...event,
    eventLogoUrl: event.eventLogoUrl,
    minimumPrice: event.minimumPrice,
    startTime: event.startTime
      ? new Date(event.startTime * 1000)
      : undefined,
    isInterested: event.isInterested ?? false,
  }));
  })():[];

  // Function to handle unbookmarking
  const handleUnbookmark = (id: number) => {
    if (!userId) return;
    refetch();
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
            onBookmarkChange={handleUnbookmark}
            userId={userId}
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
          <Title style={{ color: 'white !important' }} order={2} className="page-title">
            {t('orderHistory.recommended')}
          </Title>
          <Box className="recommended-events">
            <EventGrid events={relatedEvents} userId={userId} onBookmarkChange={refetch} />
          </Box>
        </>
      )}
    </s.Container>
  );
}
