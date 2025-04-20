import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { HeroSection } from '@/components/event-detail/HeroSection/HeroSection';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { DescriptionSection } from '@/components/event-detail/DescriptionSection/DescriptionSection';
import { OrganizerInfoSection } from '@/components/event-detail/OrganizerInfoSection/OrganizerInfoSection';
import styled from 'styled-components';
import { LAYOUT, media } from '@/styles/themes/constants';
import { useParams } from 'react-router-dom';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import TicketsInfoSection from '@/components/event-detail/TicketsInfoSection/TicketsInfoSection';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams();

  const eventId = slug?.split('-')?.[slug?.split('-')?.length - 1];

  const { data: event } = useGetEventDetail(eventId);
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();
  const { eventDescription, orgName, orgLogoUrl, orgDescription } = event || {};

  const desktopLayout = (
    <BaseRow align="middle" gutter={[10, 10]} style={{ width: '100%' }}>
      <Banner>
        <HeroSection event={event} />
      </Banner>
      <MainInfoSection>
        <DescriptionSection description={eventDescription} />
        <TicketsInfoSection shows={event?.shows || []} />
        <OrganizerInfoSection
          organizerDescription={orgDescription}
          organizerName={orgName}
          organizerImage={orgLogoUrl}
        />
      </MainInfoSection>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow align="middle" gutter={[10, 10]} style={{ width: '100%' }}>
      <Banner>
        <HeroSection event={event} />
      </Banner>
      <MainInfoSection>
        <DescriptionSection description={eventDescription} />
        <TicketsInfoSection shows={event?.shows || []} />
        <OrganizerInfoSection
          organizerDescription={orgDescription}
          organizerName={orgName}
          organizerImage={orgLogoUrl}
        />
      </MainInfoSection>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{event?.eventName || 'Eventify'}</PageTitle>
      {event && <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>}
    </>
  );
};

const Banner = styled.div`
  width: 100%;
  padding-block: 2rem;
  padding-inline: 1rem;
  display: flex;
  background: linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%);
  color: rgb(255, 255, 255);
`;
export const MainInfoSection = styled.div`
  padding: 0rem 8rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 75%;

  @media only screen and ${media.md} {
    padding: 0rem 8rem;
  }
`;

export default EventDetailPage;
