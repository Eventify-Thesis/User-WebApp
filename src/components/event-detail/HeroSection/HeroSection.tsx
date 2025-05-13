import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { EventDetailResponse } from '@/domain/EventModel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { ShowModel } from '@/domain/ShowModel';
import { TicketTypeModel } from '@/domain/TicketTypeModel';
import { Box, Title, Text, Button, Image, Group, Stack } from '@mantine/core';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import './HeroSection.css';

interface HeroSectionProps {
  event: EventDetailResponse;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  const { t, i18n } = useTranslation();
  const { isDesktop } = useResponsive();
  const { startTime, eventName, venueName, address, eventBannerUrl } = event;

  let formattedAddress;
  if (i18n.language === 'vi') {
    formattedAddress = address.addressVi;
  } else {
    formattedAddress = address.addressEn;
  }

  const formattedStartTime = dayjs(startTime)
    .locale(i18n.language)
    .format('dddd, MMMM D, YYYY HH:mm');

  const navigate = useNavigate();

  // Get the minimum price of all ticket types
  const minPrice = event.shows?.reduce(
    (min: number, show: ShowModel) =>
      show.ticketTypes.reduce(
        (min: number, ticketType: TicketTypeModel) =>
          ticketType.price < min ? ticketType.price : min,
        min,
      ),
    Infinity,
  );

  const desktopLayout = (
    <Box className="hero-section-wrapper">
      <Box className="event-content">
        <div id="circle1" className="circle"></div>
        <div id="circle2" className="circle"></div>
        <Stack className="event-info">
          <Title className="event-title">{eventName}</Title>
          <Group className="event-date">
            <IconCalendar size={20} stroke={1.5} />
            <Text>{formattedStartTime}</Text>
          </Group>
          <Box>
            <Group className="venue-info">
              <IconMapPin size={20} stroke={1.5} />
              <Text className="venue-name">{venueName}</Text>
            </Group>
            <Text className="address">{formattedAddress}</Text>
          </Box>
        </Stack>
        <Box className="price-section">
          <Box className="price-info">
            <Text className="price-label">
              {t('eventDetailPage.priceFrom')}
            </Text>
            <Text className="price">{Math.round(minPrice)} Đ</Text>
          </Box>
          <Button className="buy-ticket-button">
            {t('eventDetailPage.buyTicket')}
          </Button>
        </Box>
      </Box>
      <Box className="event-image-container">
        <Image
          src={eventBannerUrl}
          alt="Event banner"
          className="event-image"
        />
      </Box>
    </Box>
  );

  const mobileAndTabletLayout = (
    <Box className="hero-section-wrapper">
      <Box className="event-content">
        <div id="circle1" className="circle"></div>
        <div id="circle2" className="circle"></div>
        <Stack className="event-info">
          <Title className="event-title">{eventName}</Title>
          <Group className="event-date">
            <IconCalendar size={20} stroke={1.5} />
            <Text>{formattedStartTime}</Text>
          </Group>
          <Box>
            <Group className="venue-info">
              <IconMapPin size={20} stroke={1.5} />
              <Text className="venue-name">{venueName}</Text>
            </Group>
            <Text className="address">{formattedAddress}</Text>
          </Box>
        </Stack>
        <Box className="price-section">
          <Box className="price-info">
            <Text className="price-label">
              {t('eventDetailPage.priceFrom')}
            </Text>
            <Text className="price">{minPrice} Đ</Text>
          </Box>
          <Button className="buy-ticket-button">
            {t('eventDetailPage.buyTicket')}
          </Button>
        </Box>
      </Box>
      <Box className="event-image-container">
        <Image
          src={eventBannerUrl}
          alt="Event banner"
          className="event-image"
        />
      </Box>
    </Box>
  );

  return <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>;
};
