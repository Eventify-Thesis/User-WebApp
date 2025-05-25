import { useNavigate } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';
import { Box, SimpleGrid } from '@mantine/core';
import ExtendedEventModel from '@/domain/ExtendedEventModel';

interface EventGridProps {
  events: ExtendedEventModel[];
}

export const EventGrid: React.FC<
  EventGridProps & {
    userId?: string | null;
    onBookmarkChange?: (id: number) => void;
  }
> = ({ events, userId, onBookmarkChange }) => {
  const navigate = useNavigate();
  const handleEventClick = (event: any) => {
    if (event.url) {
      window.location.href = `${event.url}-${event.id}`;
    } else {
      window.location.href = `${event.eventName}-${event.id}`;
    }
  };
  return (
    <SimpleGrid
      cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }}
      spacing="md"
      verticalSpacing="md"
      style={{ padding: '1rem', gap: '1rem' }}
    >
      {events.map((event) => (
        <Box
          key={event.id}
          style={{
            width: '100%',
            height: '100%',
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EventCard
            className="event-card-grid"
            {...event}
            userId={userId}
            eventBannerUrl={event.eventLogoUrl}
            eventLogoUrl={event.eventLogoUrl}
            minimumPrice={event.minimumPrice}
            startTime={event.startTime}
            isInterested={event.isInterested ?? false}
            onClick={() => handleEventClick(event)}
            onBookmarkChange={onBookmarkChange}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};
