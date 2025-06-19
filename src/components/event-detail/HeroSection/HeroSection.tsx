import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { EventDetailResponse } from '@/domain/EventModel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { ShowModel } from '@/domain/ShowModel';
import { TicketTypeModel } from '@/domain/TicketTypeModel';
import {
  Box,
  Title,
  Text,
  Group,
  Stack,
  Paper,
  Button,
  Container,
  rem,
} from '@mantine/core';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import { createStyles } from '@mantine/styles';
import { useNavigate } from 'react-router-dom';

// Define styles for the ticket component with Mantine
const useStyles = createStyles((theme: any) => ({
  wrapper: {
    display: 'flex',
    position: 'relative',
    padding: `0 ${rem(128)}`,
    width: '100%',
    maxHeight: rem(500),
    overflow: 'hidden',
    fontFamily: '"Montserrat", sans-serif',
    background: 'linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%)',
    '@media (max-width: 1199px)': {
      padding: `0 ${rem(24)}`,
    },
  },
  eventContent: {
    background: 'linear-gradient(145deg, #1a1b1e 0%, #25262b 100%)',
    padding: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '30px',
    flex: 1,
    overflow: 'visible',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: '1rem !important',
    borderBottomLeftRadius: '1rem !important',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      opacity: 0.5,
      borderRadius: theme.radius.lg,
      pointerEvents: 'none',
    },
  },
  eventInfo: {
    color: theme.white,
  },
  eventTitle: {
    fontSize: rem(32),
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: theme.spacing.md,
    color: theme.white,
    letterSpacing: '-0.02em',
    position: 'relative',
    paddingBottom: rem(16),
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: rem(60),
      height: rem(4),
      background: 'linear-gradient(90deg, #FFD700, rgba(255, 215, 0, 0.3))',
      borderRadius: theme.radius.sm,
    },
  },
  eventDate: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    color: theme.white,
    fontSize: rem(20),
    fontWeight: 600,
    background: 'rgba(255, 215, 0, 0.12)',
    padding: `${rem(10)} ${rem(14)}`,
    borderRadius: theme.radius.md,
    width: 'fit-content',
    border: '1px solid rgba(255, 215, 0, 0.2)',
  },
  venueInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: rem(4),
  },
  venueName: {
    fontWeight: 600,
    color: theme.white,
    fontSize: rem(18),
  },
  address: {
    fontWeight: 400,
    lineHeight: 1.4,
    marginLeft: theme.spacing.lg,
    color: theme.colors.gray[2],
    fontSize: rem(17),
    fontStyle: 'italic',
  },
  priceSection: {
    marginTop: '1rem',
    paddingTop: theme.spacing.lg,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background:
        'linear-gradient(to right, rgba(255, 215, 0, 0.5), rgba(255, 215, 0, 0.1) 70%, transparent)',
    },
  },
  priceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: rem(7),
    marginBottom: theme.spacing.md,
  },
  priceLabel: {
    fontSize: '1.2rem !important',
    color: theme.white,
    fontWeight: 900,
  },
  price: {
    fontSize: '1.5rem !important',
    color: 'var(--primary-color) !important',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  buyButton: {
    width: '100%',
    background:
      'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%) !important',
    color: 'black !important',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: rem(18),
    padding: `${rem(12)} 0`,
    border: 'none',
    borderRadius: '0.5rem !important',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: -100,
      width: rem(60),
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
      transform: 'skewX(-15deg)',
      animation: 'shimmer 3s infinite',
    },
    '@keyframes shimmer': {
      '0%': { left: '-100%' },
      '100%': { left: '200%' },
    },
  },
  imageWrapper: {
    flex: 2,
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(rgb(39, 39, 42) 48.04%, rgb(0, 0, 0) 100%)',
    '@media (max-width: 1199px)': {
      width: '100%',
      flex: 'none',
      height: rem(300),
    },
  },
  eventImage: {
    minHeight: '100%',
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    borderLeft: '3px dashed rgba(255, 215, 0, 0.6)',
    borderTopRightRadius: theme.radius.lg,
    borderBottomRightRadius: theme.radius.lg,
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.2)',
    '@media (max-width: 1199px)': {
      borderLeft: 'none',
      borderTop: 'none',
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
    },
  },
  circle: {
    position: 'absolute',
    width: rem(60),
    height: rem(60),
    borderRadius: '50%',
    zIndex: 11,
    boxSizing: 'border-box',
    boxShadow:
      'inset 0 0 10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 215, 0, 0.2)',
    '@media (max-width: 1199px)': {
      display: 'none',
    },
  },
  topCircle: {
    top: 0,
    right: 0,
    transform: 'translate(30px, -30px)',
    backgroundColor: '#333129',
  },
  bottomCircle: {
    bottom: 0,
    right: 0,
    transform: 'translate(30px, 30px)',
    backgroundColor: '#060607',
  },
}));

