import React from 'react';
import { formatDate } from '@/utils/dates';
import {
  Box,
  Text,
  Badge,
  Group,
  Flex,
  Card,
  Image,
  ActionIcon,
} from '@mantine/core';
import {
  IconCheck,
  IconCalendar,
  IconMapPin,
  IconTicket,
  IconClock,
  IconArrowRight,
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

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'success':
        return {
          color: '#10b981',
          label: 'Completed',
          icon: <IconCheck size={12} />,
        };
      case 'pending':
      case 'processing':
        return {
          color: '#f59e0b',
          label: 'Processing',
          icon: <IconClock size={12} />,
        };
      case 'cancelled':
      case 'canceled':
        return {
          color: '#ef4444',
          label: 'Cancelled',
          icon: <IconTicket size={12} />,
        };
      default:
        return {
          color: '#6b7280',
          label: status || 'Unknown',
          icon: <IconTicket size={12} />,
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card className="compact-order-card" onClick={onClick} radius="lg" p={0}>
      {/* Status Badge - positioned at top right of entire card */}
      <Badge
        className="compact-status-badge"
        variant="filled"
        size="sm"
        radius="md"
        style={{
          backgroundColor: statusConfig.color,
          color: 'white',
        }}
        leftSection={statusConfig.icon}
      >
        {statusConfig.label}
      </Badge>

      <Flex gap={0} align="stretch">
        {/* Image Section */}
        <Box className="order-image-container">
          <Image
            src={
              imageUrl ||
              'https://placehold.co/160x130/1a1a1a/666?text=No+Image'
            }
            height="100%"
            width="100%"
            fit="cover"
            alt={title}
            className="order-image"
          />
        </Box>

        {/* Content Section */}
        <Box className="order-content" flex={1} p="md">
          <Flex direction="column" justify="space-between" h="100%">
            {/* Header */}
            <Box>
              <Text
                className="compact-order-title"
                size="lg"
                fw={600}
                c="white"
                lineClamp={2}
                mb="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/purchased/${url}`);
                }}
              >
                {title}
              </Text>

              <Group gap="xs" mb="sm">
                <Badge variant="light" size="xs" radius="sm" color="yellow">
                  {OrderType}
                </Badge>
              </Group>
            </Box>

            {/* Event Details */}
            <Box>
              <Group gap="md" mb="sm">
                <Group gap="xs" style={{ flex: 1 }}>
                  <IconCalendar size={16} color="#facc15" />
                  <Text size="sm" c="dimmed" fw={500}>
                    {dateRange}
                  </Text>
                </Group>
              </Group>

              <Group gap="md" justify="space-between" mb="sm">
                <Group gap="xs" style={{ flex: 1 }}>
                  <IconMapPin size={16} color="#10b981" />
                  <Text size="sm" c="dimmed" fw={500} lineClamp={1}>
                    {location && location.length > 0
                      ? location
                      : 'Online Event'}
                  </Text>
                </Group>

                <ActionIcon
                  variant="subtle"
                  color="yellow"
                  size="md"
                  radius="md"
                >
                  <IconArrowRight size={14} />
                </ActionIcon>
              </Group>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export default OrderInfo;
