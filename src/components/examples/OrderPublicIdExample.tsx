import React from 'react';
import { Card, Spin, Typography, Button, Space } from 'antd';
import { useGetOrderByInternalId } from '@/queries/useGetOrders';

const { Title, Text } = Typography;

interface OrderPublicIdExampleProps {
  orderId: number;
}

/**
 * Example component demonstrating how to use the getOrderByInternalId endpoint
 * to retrieve order information including the publicId from an internal orderId
 */
const OrderPublicIdExample: React.FC<OrderPublicIdExampleProps> = ({ orderId }) => {
  const { data: order, isLoading, isError, error, refetch } = useGetOrderByInternalId(orderId);

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading order information...</div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Title level={4} type="danger">
            Failed to load order
          </Title>
          <Text type="secondary">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Order not found</Title>
          <Text type="secondary">No order found with ID: {orderId}</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Order Information">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>Internal Order ID: </Text>
          <Text>{order.id}</Text>
        </div>
        <div>
          <Text strong>Public Order ID: </Text>
          <Text code>{order.publicId}</Text>
        </div>
        <div>
          <Text strong>Short ID: </Text>
          <Text>{order.shortId}</Text>
        </div>
        <div>
          <Text strong>Status: </Text>
          <Text>{order.status}</Text>
        </div>
        <div>
          <Text strong>Customer Email: </Text>
          <Text>{order.email}</Text>
        </div>
        <div>
          <Text strong>Total Amount: </Text>
          <Text>${order.totalAmount.toFixed(2)}</Text>
        </div>
        <div>
          <Text strong>Event: </Text>
          <Text>{order.event?.title || 'N/A'}</Text>
        </div>
      </Space>
    </Card>
  );
};

export default OrderPublicIdExample;