interface HeroSectionProps {
  event: EventDetailResponse;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  const { t, i18n } = useTranslation();
  const { isDesktop, useMediaQuery } = useResponsive();
  const { classes } = useStyles();
  const navigate = useNavigate();

  // Use same 1200px breakpoint as EventDetailPage for consistency
  const isLargeDesktop = useMediaQuery({ query: '(min-width: 1200px)' });

  const { startTime, eventName, venueName, address, eventBannerUrl, shows } =
    event;

  let formattedAddress;
  if (i18n.language === 'vi') {
    formattedAddress = address.addressVi;
  } else {
    formattedAddress = address.addressEn;
  }

  const formattedStartTime = dayjs(startTime)
    .locale(i18n.language)
    .format('dddd, MMMM D, YYYY HH:mm');

  // Get the minimum price of all ticket types
  const minPrice = event.shows?.reduce(
    (min: number, show: ShowModel) =>
      show.ticketTypes.reduce(
        (min: number, ticketType: TicketTypeModel) =>
          ticketType.price < min ? ticketType.price : min,
        min,
      ),
    0,
  );

  const handleBuyTicketClick = () => {
    if (shows && shows.length === 1) {
      // Single show: navigate directly to ticket selection
      navigate(`/events/${event.id}/bookings/${shows[0].id}/select-ticket`);
    } else {
      // Multiple shows: scroll to tickets section
      const ticketsSection = document.getElementById('tickets-section');
      if (ticketsSection) {
        ticketsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  const ticketLayout = (
    <Box className={classes.wrapper}>
      <Paper className={classes.eventContent}>
        {/* Circle cutouts for the ticket effect */}
        <Box className={`${classes.circle} ${classes.topCircle}`} />
        <Box className={`${classes.circle} ${classes.bottomCircle}`} />

        <Box className={classes.eventInfo}>
          <Title order={1} className={classes.eventTitle}>
            {eventName}
          </Title>
          <Group className={classes.eventDate}>
            <IconCalendar size={22} color="#FFD700" />
            <Text>{formattedStartTime}</Text>
          </Group>
          <Group className={classes.venueInfo}>
            <IconMapPin size={22} color="#FFD700" />
            <Text className={classes.venueName}>{venueName}</Text>
          </Group>
          <Text className={classes.address}>{formattedAddress}</Text>
        </Box>

        <Box className={classes.priceSection}>
          <Group className={classes.priceInfo}>
            <Text className={classes.priceLabel} fw={500}>
              {t('eventDetailPage.priceFrom')}
            </Text>
            <Text
              component="span"
              className={classes.price}
              fw={900}
              style={{ fontWeight: 900 }}
            >
              {new Intl.NumberFormat('vi-VN').format(minPrice || 0)}₫
            </Text>
          </Group>
          <Button
            className={classes.buyButton}
            size="md"
            onClick={handleBuyTicketClick}
          >
            {t('eventDetailPage.buyTicket')}
          </Button>
        </Box>
      </Paper>

      <Box className={classes.imageWrapper}>
        <img
          src={eventBannerUrl}
          alt="Event banner"
          className={classes.eventImage}
        />
      </Box>
    </Box>
  );

  const mobileTicketLayout = (
    <Container size="sm" px="xs">
      <Stack gap="md">
        <Box className={classes.imageWrapper}>
          <img
            src={eventBannerUrl}
            alt="Event banner"
            className={classes.eventImage}
          />
        </Box>

        <Paper className={classes.eventContent}>
          {/* Circle cutouts for the ticket effect */}
          <Box className={`${classes.circle} ${classes.topCircle}`} />
          <Box className={`${classes.circle} ${classes.bottomCircle}`} />

          <Box className={classes.eventInfo}>
            <Title order={1} className={classes.eventTitle}>
              {eventName}
            </Title>
            <Group className={classes.eventDate}>
              <IconCalendar size={24} color="#FFD700" />
              <Text>{formattedStartTime}</Text>
            </Group>
            <Group className={classes.venueInfo}>
              <IconMapPin size={24} color="#FFD700" />
              <Text className={classes.venueName}>{venueName}</Text>
            </Group>
            <Text className={classes.address}>{formattedAddress}</Text>
          </Box>

          <Box className={classes.priceSection}>
            <Group className={classes.priceInfo}>
              <Text className={classes.priceLabel}>
                {t('eventDetailPage.priceFrom')}
              </Text>
              <Text
                component="span"
                className={classes.price}
                fw={900}
                style={{ fontWeight: 900 }}
              >
                {new Intl.NumberFormat('vi-VN').format(minPrice || 0)}₫
              </Text>
            </Group>
            <Button
              className={classes.buyButton}
              size="md"
              onClick={handleBuyTicketClick}
            >
              {t('eventDetailPage.buyTicket')}
            </Button>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );

  return <>{isLargeDesktop ? ticketLayout : mobileTicketLayout}</>;
};
