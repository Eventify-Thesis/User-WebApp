import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { EventDetailResponse } from '@/domain/EventModel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { ShowModel } from '@/domain/ShowModel';
import { TicketTypeModel } from '@/domain/TicketTypeModel';
import { Box, Title, Text, Button, Image, Group, Stack, Paper } from '@mantine/core';
import { IconCalendar, IconMapPin, IconTicket } from '@tabler/icons-react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  event: EventDetailResponse;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  const { t, i18n } = useTranslation();
  const { isDesktop } = useResponsive();
  const { startTime, eventName, venueName, address, eventBannerUrl } = event;
  const navigate = useNavigate();
  let formattedAddress;
  if (i18n.language === 'vi') {
    formattedAddress = address.addressVi;
  } else {
    formattedAddress = address.addressEn;
  }

  const formattedStartTime = dayjs(startTime)
    .locale(i18n.language)
    .format('dddd, MMMM D, YYYY HH:mm');

  // Removed unused navigate variable

  // Get the minimum price of all ticket types
  const minPrice = event.shows?.reduce(
    (min: number, show: ShowModel) =>
      show.ticketTypes?.reduce(
        (min: number, ticketType: TicketTypeModel) =>
          ticketType.price < min ? ticketType.price : min,
        min,
      ) ?? min,
    Infinity,
  ) ?? 0;
  
  // Format price for display
  const formattedPrice = minPrice !== Infinity ? `${Math.round(minPrice).toLocaleString()} Đ` : '0 Đ';

  const desktopLayout = (
    <Paper className="hero-section-wrapper" shadow="sm" radius="xl">
      {/* Circle dividers for the ticket design */}
      <div id="circle1" className="circle"></div>
      <div id="circle2" className="circle"></div>

      <Box className="event-content">
        <Stack className="event-info" gap="md">
          <Title className="event-title" order={1}>{eventName}</Title>
          <Group className="event-date" gap="xs">
            <IconCalendar size={20} stroke={1.5} color="#228be6" />
            <Text size="md" c="dimmed">{formattedStartTime}</Text>
          </Group>
          <Box>
            <Group className="venue-info" gap="xs">
              <IconMapPin size={20} stroke={1.5} color="#228be6" />
              <Text className="venue-name" fw={600}>{venueName}</Text>
            </Group>
            <Text className="address" size="sm">{formattedAddress}</Text>
          </Box>
        </Stack>
        <Box className="price-section">
          <Box className="price-info">
            <Text className="price-label" size="sm" fw={500}>
              {t('eventDetailPage.priceFrom')}
            </Text>
            <Text className="price" fw={800}>{formattedPrice}</Text>
          </Box>
          <Button 
            className="buy-ticket-button"
            leftSection={<IconTicket size={18} />}
            radius="md"
            onClick={() => {
              navigate(`/event/${event.id}`);
            }}
          >
            {t('eventDetailPage.buyTicket')}
          </Button>
        </Box>

        {/* Ticket info element */}
        <Paper className="ticket-info" radius="md" shadow="xs">
          <Group gap="xs" align="center">
            <IconTicket size={14} stroke={1.5} />
            <Text size="xs" fw={500}>ID: {typeof event.id === 'string' ? event.id.slice(-6).toUpperCase() : 'TICKET'}</Text>
          </Group>
        </Paper>
      </Box>
      
      <Box className="event-image-container">
        <Image
          src={eventBannerUrl}
          alt="Event banner"
          className="event-image"
          radius={0}
        />
      </Box>
    </Paper>
  );

  const mobileAndTabletLayout = (
    <Paper className="hero-section-wrapper" shadow="sm" radius="lg">
      {/* Circle dividers (hidden on mobile but styled in CSS) */}
      <div id="circle1" className="circle"></div>
      <div id="circle2" className="circle"></div>
      
      <Box className="event-content">
        <Stack className="event-info" gap="md">
          <Title className="event-title" order={2}>{eventName}</Title>
          <Group className="event-date" gap="xs">
            <IconCalendar size={18} stroke={1.5} color="#228be6" />
            <Text size="sm" c="dimmed">{formattedStartTime}</Text>
          </Group>
          <Box>
            <Group className="venue-info" gap="xs">
              <IconMapPin size={18} stroke={1.5} color="#228be6" />
              <Text className="venue-name" size="sm" fw={600}>{venueName}</Text>
            </Group>
            <Text className="address" size="xs">{formattedAddress}</Text>
          </Box>
        </Stack>
        <Box className="price-section">
          <Box className="price-info">
            <Text className="price-label" size="xs" fw={500}>
              {t('eventDetailPage.priceFrom')}
            </Text>
            <Text className="price" fw={800} size="xl">{formattedPrice}</Text>
          </Box>
          <Button 
            className="buy-ticket-button"
            leftSection={<IconTicket size={16} />}
            radius="md"
            fullWidth
          >
            {t('eventDetailPage.buyTicket')}
          </Button>
        </Box>

        {/* Ticket info element */}
        <Paper className="ticket-info" radius="md" shadow="xs">
          <Group gap="xs" align="center">
            <IconTicket size={12} stroke={1.5} />
            <Text size="xs" fw={500}>ID: {typeof event.id === 'string' ? event.id.slice(-6).toUpperCase() : 'TICKET'}</Text>
          </Group>
        </Paper>
      </Box>
      
      {/* Dotted separator line for mobile */}
      <div className="mobile-separator"></div>
      
      <Box className="event-image-container">
        <Image
          src={eventBannerUrl}
          alt="Event banner"
          className="event-image"
          radius={0}
        />
      </Box>
    </Paper>
  );

  return <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>;
};
