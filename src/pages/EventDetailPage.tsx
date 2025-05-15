import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { HeroSection } from '@/components/event-detail/HeroSection/HeroSection';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { DescriptionSection } from '@/components/event-detail/DescriptionSection/DescriptionSection';
import { OrganizerInfoSection } from '@/components/event-detail/OrganizerInfoSection/OrganizerInfoSection';
import { useParams } from 'react-router-dom';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import TicketsInfoSection from '@/components/event-detail/TicketsInfoSection/TicketsInfoSection';
import { Box, Container } from '@mantine/core';
import './EventDetailPage.css';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams();

  const eventId = slug?.split('-')?.[slug?.split('-')?.length - 1];

  const { data: event } = useGetEventDetail(eventId);
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();
  const { eventDescription, orgName, orgLogoUrl, orgDescription } = event || {};

  const desktopLayout = (
    <BaseRow align="middle" gutter={[16, 24]} style={{ width: '100%', flexDirection: 'column' }}>
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
      </Box>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow align="middle" gutter={[16, 24]} style={{ width: '100%', flexDirection: 'column' }}>
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
