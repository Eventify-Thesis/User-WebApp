import React from 'react';
import styled from 'styled-components';
import { EventInfo } from './EventInfo';
import { CountdownTimer } from './CountdownTimer';
import { EventDetailResponse } from '@/domain/EventModel';
import { useLanguage } from '@/hooks/useLanguage';

interface EventDetailsProps {
  event: EventDetailResponse;
  expireIn?: number;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  expireIn,
}) => {
  const language = useLanguage();

  return (
    <EventWrapper>
      <ContentContainer>
        <EventInfo
          title={event.eventName}
          venue={event.venueName}
          address={
            language === 'en'
              ? event.address.addressEn
              : event.address.addressVi
          }
          date={event.startTime}
        />
        {typeof expireIn === 'number' && expireIn > 0 && (
          <CountdownTimer expireIn={expireIn} />
        )}
      </ContentContainer>
    </EventWrapper>
  );
};

const EventWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-inline: 1.5rem;
  background: url('https://salt.tkbcdn.com/ts/ds/99/38/15/19919dffe776b8990327c2c461750391.jpg')
    center center / cover no-repeat;
  backdrop-filter: blur(1.5rem) brightness(0.6);
`;

const ContentContainer = styled.div`
  display: flex;
  min-height: 216px;
  width: 100%;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1.5rem 16rem;
  backdrop-filter: blur(1.5rem) brightness(0.6);
`;
