import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Result, Spin, Button, Typography, Space } from 'antd';
import { IeOutlined, LoadingOutlined } from '@ant-design/icons';
import { IconShoppingCartCheck, IconGift } from '@tabler/icons-react';

const { Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface OrderType {
  type: 'free' | 'paid';
  status: 'loading' | 'success' | 'error';
  error?: string;
}

const CheckoutSuccessContent: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<OrderType>({
    type: 'paid',
    status: 'loading',
  });

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntentStatus = searchParams.get('redirect_status');
    const isFreeOrder = searchParams.get('free') === 'true';

    // Check if this is a free order
    if (isFreeOrder || (!clientSecret && !paymentIntentStatus)) {
      setOrderInfo({
        type: 'free',
        status: 'success',
      });
      return;
    }

    // Handle Stripe payment verification
    if (!clientSecret) {
      setOrderInfo({
        type: 'paid',
        status: 'error',
        error: 'Payment verification failed. Please contact support.',
      });
      return;
    }

    // Verify payment status from URL parameters
    switch (paymentIntentStatus) {
      case 'succeeded':
        setOrderInfo({
          type: 'paid',
          status: 'success',
        });
        break;
      case 'processing':
        setOrderInfo({
          type: 'paid',
          status: 'loading',
        });
        break;
      case 'requires_payment_method':
        setOrderInfo({
          type: 'paid',
          status: 'error',
          error: 'Payment failed. Please try another payment method.',
        });
        break;
      default:
        setOrderInfo({
          type: 'paid',
          status: 'error',
          error: `Unexpected payment status: ${paymentIntentStatus}`,
        });
        break;
    }
  }, [searchParams]);

  if (orderInfo.status === 'loading') {
    return (
      <Result
        style={{
          color: '#fff',
        }}
        icon={<LoadingOutlined />}
        title="Processing Your Payment"
        subTitle="Please wait while we confirm your payment..."
        extra={
          <Space direction="vertical" align="center">
            <Spin size="large" />
            <Text type="secondary">This may take a few moments</Text>
          </Space>
        }
      />
    );
  }

  if (orderInfo.status === 'error') {
    return (
      <Result
        style={{
          color: '#fff',
        }}
        status="error"
        title="Order Processing Failed"
        subTitle={orderInfo.error || 'An unexpected error occurred'}
        extra={[
          <Button
            key="retry"
            type="primary"
            onClick={() => navigate(`/checkout/${orderId}`)}
          >
            Try Again
          </Button>,
        ]}
      />
    );
  }

  // Success state - different messages for free vs paid orders
  const isFreeOrder = orderInfo.type === 'free';

  return (
    <Result
      style={{
        color: 'white !important',
      }}
      status="success"
      title={
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}>
          {isFreeOrder ? 'Registration Confirmed!' : 'Payment Successful!'}
        </Text>
      }
      subTitle={
        <Space direction="vertical" align="center" size="large">
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            {isFreeOrder
              ? `Thank you for registering! Your free tickets for order #${orderId} have been confirmed.`
              : `Thank you for your purchase! Your order #${orderId} has been confirmed.`}
          </Text>
          <Text
            style={{
              color: 'white',
            }}
            type="secondary"
          >
            Your e-tickets are now available in the My Tickets section. You can
            download and view them at any time.
          </Text>
          {isFreeOrder && (
            <Text
              style={{
                color: '#52c41a',
                fontWeight: 'bold',
              }}
            >
              🎉 This event was free - no payment required!
            </Text>
          )}
        </Space>
      }
      extra={[
        <Button
          key="tickets"
          type="primary"
          icon={isFreeOrder ? <IconGift /> : <IconShoppingCartCheck />}
          size="large"
          onClick={() => navigate('/tickets')}
        >
          View My Orders
        </Button>,
      ]}
    />
  );
};

const CheckoutSuccessPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutSuccessContent />
    </Elements>
  );
};

export default CheckoutSuccessPage;
