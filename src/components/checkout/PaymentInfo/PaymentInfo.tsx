// PaymentInfo.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import {
  Spin,
  notification,
  Button,
  Result,
  Card,
  Typography,
  Modal,
  Input,
  Space,
  Alert,
} from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import { TicketInfo } from '../TicketInfo/TicketInfo';

const { Title, Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

interface PaymentInfoProps {
  orderId: number;
}

const VoucherModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
  loading: boolean;
}> = ({ open, onClose, onApply, loading }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    onApply(code);
    setCode('');
  };

  return (
    <Modal
      title="Apply Voucher"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          loading={loading}
          disabled={!code.trim()}
        >
          Apply
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Enter voucher code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={handleApply}
        />
      </Space>
    </Modal>
  );
};

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ orderId }) => {
  const { createPaymentIntent } = useBookingMutations();
  const [pi, setPi] = useState<PaymentIntentResponse | null>(null);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const paymentIntentMutation = useMutation<PaymentIntentResponse, Error>({
    mutationFn: async () => {
      const result = await createPaymentIntent({ orderId: Number(orderId) });
      return result;
    },
    onSuccess: (data) => {
      setPi(data);
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to create payment. Please try again.',
      });
    },
  });

  useEffect(() => {
    paymentIntentMutation.mutate();
  }, [orderId]);

  const handleApplyVoucher = async (code: string) => {
    setApplyingVoucher(true);
    try {
      // TODO: Implement voucher application logic
      notification.success({
        message: 'Voucher Applied',
        description: 'The discount has been applied to your order.',
      });
      setVoucherModalOpen(false);
    } catch (error) {
      notification.error({
        message: 'Failed to Apply Voucher',
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setApplyingVoucher(false);
    }
  };

  if (paymentIntentMutation.isLoading || !pi) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Initializing payment...</div>
      </div>
    );
  }

  if (paymentIntentMutation.isError) {
    return (
      <Result
        status="error"
        title="Could not start payment"
        subTitle="Please try again or contact support."
        extra={[
          <Button
            key="retry"
            type="primary"
            onClick={() => paymentIntentMutation.mutate()}
          >
            Retry
          </Button>,
        ]}
      />
    );
  }

  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'VND',
  }).format(pi.amount);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Alert
          message="E-Ticket Information"
          description="Your e-tickets will be available in the 'My Tickets' section of your account after successful payment."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>Have a voucher?</Text>
          <Button
            type="primary"
            ghost
            onClick={() => setVoucherModalOpen(true)}
          >
            Apply Voucher
          </Button>
        </div>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Payment Details</Title>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: pi.clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#1890ff',
                  borderRadius: '4px',
                },
              },
            }}
          >
            <CheckoutForm orderId={orderId} />
          </Elements>

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Text type="secondary">Order Total:</Text>
            <Title level={3} style={{ margin: 0 }}>
              {formattedAmount}
            </Title>
          </div>
        </Space>
      </Card>

      <VoucherModal
        open={voucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
        onApply={handleApplyVoucher}
        loading={applyingVoucher}
      />
    </Space>
  );
};

const CheckoutForm: React.FC<{ orderId: string }> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/${orderId}/success`,
      },
      redirect: 'always',
    });

    // This code will only run if redirect fails
    if (error) {
      notification.error({
        message: 'Payment Failed',
        description: error.message,
      });
      setSubmitting(false);
      return;
    }

    if (paymentIntent) {
      console.log('Payment Intent Status:', paymentIntent.status);
      // This shouldn't happen often since we're using redirect: 'always'
      switch (paymentIntent.status) {
        case 'succeeded':
          notification.success({
            message: 'Payment Successful',
            description: `Your order ${orderId} has been paid.`,
          });
          navigate(`/checkout/${orderId}/success`);
          break;

        case 'processing':
          notification.info({
            message: 'Payment Processing',
            description:
              'Your payment is being processed. We will update you once it is complete.',
          });
          // Redirect to a processing page
          navigate(`/checkout/${orderId}/processing`);
          break;

        default:
          notification.warning({
            message: 'Payment Status',
            description: `Unexpected status: ${paymentIntent.status}. Please contact support.`,
          });
          setSubmitting(false);
          break;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* optional: capture email if you don’t already have it */}
      <LinkAuthenticationElement
        onChange={(e) => {
          /* e.value.email */
        }}
      />
      <div style={{ marginTop: 16 }}>
        <PaymentElement />
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={submitting}
        disabled={!stripe}
        block
        size="large"
        style={{ marginTop: 24 }}
      >
        {submitting ? 'Processing…' : 'Pay Now'}
      </Button>
    </form>
  );
};
