import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Result, Spin, Button, Typography, Space } from 'antd';
import { IeOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutSuccessContent: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      setStatus('error');
      setError('Payment verification failed. Please contact support.');
      return;
    }

    // Verify payment status from URL parameters
    const paymentIntentStatus = searchParams.get('redirect_status');

    switch (paymentIntentStatus) {
      case 'succeeded':
        setStatus('success');
        break;
      case 'processing':
        setStatus('loading');
        break;
      case 'requires_payment_method':
        setStatus('error');
        setError('Payment failed. Please try another payment method.');
        break;
      default:
        setStatus('error');
        setError(`Unexpected payment status: ${paymentIntentStatus}`);
        break;
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <Result
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

  if (status === 'error') {
    return (
      <Result
        status="error"
        title="Payment Failed"
        subTitle={error || 'An unexpected error occurred'}
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

  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle={
        <Space direction="vertical" align="center" size="large">
          <Text>
            Thank you for your purchase! Your order #{orderId} has been
            confirmed.
          </Text>
          <Text type="secondary">
            Your e-tickets are now available in the My Tickets section. You can
            download and view them at any time.
          </Text>
        </Space>
      }
      extra={[
        <Button
          key="tickets"
          type="primary"
          icon={<IeOutlined />}
          size="large"
          onClick={() => navigate('/order-history')}
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
