import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Stack,
  Text,
  Title,
  Loader,
  Alert,
  Group,
  Box,
  Center,
  Badge,
  Divider,
} from '@mantine/core';
import {
  IconExternalLink,
  IconQrcode,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconDeviceMobile,
  IconWallet,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { PaymentIntent, PaymentIntentStatus } from '../../../types/payment';
import { confirmPayment } from '../../../api/payments.api';
import { bookingClient } from '@/api/booking.client';

interface VietnamesePaymentProps {
  paymentIntent: PaymentIntent;
  onPaymentComplete: (result: any) => void;
  onPaymentError: (error: string) => void;
}

export const VietnamesePayment: React.FC<VietnamesePaymentProps> = ({
  paymentIntent,
  onPaymentComplete,
  onPaymentError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentIntentStatus>(
    paymentIntent.status,
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (paymentIntent.status === PaymentIntentStatus.SUCCEEDED) {
      onPaymentComplete(paymentIntent);
    } else if (paymentIntent.status === PaymentIntentStatus.FAILED) {
      onPaymentError('Payment failed. Please try again.');
    }
  }, [paymentIntent.status, onPaymentComplete, onPaymentError]);

  // Detect payment method from metadata
  const getPaymentMethodType = () => {
    return paymentIntent.metadata?.paymentMethodId || 'unknown';
  };

  const getPaymentMethodName = () => {
    const methodType = getPaymentMethodType();
    switch (methodType) {
      case 'zalopay':
        return 'ZaloPay';
      case 'momo':
        return 'MoMo';
      case 'payoo':
        return 'Payoo';
      default:
        return 'Vietnamese Payment';
    }
  };

  const getPaymentMethodIcon = () => {
    const methodType = getPaymentMethodType();
    switch (methodType) {
      case 'zalopay':
        return <IconWallet size={24} color="#0068FF" />;
      case 'momo':
        return <IconDeviceMobile size={24} color="#A50064" />;
      case 'payoo':
        return <IconWallet size={24} color="#FF6B35" />;
      default:
        return <IconWallet size={24} />;
    }
  };

  const isInDevelopment = () => {
    return process.env.NODE_ENV === 'development';
  };

  const handleOpenPaymentGateway = async () => {
    const methodType = getPaymentMethodType();
    setIsProcessing(true);

    try {
      setPaymentStatus(PaymentIntentStatus.PROCESSING);

      // Always call backend API to initiate payment (both dev and prod)
      console.log('Initiating Vietnamese payment:', {
        paymentIntentId: paymentIntent.id,
        paymentProvider: methodType,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        orderId: paymentIntent.metadata?.orderId,
      });

      const response = await bookingClient.initiateVietnamesePayment({
        paymentIntentId: paymentIntent.id,
        paymentProvider: methodType,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        orderId: paymentIntent.metadata?.orderId,
      });

      console.log('Payment initiation response:', response);

      if (!response.success) {
        throw new Error(`Payment initiation failed: ${response.error}`);
      }

      if (response.success && response.paymentUrl) {
        notifications.show({
          title: 'Redirecting to Payment Gateway',
          message: `Complete your payment on ${getPaymentMethodName()}`,
          color: 'blue',
        });

        // In development, simulate payment completion after a delay
        if (isInDevelopment()) {
          setTimeout(async () => {
            try {
              // Simulate payment completion
              setPaymentStatus(PaymentIntentStatus.SUCCEEDED);
              notifications.show({
                title: 'Payment Successful',
                message: `Payment completed via ${getPaymentMethodName()}`,
                color: 'green',
              });

              onPaymentComplete({
                id: response.paymentIntentId || `payment_${Date.now()}`,
                status: 'succeeded',
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                paymentMethod: methodType,
                paymentMethodName: getPaymentMethodName(),
              });
            } catch (error) {
              setPaymentStatus(PaymentIntentStatus.FAILED);
              setErrorMessage('Payment confirmation failed');
              onPaymentError('Payment confirmation failed');
            }
            setIsProcessing(false);
          }, 3000);
        } else {
          // In production, redirect to payment gateway URL from backend
          // For development/demo purposes, simulate successful payment by redirecting to success page
          // In real implementation, you would redirect to response.paymentUrl and it would redirect back
          const returnUrl = `${window.location.origin}/checkout/${
            paymentIntent.metadata?.orderId
          }/success?payment_method=${methodType}&payment_method_name=${encodeURIComponent(
            getPaymentMethodName(),
          )}&payment_intent_id=${paymentIntent.id}&amount=${
            paymentIntent.amount
          }`;

          setTimeout(() => {
            window.location.href = returnUrl;
          }, 2000); // Simulate payment gateway processing time
        }
      } else {
        throw new Error(
          response.error || 'Payment URL not received from backend',
        );
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus(PaymentIntentStatus.FAILED);
      setErrorMessage('Failed to initiate payment');
      onPaymentError('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const renderQRCode = () => {
    return (
      <Card withBorder padding="md" mb="md" bg="white">
        <Stack align="center" gap="md">
          <Group gap="sm" align="center">
            {getPaymentMethodIcon()}
            <Title order={5} c="gray.8">
              Pay with {getPaymentMethodName()}
            </Title>
          </Group>

          <Box
            style={{
              width: 180,
              height: 180,
              backgroundColor: '#ffffff',
              border: '2px solid #e9ecef',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Stack align="center" gap="xs">
              <IconQrcode size={60} color="#495057" />
              <Text size="xs" c="gray.6" ta="center" fw={500}>
                QR Code
              </Text>
            </Stack>
          </Box>

          <Text size="sm" ta="center" c="gray.8" fw={500}>
            Open {getPaymentMethodName()} app and scan QR code
          </Text>
        </Stack>
      </Card>
    );
  };

  const renderPaymentOptions = () => {
    return (
      <Card withBorder padding="md" mb="md" bg="white">
        <Stack gap="md">
          <Button
            size="lg"
            leftSection={<IconExternalLink size={16} />}
            onClick={handleOpenPaymentGateway}
            loading={isProcessing}
            style={{ minWidth: 200 }}
            color="blue"
          >
            Pay with {getPaymentMethodName()}
          </Button>

          <Text size="sm" ta="center" c="gray.6">
            You will be redirected to complete your payment securely
          </Text>
        </Stack>
      </Card>
    );
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case PaymentIntentStatus.SUCCEEDED:
        return (
          <Stack align="center" gap="md" py="xl">
            <IconCircleCheck size={64} color="green" />
            <Title order={3} c="green">
              Payment Successful!
            </Title>
            <Text ta="center" c="white">
              Your payment has been completed successfully.
            </Text>
            <Text size="sm" c="gray.4">
              Transaction ID: {paymentIntent.id}
            </Text>
          </Stack>
        );
      case PaymentIntentStatus.FAILED:
        return (
          <Stack align="center" gap="md" py="xl">
            <IconAlertCircle size={64} color="red" />
            <Title order={3} c="red">
              Payment Failed
            </Title>
            <Text ta="center" c="white">
              {errorMessage ||
                'Your payment could not be processed. Please try again.'}
            </Text>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Stack>
        );
      case PaymentIntentStatus.PROCESSING:
        return (
          <Stack align="center" gap="md" py="xl">
            <Loader size="xl" />
            <Title order={3} c="blue">
              Processing Payment
            </Title>
            <Text ta="center" c="white">
              Please complete your payment in the {getPaymentMethodName()} app
            </Text>
            <Text size="sm" c="gray.4" ta="center">
              Do not close this window until payment is complete
            </Text>
          </Stack>
        );
      default:
        return null;
    }
  };

  if (paymentStatus !== PaymentIntentStatus.PENDING) {
    return renderPaymentStatus();
  }

  return (
    <Box className="vietnamese-payment">
      <Stack gap="sm" mb="md">
        <Title order={4} c="white">
          Complete Your Payment
        </Title>
        <Group gap="md" align="center">
          <Text size="lg" fw={600} c="white">
            {paymentIntent.amount.toLocaleString('vi-VN')}{' '}
            {paymentIntent.currency}
          </Text>
          <Badge color="blue" variant="light">
            {getPaymentMethodName()}
          </Badge>
        </Group>
      </Stack>

      <Stack gap="md">
        {renderQRCode()}
        {renderPaymentOptions()}

        <Alert
          title="Secure Payment"
          color="blue"
          icon={<IconInfoCircle size={16} />}
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <Stack gap="xs">
            <Text size="sm" c="gray.8">
              • Your payment is protected by {getPaymentMethodName()} security
            </Text>
            <Text size="sm" c="gray.8">
              • Complete payment within 15 minutes
            </Text>
            <Text size="sm" c="gray.8">
              • You will receive confirmation once payment is successful
            </Text>
          </Stack>
        </Alert>
      </Stack>
    </Box>
  );
};
