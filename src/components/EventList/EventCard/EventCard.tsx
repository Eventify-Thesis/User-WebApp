import { useState } from 'react';
import {
  Image,
  Text,
  Group,
  ActionIcon,
  Box,
  useMantineTheme,
} from '@mantine/core';
import {
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconMapPin,
} from '@tabler/icons-react';
import EventModel from '@/domain/EventModel';
import './EventCard.css';

interface EventCardProps extends EventModel {
  minimumPrice?: number;
  startTime?: Date;
  isInterested?: boolean;
  onClick?: () => void;
  address?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  eventBannerUrl,
  minimumPrice,
  startTime,
  address,
  isInterested: initialFavorited = false,
  onClick,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const theme = useMantineTheme();

  const toggleFavorite = () => setIsFavorited((prev) => !prev);
  console.log(address);
  return (
    <Box
      className="event-card-main"
      role={onClick ? 'button' : undefined}
      aria-label={eventName}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Box className="image-section">
        <Image
          src={eventBannerUrl}
          alt={eventName}
          className="event-image"
          fit="cover"
        />
        <ActionIcon
          className="bookmark-icon"
          variant="light"
          radius="xl"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {isFavorited ? (
            <IconStarFilled
              size={20}
              color={theme.colors.yellow[4]}
              stroke={1.5}
            />
          ) : (
            <IconStar size={20} color="white" stroke={1.5} />
          )}
        </ActionIcon>
      </Box>

      <Box className="card-content" p="md">
        <Text lineClamp={1} title={eventName} className="event-title" size="xs">
          {eventName}
        </Text>

        <Box className="event-details">
          {minimumPrice !== undefined && (
            <Text className="price-display">
              <span className="price-amount">{Math.floor(minimumPrice)} Đ</span>
            </Text>
          )}

          {address && (
            <Group
              gap="xs"
              align="center"
              className="address-display"
              wrap="nowrap"
            >
              <IconMapPin size={16} stroke={1.5} style={{ flexShrink: 0 }} />
              <Text size="sm" fw={400} lineClamp={1} className="address-text">
                {address}
              </Text>
            </Group>
          )}

          {startTime && (
            <Group
              gap="xs"
              align="center"
              className="date-display"
              wrap="nowrap"
            >
              <IconCalendar size={16} stroke={1.5} style={{ flexShrink: 0 }} />
              <Text size="sm" fw={500}>
                {new Date(Number(startTime) * 1000).toLocaleDateString()}
              </Text>
            </Group>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
