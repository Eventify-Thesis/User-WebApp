import React from 'react';
import { formatDate } from '@/utils/dates';
import {
  Box,
  Text,
  Badge,
  Group,
  Flex,
  Stack,
  Card,
  Image,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import {
  IconCheck,
  IconCalendar,
  IconMapPin,
  IconTicket,
} from '@tabler/icons-react';
import './OrderInfo.css';
import { useNavigate } from 'react-router-dom';

interface OrderInfoProps {
  date: string;
  title: string;
  status: string;
  OrderType: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  url: string;
  onClick?: () => void;
}

// @ts-ignore
// Create styles for the OrderInfo component
const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'hidden',
    maxHeight: '250px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
      '& .card-image': {
        transform: 'scale(1.05)',
      },
    },
    borderRadius: theme.radius.lg,
    border: 'none',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  cardImage: {
    transition: 'transform 0.5s ease',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    background:
      'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.85) 100%)',
  },
  infoContainer: {
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    marginBottom: theme.spacing.xs,
    display: 'inline-block',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'scale(1.03)',
    },
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateContainer: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FF427F 0%, #FF4FD8 100%)',
    boxShadow: '0 6px 15px rgba(255, 66, 127, 0.3)',
    minWidth: 65,
    border: '2px solid rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontWeight: '600 !important',
    fontSize: '1.5rem !important',
    lineHeight: 1.2,
    background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    letterSpacing: '-0.5px',
  },
  badge: {
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.5px',
    fontSize: '0.75rem',
    padding: '8px 12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  statusBadge: {
    background: 'linear-gradient(135deg, #00C9FF 0%, #18E74A 100%)',
  },
  typeBadge: {
    background: 'linear-gradient(135deg, #FF7170 0%, #FFE57F 100%)',
  },
  iconGlow: {
    filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))',
  },
}));

const OrderInfo: React.FC<OrderInfoProps> = ({
  date,
  title,
  status,
  OrderType,
  startTime,
  endTime,
  location,
  imageUrl,
  url,
  onClick,
}) => {
  const navigate = useNavigate();
  const { classes } = useStyles();

  // Format dates for display
  const startDateFormatted = formatDate(
    startTime,
    'MMM D, YYYY',
    'Asia/Bangkok',
  );
  const endDateFormatted = formatDate(endTime, 'MMM D, YYYY', 'Asia/Bangkok');
  const dateRange =
    startDateFormatted === endDateFormatted
      ? startDateFormatted
      : `${startDateFormatted} - ${endDateFormatted}`;

  // No longer need getStatusColor as we use gradient backgrounds

  // Parse date parts
  const dateParts = date.split('/');

  return (
    <Card className={classes.card} p={0} onClick={onClick} shadow="xl" h={300}>
      {/* Full-size image background */}
      <Box className={classes.imageContainer}>
        <Image
          className={classes.cardImage}
          src={imageUrl || 'https://placehold.co/600x400/222/ccc?text=No+Image'}
          height="100%"
          fit="cover"
          alt={title}
        />
      </Box>

      {/* Content overlaid on the image */}
      <Box className={classes.content} p="xl">
        <Flex direction="column" justify="space-between" h="100%">
          {/* Top area with just the date badge */}
          <Box>
            {/* Date badge in the top right */}
            <Box className={classes.dateContainer}>
              <Text fw={800} size="xl" c="white" lh={1} ta="center">
                {dateParts[0]}
              </Text>
              <Text fw={600} size="xs" c="white" opacity={0.8} ta="center">
                {dateParts[1]}
              </Text>
            </Box>
          </Box>

          {/* Bottom area with all other content */}
          <Box>
            {/* Title */}
            <Box mb="md">
              <Text
                className={classes.title}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/purchased/${url}`);
                }}
              >
                {title}
              </Text>
            </Box>

            {/* Status badges */}
            <Group gap="xs" mb="lg">
              <Badge
                className={`${classes.badge} ${classes.statusBadge}`}
                leftSection={
                  <IconCheck
                    size={14}
                    className={classes.iconGlow}
                    style={{ stroke: 'white', strokeWidth: 3 }}
                  />
                }
                variant="gradient"
                radius="xl"
                size="lg"
              >
                {status?.toUpperCase() ?? 'Pending'}
              </Badge>
              <Badge
                className={`${classes.badge} ${classes.typeBadge}`}
                leftSection={
                  <IconTicket
                    size={14}
                    className={classes.iconGlow}
                    style={{ stroke: 'white', strokeWidth: 3 }}
                  />
                }
                variant="gradient"
                radius="xl"
                size="lg"
              >
                {OrderType.toUpperCase()}
              </Badge>
            </Group>

            {/* Event details */}
            <Stack gap="sm">
              <Box className={classes.infoContainer}>
                <Box className={classes.infoItem}>
                  <IconCalendar
                    size={18}
                    color="white"
                    className={classes.iconGlow}
                    style={{ stroke: 'white', strokeWidth: 2.5 }}
                  />
                  <Text
                    size="sm"
                    style={{ fontWeight: 'bold', maxWidth: 'fit-content' }}
                    c="white"
                  >
                    {dateRange}
                  </Text>
                </Box>
              </Box>

              <Box className={classes.infoContainer}>
                <Box className={classes.infoItem}>
                  <IconMapPin
                    size={18}
                    color="white"
                    className={classes.iconGlow}
                    style={{ stroke: 'white', strokeWidth: 2.5 }}
                  />
                  <Text
                    size="sm"
                    style={{ fontWeight: 'bold', maxWidth: 'fit-content' }}
                    c="white"
                  >
                    {location && location.length > 0 ? location : 'Online'}
                  </Text>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Flex>
      </Box>
    </Card>
  );
};

export default OrderInfo;
