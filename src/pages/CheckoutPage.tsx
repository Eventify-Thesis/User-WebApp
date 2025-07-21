import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useParams,
  Navigate,
  useLocation,
  useNavigate,
  Outlet,
  useMatch,
} from 'react-router-dom';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import ProgressBar from '@/components/checkout/ProgressBar/ProgressBar';
import styled from 'styled-components';
import { EventDetails } from '@/components/checkout/EventDetails/EventDetails';
import { TicketInfo } from '@/components/checkout/TicketInfo/TicketInfo';
import { ExpiredBookingModal } from '@/components/checkout/ExpiredBookingModal/ExpiredBookingModal';
import { LeaveCheckoutModal } from '@/components/checkout/LeaveCheckoutModal/LeaveCheckoutModal';
import { Loader, Container, Box, Group, Center, Stack } from '@mantine/core';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { useGetBookingStatus } from '@/queries/useGetBookingStatus';
import { getBookingCode } from '@/services/localStorage.service';
import { useNavigationBlocker } from '@/hooks/useNavigationBlocker';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import { useForm } from '@mantine/form';
import { CheckoutContext } from '@/types/checkout';
import BookingModel from '@/domain/BookingModel';
enum CheckoutStep {
  QUESTION_FORM = 'question-form',
  PAYMENT_INFO = 'payment-info',
}

