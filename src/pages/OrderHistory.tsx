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
} from '@mantine/core';
import './OrderHistory.css';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useAuth } from '@clerk/clerk-react';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';

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
    isLoading,
    isError,
  } = useGetEventOrders(
    statusMap[activeTab] || '',
    timeframeMap[subTab] || 'PAST',
  );

  const orders = orderData?.docs;

  // Recommended events logic
  const { data: recommendedEvents, isLoading: recommendedEventsLoading } = orders?.[0]?.eventId
    ? useRelatedEvents(
        orders[0].eventId,
        DEFAULT_LIMIT,
        userId || ''
      )
    : useSearchSemanticEvents({
        limit: DEFAULT_LIMIT,
        userId: userId || '',
        query: '',
      });

  // Normalize and map for EventGrid
  const relatedEvents = (() => {
    const eventsArr = Array.isArray(recommendedEvents)
      ? recommendedEvents
      : [];
    return eventsArr.map((event: any) => ({
    ...event,
    eventLogoUrl: event.eventLogoUrl ?? event.event_logo_url,
    minimumPrice: event.minimumPrice ?? event.lowest_price,
    startTime: event.startTime
      ? new Date(event.startTime)
      : event.soonest_start_time
      ? new Date(event.soonest_start_time * 1000)
      : undefined,
    isInterested: event.isInterested ?? event.bookmarked,
  }));
  })();
  return (
    <Container fluid className="order-history-container">
      <Box className="order-content">
        <Title order={1} className="page-title">
          {t('orderHistory.title')}
        </Title>

        <Paper shadow="md" className="order-tabs-container">
          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            subTab={subTab}
            setSubTab={setSubTab}
          />
        </Paper>

        {isLoading && (
          <Box className="loading-container">
            <Loader color="yellow" size="lg" variant="dots" />
            <Text c="dimmed" mt="lg" size="md" fw={500}>
              {t('orderHistory.loading')}
            </Text>
          </Box>
        )}

        {isError && (
          <Paper className="error-message" shadow="sm">
            <Text size="md" fw={500}>
              {t('orderHistory.error')}
            </Text>
          </Paper>
        )}

        <Stack className="orders-list">
          {!isLoading && !isError && orders && orders.length > 0
            ? orders.map((order) => (
                <Paper
                  key={order.id}
                  className="order-card"
                  shadow="sm"
                  p="md"
                  withBorder
                  onClick={() => navigate(`/orders/${order.publicId}`)}
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
                  />
                </Paper>
              ))
            : !isLoading && !isError && <NoOrders />}
        </Stack>

        <Divider className="section-divider" />

        {recommendedEventsLoading ? (
          <Loader color="yellow" size="lg" variant="dots" />
        ) : (
          <>
            <Title style={{ color: 'white' }} order={2} className="section-title">
              {t('orderHistory.recommended')}
            </Title>
            <Box className="recommended-events">
              <EventGrid events={relatedEvents} userId={userId} />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default OrderHistory;
