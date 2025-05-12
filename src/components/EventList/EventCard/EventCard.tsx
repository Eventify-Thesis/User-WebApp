import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  ActionIcon,
  Box,
  Title,
} from '@mantine/core';
import { IconStar, IconStarFilled, IconCalendar } from '@tabler/icons-react';
import EventModel from '@/domain/EventModel';
import './EventCard.css';

interface EventCardProps extends EventModel {
  minimumPrice?: number;
  startTime?: Date;
  isInterested?: boolean;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  eventName,
  eventLogoUrl,
  eventBannerUrl,
  minimumPrice,
  startTime,
  isInterested: initialFavorited = false,
  onClick,
}) => {
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const toggleFavorite = () => {
    setIsFavorited((prev: any) => !prev);
  };

  return (
    <Card
      className="event-card-main"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
      padding="sm"
      radius="md"
      withBorder
    >
      <Card.Section className="image-section">
        <Image
          src={eventBannerUrl}
          alt={eventName}
          className="event-image"
          fit="cover"
        />
        <ActionIcon
          className="bookmark-icon"
          variant="filled"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {isFavorited ? (
            <IconStarFilled size={20} color="#FFD700" stroke={1.5} />
          ) : (
            <IconStar size={20} color="white" stroke={1.5} />
          )}
        </ActionIcon>
      </Card.Section>

      <Box className="card-content" p="xs">
        <Box mb="xs">
          <Title
            order={4}
            lineClamp={1}
            title={eventName}
            className="event-title"
          >
            {eventName}
          </Title>
        </Box>

        {minimumPrice && (
          <Badge color="yellow" variant="light" className="price-badge">
            {t('homePage.from')} {Math.floor(minimumPrice)}
          </Badge>
        )}

        {startTime && (
          <Group gap="xs" className="date-display">
            <IconCalendar size={16} color="#ccc" stroke={1.5} />
            <Text size="sm" c="dimmed">
              {new Date(Number(startTime) * 1000).toDateString()}
            </Text>
          </Group>
        )}
      </Box>
    </Card>
  );
};

export default EventCard;
