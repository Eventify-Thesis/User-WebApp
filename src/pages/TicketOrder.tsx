import React from 'react';
import TicketSection from '../components/ticket-order/TicketSection/TicketSection';
import OrderSection from '../components/ticket-order/OrderSection/OrderSection';
import { useParams } from 'react-router-dom';
import { useGetOrderDetail } from '@/queries/useGetOrders';
import {
  Container,
  Title,
  Text,
  LoadingOverlay,
  Alert,
  Box,
  Card,
  Image,
  Grid,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const TicketOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // Fetch order details
  const {
    data: orderData,
    isLoading,
    isError,
  } = useGetOrderDetail(orderId || '');

  if (isLoading) return <LoadingOverlay visible={true} />;
  if (isError || !orderData) {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          Error fetching order details
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg="dark.8" style={{ minHeight: '100vh' }}>
      <Container size="lg" py="xl">
        <Card
          shadow="sm"
          padding="lg"
          radius="lg"
          withBorder
          style={{
            background: '#ffffff',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '800px',
          }}
        >
          <Card.Section>
            <Box
              style={{
                position: 'relative',
                height: 250,
                overflow: 'hidden',
              }}
            >
              <Image
                src={orderData.event.eventBannerUrl}
                height={250}
                style={{ objectFit: 'cover' }}
                alt={orderData.event.eventName}
              />
              <Box
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '20px',
                }}
              >
                <Title order={2} c="white">
                  {orderData.event.eventName}
                </Title>
                <Text size="sm" c="dimmed">
                  Order ID: {orderData.publicId}
                </Text>
              </Box>
            </Box>
          </Card.Section>

          <Grid mt="xl" p="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Box pr={{ base: 0, md: 'xl' }}>
                <TicketSection order={orderData} />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box
                style={{
                  borderLeft: '1px solid #e9ecef',
                  height: '100%',
                  paddingLeft: 'var(--mantine-spacing-xl)',
                }}
              >
                <OrderSection order={orderData} />
              </Box>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default TicketOrder;
