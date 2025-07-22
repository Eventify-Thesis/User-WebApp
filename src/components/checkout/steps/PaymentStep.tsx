import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PaymentInfo } from '../PaymentInfo/PaymentInfo';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CheckoutContext } from '@/types/checkout';
import { Modal, Loader, Stack, Text, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PaymentMethodSelector } from '../PaymentMethodSelector/PaymentMethodSelector';
import { VietnamesePayment } from '../VietnamesePayment/VietnamesePayment';
import { PaymentMethod, PaymentIntent } from '../../../types/payment';
import {
  getAvailablePaymentMethods,
  createPaymentIntent,
} from '../../../api/payments.api';

export const PaymentStep: React.FC = () => {
  const { bookingStatus, event, show } = useOutletContext<CheckoutContext>();
  const hasShownModal = useRef(false);
  const navigate = useNavigate();

  // New state for payment methods and selection
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null,
  );
  const [loadingIntent, setLoadingIntent] = useState(false);

  // Fetch payment methods on mount
  useEffect(() => {
    getAvailablePaymentMethods().then((methods: PaymentMethod[]) => {
      setAvailableMethods(methods);
      setSelectedMethod(methods[0]?.id || 'stripe');
    });
  }, []);

  // Create payment intent when method or booking changes
  useEffect(() => {
    if (!bookingStatus || !bookingStatus.orderId || !selectedMethod) return;
    setLoadingIntent(true);
    createPaymentIntent(
      bookingStatus.totalAmount || 100000,
      'VND',
      selectedMethod,
      bookingStatus.orderId.toString(),
    )
      .then((intent: PaymentIntent) => {
        setPaymentIntent(intent);
      })
      .catch((err: Error) => {
        notifications.show({
          title: 'Payment Error',
          message: err.message,
          color: 'red',
        });
      })
      .finally(() => setLoadingIntent(false));
  }, [selectedMethod, bookingStatus?.orderId]);

  useEffect(() => {
    if (
      !bookingStatus ||
      !bookingStatus.bookingCode ||
      !bookingStatus.orderId
    ) {
      if (!hasShownModal.current) {
        hasShownModal.current = true;
        // Note: You might want to replace this with Mantine's modal system
        alert(
          'No Booking Found. Please select a ticket first to proceed with the checkout.',
        );
        navigate(`/events/${event.id}/bookings/${show.id}/select-ticket`);
      }
    }
  }, [bookingStatus, navigate, event?.id, show?.id]);

  // Handler for payment completion (for VietnamesePayment)
  const handlePaymentComplete = useCallback(
    (result: any) => {
      notifications.show({
        title: 'Payment Successful',
        message: 'Your payment was successful.',
        color: 'green',
      });

      // Pass payment method information to success page
      const paymentMethod = result.paymentMethod || selectedMethod;
      const paymentMethodName = result.paymentMethodName || 'Payment Gateway';

      navigate(
        `/checkout/${
          bookingStatus.orderId
        }/success?payment_method=${paymentMethod}&payment_method_name=${encodeURIComponent(
          paymentMethodName,
        )}&payment_intent_id=${result.id || paymentIntent?.id || ''}&amount=${result.amount || paymentIntent?.amount || 0}&transaction_id=${result.transactionId || ''}`,
      );
    },
    [navigate, bookingStatus?.orderId, selectedMethod, paymentIntent],
  );

  // Handler for payment error (for VietnamesePayment)
  const handlePaymentError = useCallback((error: string) => {
    notifications.show({
      title: 'Payment Failed',
      message: error,
      color: 'red',
    });
  }, []);

  if (!bookingStatus) return null;

  return (
    <BaseRow style={{ width: '100%', minWidth: 600 }}>
      <Stack gap="md" style={{ width: '100%' }}>
        <PaymentMethodSelector
          availableMethods={availableMethods}
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />
        {loadingIntent || !paymentIntent ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text>Initializing payment...</Text>
            </Stack>
          </Center>
        ) : selectedMethod === 'stripe' ? (
          <PaymentInfo
            bookingStatus={bookingStatus}
            eventId={event.id.toString()}
            showId={show.id || ''}
          />
        ) : (
          <VietnamesePayment
            paymentIntent={paymentIntent}
            onPaymentComplete={handlePaymentComplete}
            onPaymentError={handlePaymentError}
          />
        )}
      </Stack>
    </BaseRow>
  );
};
