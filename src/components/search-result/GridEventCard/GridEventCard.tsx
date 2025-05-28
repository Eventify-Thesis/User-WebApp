import React from 'react';
import {
  Card,
  Text,
  Badge,
  ActionIcon,
  Image,
  Stack,
  Group,
  Box,
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

interface GridEventCardProps {
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

export const GridEventCard: React.FC<GridEventCardProps> = ({
  event,
  onInterestToggle,
  onClick,
}) => {
  const formatDate = (date: Date | number) => {
    const eventDate = typeof date === 'number' ? new Date(date * 1000) : date;
    return dayjs(eventDate).format('MMM DD');
  };

  const formatTime = (date: Date | number) => {
    const eventDate = typeof date === 'number' ? new Date(date * 1000) : date;
    return dayjs(eventDate).format('HH:mm');
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
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
      padding="xs"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '280px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Event Image */}
      <Box
        style={{
          position: 'relative',
          marginBottom: '8px',
          width: '100%',
          height: '160px',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={event.eventLogoUrl || event.eventBannerUrl}
          alt={event.eventName}
          height="100%"
          width="100%"
          radius="sm"
          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA0MEgxMjBWODBIODBWNDBaIiBmaWxsPSIjREREREREIi8+Cjwvc3ZnPg=="
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Interest Button Overlay */}
        <ActionIcon
          variant="filled"
          size="sm"
          color={event.isInterested ? 'red' : 'gray'}
          onClick={handleInterestClick}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: event.isInterested ? '#e03131' : '#666',
          }}
        >
          {event.isInterested ? (
            <IconHeartFilled size={14} />
          ) : (
            <IconHeart size={14} />
          )}
        </ActionIcon>

        {/* Price Badge */}
        {event.minimumPrice !== undefined && (
          <Badge
            size="sm"
            variant="filled"
            color={event.minimumPrice === 0 ? 'green' : 'blue'}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              fontWeight: 600,
            }}
          >
            {formatPrice(event.minimumPrice)}
          </Badge>
        )}
      </Box>

      {/* Event Details */}
      <Stack gap="xs" style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Event Name */}
        <Text
          size="sm"
          fw={600}
          lineClamp={2}
          style={{
            color: '#1a1a1a',
            lineHeight: 1.3,
            minHeight: '2.6em',
          }}
        >
          {event.eventName}
        </Text>

        {/* Date and Time */}
        <Group gap="xs" align="center">
          <IconClock size={12} color="#666" />
          <Text size="xs" c="dimmed">
            {formatDate(event.startTime)}
          </Text>
          <Text size="xs" c="dimmed" fw={500}>
            {formatTime(event.startTime)}
          </Text>
        </Group>

        {/* Location */}
        {(event.venueName || event.formattedAddress) && (
          <Group gap="xs" align="flex-start">
            <IconMapPin
              size={12}
              color="#666"
              style={{ marginTop: '2px', flexShrink: 0 }}
            />
            <Text
              size="xs"
              c="dimmed"
              lineClamp={2}
              style={{
                flex: 1,
                lineHeight: 1.3,
                minHeight: '2.6em',
              }}
            >
              {event.venueName || event.formattedAddress}
            </Text>
          </Group>
        )}

        {/* Categories */}
        <Group gap="xs" style={{ marginTop: 'auto' }}>
          {event.categories?.slice(0, 1).map((category, index) => (
            <Badge
              key={index}
              size="xs"
              variant="light"
              color={getCategoryColor(category)}
              style={{
                textTransform: 'capitalize',
                fontSize: '9px',
                fontWeight: 500,
              }}
            >
              {category}
            </Badge>
          ))}
          {event.categories && event.categories.length > 1 && (
            <Text size="xs" c="dimmed" fw={500}>
              +{event.categories.length - 1}
            </Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
};
