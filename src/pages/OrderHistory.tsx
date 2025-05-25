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
                    url={`${order.event.setting.url}-${order.eventId}/${order.show.id}`}
                  />
                </Paper>
              ))
            : !isLoading && !isError && <NoOrders />}
        </Stack>

        <Divider className="section-divider" />

        <>
          <Title
            style={{ color: 'white !important' }}
            order={2}
            className="page-title"
          >
            {t('orderHistory.recommended')}
          </Title>
          <Box className="recommended-events">
            <EventGrid events={relatedEvents} userId={userId} />
          </Box>
        </>
      </Box>
    </Container>
  );
};

export default OrderHistory;
