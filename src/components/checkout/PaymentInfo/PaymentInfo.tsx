// PaymentInfo.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useNavigate, useParams } from 'react-router-dom';
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
  Tabs,
  Tag,
  List,
  Divider,
  message,
} from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import { VoucherModal } from '../VoucherModal/VoucherModal';
import { PlusOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { useVoucherMutations } from '@/mutations/useVoucherMutations';
import BookingModel from '@/domain/BookingModel';

const { Title, Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

interface PaymentInfoProps {
  bookingStatus: BookingModel;
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ bookingStatus }) => {
  const orderId = bookingStatus.orderId;
  const { createPaymentIntent } = useBookingMutations();
  const { eventId, showId } = useParams();
  const [pi, setPi] = useState<PaymentIntentResponse | null>(null);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    amount: number;
    name: string;
  } | null>(null);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [shouldRefreshPayment, setShouldRefreshPayment] = useState(false);

  const paymentIntentMutation = useMutation<PaymentIntentResponse, Error>({
    mutationFn: async () => {
      const result = await createPaymentIntent({ orderId: Number(orderId) });
      return result;
    },
    onSuccess: (data) => {
      setPi(data);
      setShouldRefreshPayment(false);
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: error.message,
      });
      setShouldRefreshPayment(false);
    },
  });

  // Only create payment intent on initial load and when voucher changes
  useEffect(() => {
    if (!pi || shouldRefreshPayment) {
      paymentIntentMutation.mutate();
    }
  }, [orderId, shouldRefreshPayment]);

  const { applyVoucher } = useVoucherMutations();

  const handleApplyVoucher = async (code: string, name: string) => {
    try {
      setApplyingVoucher(true);
      const result = await applyVoucher({
        showId: Number(showId),
        bookingCode: bookingStatus.bookingCode,
        voucherCode: code,
      });
      const data = result?.data;

      if (data.success) {
        setAppliedVoucher({
          code,
          name,
          amount: data?.discountAmount,
        });
        setVoucherModalOpen(false);
        message.success('Voucher applied successfully');
        setShouldRefreshPayment(true);
      } else {
        message.error(data.message || 'Failed to apply voucher');
      }
    } catch (error) {
      message.error('Failed to apply voucher');
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = async () => {
    try {
      // TODO: Implement remove voucher API call
      setAppliedVoucher(null);
      message.success('Voucher removed successfully');
      setShouldRefreshPayment(true);
    } catch (error) {
      message.error('Failed to remove voucher');
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
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card>
        <Alert
          message="E-Ticket Information"
          description={
            <Space direction="vertical">
              <Text>
                Your e-ticket will be sent to your email after payment is
                completed
              </Text>
            </Space>
          }
          type="info"
          showIcon
        />
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Voucher</Text>
            {!appliedVoucher ? (
              <Button
                type="primary"
                ghost
                onClick={() => setVoucherModalOpen(true)}
                icon={<PlusOutlined />}
              >
                Add Voucher
              </Button>
            ) : (
              <Button type="link" onClick={() => setVoucherModalOpen(true)}>
                Change
              </Button>
            )}
          </div>

          {appliedVoucher && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <List.Item
                style={{
                  padding: '12px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Space align="start">
                  <div
                    style={{
                      backgroundColor: '#f6ffed',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #b7eb8f',
                    }}
                  >
                    <TagOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text strong style={{ color: '#52c41a' }}>
                      {new Intl.NumberFormat('vi-VN').format(
                        appliedVoucher.amount,
                      )}{' '}
                      ₫
                    </Text>
                  </div>
                  <Space direction="vertical" size={1}>
                    <Text strong>{appliedVoucher.name}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      Code: {appliedVoucher.code}
                    </Text>
                  </Space>
                </Space>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveVoucher}
                  style={{ marginLeft: 'auto' }}
                />
              </List.Item>
            </>
          )}
        </Space>
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
        eventId={Number(eventId)}
        showId={Number(showId)}
        selectedVoucher={appliedVoucher?.code}
      />
    </Space>
  );
};

const CheckoutForm: React.FC<{ orderId: number }> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
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
            navigate(`/checkout/${orderId}/processing`);
            break;

          default:
            notification.warning({
              message: 'Payment Status',
              description: `Unexpected status: ${paymentIntent.status}. Please contact support.`,
            });
            break;
        }
      }
    } catch (error) {
      notification.error({
        message: 'Payment Error',
        description: 'An unexpected error occurred during payment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
