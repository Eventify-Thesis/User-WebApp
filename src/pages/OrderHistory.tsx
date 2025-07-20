import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTabs from '@/components/order-history/OrderTabs/OrderTabs';
import OrderInfo from '@/components/order-history/OrderInfo/OrderInfo';
import NoOrders from '@/components/order-history/NoOrders/NoOrders';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import { useGetEventOrders } from '@/queries/useGetOrders';
import {
  Container,
  Title,
  Box,
  Paper,
  Text,
  Loader,
  Stack,
  Divider,
  Group,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { IconStar, IconTrendingUp, IconSparkles } from '@tabler/icons-react';
import './OrderHistory.css';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useAuth } from '@clerk/clerk-react';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import { Loading } from '@/components/common/Loading/Loading';

const OrderHistory = () => {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [subTab, setSubTab] = useState('ended');

  // Map UI tabs to API query parameters
  const statusMap: Record<string, string> = {
    all: 'ALL',
    success: 'PAID',
    processing: 'PENDING',
    canceled: 'CANCELLED',
  };

  const timeframeMap: Record<string, 'UPCOMING' | 'PAST'> = {
    upcoming: 'UPCOMING',
    ended: 'PAST',
  };

  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError,
  } = useGetEventOrders(
    statusMap[activeTab] || '',
    timeframeMap[subTab] || 'PAST',
  );

  const orders = orderData?.docs;
  const firstOrderEventId = orders?.[0]?.eventId;

  // Always call both hooks, but use the appropriate one based on conditions
  const { data: relatedEventsData, isLoading: isRelatedLoading } =
    useRelatedEvents(firstOrderEventId || '', DEFAULT_LIMIT, userId || '');

  const { data: semanticEventsData, isLoading: isSemanticLoading } =
    useSearchSemanticEvents({
      limit: DEFAULT_LIMIT,
      userId: userId || '',
      query: '',
    });

  // Determine which data to use
  const recommendedEvents = firstOrderEventId
    ? relatedEventsData
    : semanticEventsData;
  const recommendedEventsLoading = firstOrderEventId
    ? isRelatedLoading
    : isSemanticLoading;

  // Normalize and map for EventGrid
  const relatedEvents = (() => {
    const eventsArr = Array.isArray(recommendedEvents) ? recommendedEvents : [];
    return eventsArr.map((event: any) => ({
      ...event,
      eventLogoUrl: event.eventLogoUrl,
      minimumPrice: event.minimumPrice,
      startTime: event.startTime ? new Date(event.startTime * 1000) : undefined,
      isInterested: event.isInterested ?? false,
    }));
  })();

  const isLoading = isOrderLoading || recommendedEventsLoading;

  if (isLoading) return <Loading />;

  return (
    <Container fluid className="order-history-container">
      <Box className="order-content">
        {/* Enhanced Header Section */}
        <Box className="page-header" mb="xl">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Title order={1} className="page-title">
                {t('orderHistory.title')}
              </Title>
              <Text c="dimmed" size="lg" mt="sm">
                {t('orderHistory.description')}
              </Text>
            </Box>

            <Group gap="xs">
              <Badge
                variant="light"
                color="yellow"
                size="lg"
                radius="xl"
                leftSection={<IconStar size={16} />}
              >
                {t('orderHistory.ordersCount', { count: orders?.length || 0 })}
              </Badge>
            </Group>
          </Group>
        </Box>

        {/* Modern Tabs Container */}
        <Paper shadow="md" className="order-tabs-container">
          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            subTab={subTab}
            setSubTab={setSubTab}
          />
        </Paper>

        {/* Error State */}
        {isError && (
          <Paper className="error-message" shadow="sm">
            <Text size="md" fw={500}>
              {t('orderHistory.error')}
            </Text>
          </Paper>
        )}

        {/* Orders List */}
        <Stack className="orders-list">
          {!isLoading && !isError && orders && orders.length > 0
            ? orders.map((order, index) => (
                <Paper
                  key={order.id}
                  className="order-card"
                  shadow="sm"
                  p={0}
                  withBorder={false}
                  onClick={() => navigate(`/orders/${order.publicId}`)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <OrderInfo
                    date={new Date(order.createdAt).toLocaleDateString()}
                    title={order.event.eventName}
                    status={order.status}
                    OrderType="STRIPE"
                    startTime={order.show.startTime}
                    endTime={order.show.endTime}
                    location={order.event.venueName}
                    imageUrl={order.event.eventBannerUrl}
                    url={`${order.event.setting.url}-${order.eventId}/${order.show.id}`}
                  />
                </Paper>
              ))
            : !isLoading && !isError && <NoOrders />}
        </Stack>

        {/* Enhanced Divider */}
        <Divider className="section-divider" />

        {/* Recommended Events Section */}
        <Box className="recommended-section">
          <Group justify="space-between" align="center" mb="xl">
            <Box>
              <Group gap="md" align="center">
                <ActionIcon
                  variant="filled"
                  color="yellow"
                  size="xl"
                  radius="xl"
                >
                  <IconSparkles size={20} />
                </ActionIcon>
                <Box>
                  <Title order={2} className="section-title">
                    {t('orderHistory.recommended')}
                  </Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    {t('orderHistory.recommendedDescription')}
                  </Text>
                </Box>
              </Group>
            </Box>

            <Badge
              variant="light"
              color="blue"
              size="md"
              radius="xl"
              leftSection={<IconTrendingUp size={14} />}
            >
              {t('orderHistory.trending')}
            </Badge>
          </Group>

          <Box className="recommended-events">
            <EventGrid events={relatedEvents} userId={userId} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderHistory;
