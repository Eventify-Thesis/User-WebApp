// SuggestedEvents.tsx
import React from 'react';
import { List } from 'antd';
import styled from 'styled-components';
import { EventCard } from './EventCard/EventCard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const EventListWrapper = styled.div`
  margin-top: 16px;
  color: white;
`;

const SectionTitle = styled.h3`
  color: white;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ViewMoreButton = styled.button`
  background-color: #22c55e;
  color: white;
  border-radius: 20px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-top: 16px;
  display: block;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';

export const SuggestedEvents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: events, isLoading: recommendedEventsLoading } =
    useSearchSemanticEvents({ query: '', page: 1, limit: 10 });

  // Normalize and map for EventGrid
  const relatedEvents = (() => {
    const eventsArr = Array.isArray(events) ? events : [];
    return eventsArr.map((event: any) => ({
      ...event,
      eventLogoUrl: event.eventLogoUrl,
      minimumPrice: event.minimumPrice,
      startTime: event.startTime ? new Date(event.startTime * 1000) : undefined,
      isInterested: event.isInterested ?? false,
    }));
  })();

  const handleEventClick = (event: any) => {
    if (event.url) {
      navigate(`${event.url}-${event.id}`);
    } else {
      navigate(`${event.eventName}-${event.id}`);
    }
  };

  return (
    <EventListWrapper>
      <SectionTitle>{t('searchBar.recommendations')}</SectionTitle>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={relatedEvents}
        renderItem={(event) => (
          <List.Item>
            <EventCard {...event} onClick={() => handleEventClick(event)} />
          </List.Item>
        )}
      />
      <ViewMoreButton onClick={() => navigate('/search-result?query=')}>
        {t('searchBar.viewMore')}
      </ViewMoreButton>
    </EventListWrapper>
  );
};
