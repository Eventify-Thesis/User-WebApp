import { useNavigate } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';
import { Box, SimpleGrid } from '@mantine/core';
import { ExtendedEventModel } from '@/domain/EventModel';

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
      cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
      spacing={{ base: 'sm', sm: 'md' }}
      verticalSpacing={{ base: 'sm', sm: 'md' }}
      style={{
        padding: '1rem',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {events.map((event) => (
        <Box
          key={event.id}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
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