const CheckoutPage: React.FC = () => {
  const { eventId, showId } = useParams();

  const isQuestion = useMatch(
    '/events/:eventId/bookings/:showId/question-form',
  );
  const isPayment = useMatch('/events/:eventId/bookings/:showId/payment-info');

  const step = isQuestion
    ? 'question-form'
    : isPayment
    ? 'payment-info'
    : 'question-form';

  // now you know which step is active
  const currentStep = isPayment ? 3 : 2;
  const location = useLocation();
  const navigate = useNavigate();
  const { isDesktop, mobileOnly } = useResponsive();
  const { t } = useTranslation();
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const {
    showModal: isLeaveModalOpen,
    handleConfirmNavigationClick,
    handleCancelNavigationClick,
    unblock,
  } = useNavigationBlocker();

  // Get booking code from localStorage
  const bookingCode = showId ? getBookingCode(showId) : null;

  const { data: event, isLoading: isLoadingEvent } = useGetEventDetail(eventId);
  const { data: show, isLoading: isLoadingShow } = useGetEventShowDetail(
    eventId,
    showId,
  );
  const { data: bookingStatus, isLoading: isLoadingBooking } =
    useGetBookingStatus(Number(showId), bookingCode || '');

  const { updateFormAnswer, completeFreeOrder } = useBookingMutations();

  const form = useForm<{
    order: {
      first_name: string;
      last_name: string;
      email: string;
      address: any;
      questions: any[];
    };
    attendees: Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      seatId: string | undefined;
      rowLabel: string | undefined;
      seatNumber: string | undefined;
      questions: any[];
    }>;
  }>({
    initialValues: {
      order: {
        first_name: '',
        last_name: '',
        email: '',
        address: {},
        questions: [],
      },
      attendees: [
        {
          first_name: '',
          last_name: '',
          email: '',
          id: 0,
          seatId: undefined,
          rowLabel: undefined,
          seatNumber: undefined,
          questions: [],
        },
      ],
    },
  });

  // Initialize timer when booking status is loaded
  useEffect(() => {
    if (bookingStatus && bookingStatus?.code === 0) {
      setRemainingTime(bookingStatus?.result?.expireIn);
    }
  }, [bookingStatus]);

  // Check expiration continuously
  useEffect(() => {
    if (remainingTime === null) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === null) return null;
        const newTime = prevTime - 1;

        if (newTime <= 0) {
          setIsExpiredModalOpen(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Redirect if no booking code
  if (!bookingCode) {
    // notification.error({
    //   message: 'Error',
    //   description: 'Invalid booking session. Please try again.',
    // });
    return (
      <Navigate
        to={`/events/${eventId}/bookings/${showId}/select-ticket`}
        replace
      />
    );
  }

  if (isLoadingEvent || isLoadingShow || isLoadingBooking) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  const getCurrentStep = () => {
    return step === CheckoutStep.QUESTION_FORM ? 2 : 3;
  };

  const handleQuestionnaireSubmit = async (
    bookingStatusParam?: BookingModel,
  ) => {
    if (!form) {
      console.error('Form reference not available');
      return;
    }

    try {
      const values = form.values;

      console.log('values', values);

      await updateFormAnswer({
        bookingCode: bookingCode!,
        showId: Number(showId),
        data: {
          order: {
            first_name: values.order.first_name,
            last_name: values.order.last_name,
            email: values.order.email,
            address: values.order.address,
            questions: values.order.questions,
          },
          attendees: values.attendees.map((attendee) => ({
            id: attendee.id,
            first_name: attendee.first_name,
            last_name: attendee.last_name,
            email: attendee.email,
            seatId: attendee.seatId,
            rowLabel: attendee.rowLabel,
            seatNumber: attendee.seatNumber,
            questions: attendee.questions,
          })),
        },
      });

      unblock();

      // Use the passed booking status or fall back to the current one
      const currentBookingStatus = bookingStatusParam || bookingStatus?.result;

      // Check if the order is free (total amount is 0)
      if (currentBookingStatus && currentBookingStatus.totalAmount === 0) {
        console.log('Free order detected, completing without payment');

        try {
          await completeFreeOrder({ orderId: currentBookingStatus.orderId });
          // Navigate to success page with free order indicator
          navigate(
            `/checkout/${currentBookingStatus.orderId}/success?free=true`,
          );
        } catch (error) {
          console.error('Failed to complete free order:', error);
          // If free order completion fails, still proceed to payment for safety
          navigate(
            `/events/${eventId}/bookings/${showId}/${CheckoutStep.PAYMENT_INFO}`,
            { replace: true },
          );
        }
      } else {
        // Proceed to payment for paid orders
        navigate(
          `/events/${eventId}/bookings/${showId}/${CheckoutStep.PAYMENT_INFO}`,
          { replace: true },
        );
      }
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to submit form:', error);
    }
  };

  const onContinue = handleQuestionnaireSubmit; // your existing function

  // Don't render if booking status is not available
  if (!bookingStatus?.result) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  // now build the context payload
  const ctx: CheckoutContext = {
    event: event!,
    show: show!,
    bookingStatus: bookingStatus.result,
    form,
    onContinue,
  };

  return (
    <div style={{ backgroundColor: 'black', padding: 0 }}>
      <PageTitle>{t('common.checkout')}</PageTitle>
      <ProgressRow>
        <ProgressBar currentStep={getCurrentStep()} totalSteps={3} />
      </ProgressRow>
      {event && show && (
        <EventDetailsRow>
          <EventDetails event={event} expireIn={remainingTime || 0} />
        </EventDetailsRow>
      )}
      <Container
        size="xl"
        p={mobileOnly ? 16 : 24}
        bg="var(--background-color)"
      >
        {mobileOnly ? (
          <Stack gap={8}>
            <Box style={{ width: '100%' }}>
              <Outlet context={ctx} />
            </Box>
            <Box style={{ width: '95%' }}>
              <TicketInfo
                bookingCode={bookingCode}
                bookingStatus={bookingStatus.result}
                currentStep={step}
                onContinue={handleQuestionnaireSubmit}
              />
            </Box>
          </Stack>
        ) : (
          <Group gap={24} align="flex-start" wrap="nowrap">
            <Box style={{ flex: 1, width: '100%' }}>
              <Outlet context={ctx} />
            </Box>
            <Box w={350} style={{ flexShrink: 0 }}>
              <TicketInfo
                bookingCode={bookingCode}
                bookingStatus={bookingStatus.result}
                currentStep={step}
                onContinue={handleQuestionnaireSubmit}
              />
            </Box>
          </Group>
        )}
      </Container>
      <ExpiredBookingModal
        isOpen={isExpiredModalOpen}
        eventId={eventId}
        showId={showId}
      />
      <LeaveCheckoutModal
        isOpen={isLeaveModalOpen}
        onStay={handleCancelNavigationClick}
        onLeave={handleConfirmNavigationClick}
      />
    </div>
  );
};

export default CheckoutPage;

const ProgressRow = styled(BaseRow)`
  background-color: rgb(39, 39, 42);
  margin-left: 0;
  margin-right: 0;
  width: 100%;
`;

const EventDetailsRow = styled.div`
  width: 100%;
  background-color: var(--background-color);
  padding: 24px 24px 0 24px;
`;
