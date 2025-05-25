import { useState } from 'react';
import {
  Image,
  Text,
  Group,
  ActionIcon,
  Box,
  useMantineTheme,
  Tooltip,
} from '@mantine/core';
import {
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconMapPin,
} from '@tabler/icons-react';
import EventModel from '@/domain/EventModel';
import './EventCard.css';
import { useCreateInterest } from '@/mutations/useCreateInterest';
import { useDeleteInterest } from '@/mutations/useDeleteInterest';

interface EventCardProps extends EventModel {
  minimumPrice?: number;
  startTime?: Date;
  isInterested?: boolean;
  onClick?: () => void;
  address?: string;
  className?: string;
  userId?: string | null;
  onBookmarkChange?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  eventName,
  eventLogoUrl,
  minimumPrice,
  startTime,
  address,
  isInterested = false,
  onClick,
  className = '',
  userId,
  onBookmarkChange,
}) => {
  const [isFavorited, setIsFavorited] = useState(isInterested);
  const createInterest = useCreateInterest();
  const deleteInterest = useDeleteInterest();

  const theme = useMantineTheme();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || !id) return;

    if (isFavorited) {
      setIsFavorited(false);
      deleteInterest.mutate(
        { userId, eventId: id },
        {
          onSuccess: () => {
            onBookmarkChange?.(id);
          },
          onError: () => setIsFavorited(true)
        }
      );
    } else {
      setIsFavorited(true);
      createInterest.mutate(
        { userId, eventId: id },
        {
          onSuccess: () => {
            onBookmarkChange?.(id);
          },
          onError: () => setIsFavorited(false)
        }
      );
    }
  };
  
  return (
    <Box
      className={`event-card-main ${className}`}
      role={onClick ? 'button' : undefined}
      aria-label={eventName}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Box className="image-section">
        <Image
          src={eventLogoUrl}
          alt={eventName}
          className="event-image"
          fit="cover"
        />
        {userId && (
        <ActionIcon
          className="bookmark-icon"
          variant="light"
          radius="xl"
          onClick={toggleFavorite}
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
      )}
      </Box>

      <Box className="card-content" p="md">
        <Tooltip 
          label={eventName} 
          position="top" 
          withArrow 
          transitionProps={{ transition: 'fade', duration: 200 }}
          // disabled={eventName.length <= 20} // Only show tooltip if text is long
        >
          <Text 
            lineClamp={1} 
            className="event-title" 
            size="xs"
            style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {eventName}
          </Text>
        </Tooltip>

        <Box className="event-details">
          {minimumPrice !== undefined && (
            <Text className="price-display">
              {minimumPrice == 0 || !minimumPrice ? (
                <Text c="green" size="xl">
                  Free
                </Text>
              ) : (
                <span className="price-amount">
                  From {new Intl.NumberFormat('vi-VN').format(minimumPrice)} Đ
                </span>
              )}
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
              <Tooltip 
                label={address} 
                position="top" 
                withArrow 
                transitionProps={{ transition: 'fade', duration: 200 }}
                disabled={address.length <= 30} // Only show tooltip if text is long
              >
                <Text 
                  size="sm" 
                  fw={400} 
                  lineClamp={1} 
                  className="address-text"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {address}
                </Text>
              </Tooltip>
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
              <Text 
                size="sm" 
                fw={500}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
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
