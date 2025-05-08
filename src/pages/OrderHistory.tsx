import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import OrderTabs from '@/components/order-history/OrderTabs/OrderTabs';
import OrderInfo from '@/components/order-history/OrderInfo/OrderInfo';
import NoOrders from '@/components/order-history/NoOrders/NoOrders';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { useTranslation } from 'react-i18next';
import { IdParam } from '@/types/types';
import { useGetEventOrders } from '@/queries/useGetOrders';

const Container = styled.div`
  background: #18181b;
  color: white;
  padding: 20px;
  min-height: 100vh;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const OrderCard = styled.div`
  margin-bottom: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`;

// Simulate userId (should be dynamically fetched from auth context)
const userId: IdParam = 'U123';

const OrderHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [subTab, setSubTab] = useState('ended');

  // Map UI tabs to API query parameters
  const statusMap: Record<string, string> = {
    all: 'ALL',
    success: 'PAID',
    processing: 'PENDING',
    canceled: 'CANCELLED  ',
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

  return (
    <Container>
      <Title>{t('orderHistory.title')}</Title>

      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subTab={subTab}
        setSubTab={setSubTab}
      />

      {isLoading && <LoadingText>{t('orderHistory.loading')}</LoadingText>}
      {isError && <ErrorText>{t('orderHistory.error')}</ErrorText>}

      {!isLoading && !isError && orders && orders.length > 0
        ? orders.map((order) => (
            <OrderCard
              key={order.id}
              onClick={() => navigate(`/orders/${order.publicId}`)}
            >
              <OrderInfo
                date={new Date(order.createdAt).toLocaleDateString()}
                title={order.event.eventName}
                status={order.orderStatus}
                OrderType="STRIPE"
                time={`${new Date(
                  order.show.startTime,
                ).toLocaleTimeString()} - ${new Date(
                  order.show.endTime,
                ).toLocaleTimeString()}`}
                location={order.event.venueName}
                imageUrl={order.event.eventBannerUrl}
              />
            </OrderCard>
          ))
        : !isLoading && !isError && <NoOrders />}

      <Title>{t('orderHistory.recommended')}</Title>

      {/* Integrate event api later */}
      <EventGrid events={[]} />
    </Container>
  );
};

export default OrderHistory;
