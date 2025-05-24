import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { HeroSection } from '@/components/event-detail/HeroSection/HeroSection';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { DescriptionSection } from '@/components/event-detail/DescriptionSection/DescriptionSection';
import { OrganizerInfoSection } from '@/components/event-detail/OrganizerInfoSection/OrganizerInfoSection';
import { useParams } from 'react-router-dom';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import TicketsInfoSection from '@/components/event-detail/TicketsInfoSection/TicketsInfoSection';
import { Box, Container, Title } from '@mantine/core';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useAuth } from '@clerk/clerk-react';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import './EventDetailPage.css';
import styled from 'styled-components';

const RecommendedEventsBox = styled(Box)`
  width: 100%;
  margin: 0 auto;
`;

const EventDetailPage: React.FC = () => {
  const { slug } = useParams();

  const eventId = slug?.split('-')?.[slug?.split('-')?.length - 1];

  const { data: event } = useGetEventDetail(eventId);
  const { isTablet, isDesktop } = useResponsive();

  const { userId } = useAuth();
  const { t } = useTranslation();
  const { eventDescription, orgName, orgLogoUrl, orgDescription } = event || {};

  const { data: recommendedEvents, isLoading } = useRelatedEvents(
        Number(eventId),
        DEFAULT_LIMIT,
        userId || ''
      );
  console.log(recommendedEvents);
  // Normalize and map for EventGrid
  const relatedEvents = (() => {
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
  })();

  const desktopLayout = (
    <BaseRow
      align="middle"
      gutter={[16, 24]}
      style={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#f4f7fc',
      }}
    >
      <Box className="event-banner">
        <HeroSection event={event} />
      </Box>
      <Box className="main-info-section">
        <Box className="section-container">
          <DescriptionSection description={eventDescription} />
        </Box>
        <Box className="section-container">
          <TicketsInfoSection shows={event?.shows || []} eventId={event?.id} />
        </Box>
        <Box className="section-container">
          <OrganizerInfoSection
            organizerDescription={orgDescription}
            organizerName={orgName}
            organizerImage={orgLogoUrl}
          />
        </Box>
        <Title order={2} className="section-title">
                  {t('orderHistory.recommended')}
        </Title>
        <RecommendedEventsBox>
          <EventGrid events={relatedEvents} />
        </RecommendedEventsBox>
      </Box>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow
      align="middle"
      gutter={[16, 24]}
      style={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#f4f7fc !important',
      }}
    >
      <Box className="event-banner">
        <HeroSection event={event} />
      </Box>
      <Box className="main-info-section">
        <Box className="section-container">
          <DescriptionSection description={eventDescription} />
        </Box>
        <Box className="section-container">
          <TicketsInfoSection shows={event?.shows || []} eventId={event?.id} />
        </Box>
        <Box className="section-container">
          <OrganizerInfoSection
            organizerDescription={orgDescription}
            organizerName={orgName}
            organizerImage={orgLogoUrl}
          />
        </Box>
        <Title order={2} className="section-title">
                  {t('orderHistory.recommended')}
        </Title>
        <RecommendedEventsBox>
          <EventGrid events={relatedEvents} />
        </RecommendedEventsBox>
      </Box>
    </BaseRow>
  );

  return (
    <Container fluid className="event-detail-container" p={0}>
      <PageTitle>{event?.eventName || 'Eventify'}</PageTitle>
      {event && <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>}
    </Container>
  );
};

export default EventDetailPage;
