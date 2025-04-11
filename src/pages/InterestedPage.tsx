import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventGrid } from '@/components/interested/EventGrid/EventGrid';
import EventModel from '@/domain/EventModel';
import * as s from '@/components/interested/InterestedPage.styles';
import { useGetInterestedEvents } from '@/queries/useGetInterestedEvents';
import { useUpdateInterestedEvent } from '@/mutations/useUnbookmarkEvent';

export default function InterestedPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: interestEvents = [],
    isLoading,
    error,
  } = useGetInterestedEvents();
  const { mutate: updateInterestedEvent, fadingEvents } =
    useUpdateInterestedEvent();

  // Function to handle unbookmarking
  const handleUnbookmark = (eventId: number) => {
    updateInterestedEvent({ eventId, isInterested: false }); // Call the mutation with false
  };

  // Filter events based on search query
  const filteredEvents = interestEvents.filter((event: EventModel) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
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
        <EventGrid
          events={filteredEvents}
          onUnbookmark={handleUnbookmark}
          fadingEvents={fadingEvents}
        />
      ) : (
        <s.NoEventsContainer>
          <s.SadIcon />
          <s.NoEventsText>{t('interested.noInterested')}</s.NoEventsText>
        </s.NoEventsContainer>
      )}
    </s.Container>
  );
}
