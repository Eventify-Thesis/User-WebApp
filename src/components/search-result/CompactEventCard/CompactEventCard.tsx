import React from 'react';
import {
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Image,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface CompactEventCardProps {
  event: {
    id: string;
    eventName: string;
    minimumPrice?: number;
    startTime: Date | number;
    eventLogoUrl?: string;
    eventBannerUrl?: string;
    venueName?: string;
    formattedAddress?: string;
    categories?: string[];
    isInterested?: boolean;
  };
  onInterestToggle?: (eventId: string) => void;
  onClick?: () => void;
}

export const CompactEventCard: React.FC<CompactEventCardProps> = ({
  event,
  onInterestToggle,
  onClick,
}) => {
  const { t } = useTranslation();

  const formatDate = (date: Date | number) => {
    const eventDate = typeof date === 'number' ? new Date(date * 1000) : date;
    return dayjs(eventDate).format('MMM DD, HH:mm');
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return 'Free';
    return `$${price}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      music: 'pink',
      sports: 'green',
      theater: 'purple',
      art: 'orange',
      food: 'yellow',
      technology: 'blue',
      business: 'gray',
      education: 'teal',
      entertainment: 'red',
      festival: 'violet',
    };
    return colors[category?.toLowerCase()] || 'blue';
  };

  const handleInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInterestToggle?.(event.id);
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '12px',
        backgroundColor: 'white',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      <Group gap="sm" align="flex-start">
        {/* Event Image */}
        <Box style={{ flexShrink: 0 }}>
          <Image
            src={event.eventLogoUrl || event.eventBannerUrl}
            alt={event.eventName}
            width={60}
            height={60}
            radius="md"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+"
            style={{
              border: '1px solid #e9ecef',
            }}
          />
        </Box>

        {/* Event Details */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start">
            <Text
              size="sm"
              fw={600}
              lineClamp={2}
              style={{
                flex: 1,
                color: '#1a1a1a',
                lineHeight: 1.3,
              }}
            >
              {event.eventName}
            </Text>

            <ActionIcon
              variant="subtle"
              size="sm"
              color={event.isInterested ? 'red' : 'gray'}
              onClick={handleInterestClick}
              style={{ flexShrink: 0 }}
            >
              {event.isInterested ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
          </Group>

          {/* Date and Time */}
          <Group gap="xs" align="center">
            <IconClock size={14} color="#666" />
            <Text size="xs" c="dimmed">
              {formatDate(event.startTime)}
            </Text>
          </Group>

          {/* Location */}
          {(event.venueName || event.formattedAddress) && (
            <Group gap="xs" align="center">
              <IconMapPin size={14} color="#666" />
              <Text size="xs" c="dimmed" lineClamp={1} style={{ flex: 1 }}>
                {event.venueName || event.formattedAddress}
              </Text>
            </Group>
          )}

          {/* Categories and Price */}
          <Group justify="space-between" align="center">
            <Group gap="xs">
              {event.categories?.slice(0, 2).map((category, index) => (
                <Badge
                  key={index}
                  size="xs"
                  variant="light"
                  color={getCategoryColor(category)}
                  style={{
                    textTransform: 'capitalize',
                    fontSize: '10px',
                  }}
                >
                  {category}
                </Badge>
              ))}
              {event.categories && event.categories.length > 2 && (
                <Text size="xs" c="dimmed">
                  +{event.categories.length - 2}
                </Text>
              )}
            </Group>

            {event.minimumPrice !== undefined && (
              <Text
                size="sm"
                fw={600}
                style={{
                  color: event.minimumPrice === 0 ? '#28a745' : '#2563eb',
                }}
              >
                {formatPrice(event.minimumPrice)}
              </Text>
            )}
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};
