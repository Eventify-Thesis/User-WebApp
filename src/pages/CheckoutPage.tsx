import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useParams,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import ProgressBar from '@/components/checkout/ProgressBar/ProgressBar';
import styled from 'styled-components';
import { EventDetails } from '@/components/checkout/EventDetails/EventDetails';
import { QuestionnaireForm } from '@/components/checkout/QuestionnaireForm/QuestionnaireForm';
import { TicketInfo } from '@/components/checkout/TicketInfo/TicketInfo';
import { ExpiredBookingModal } from '@/components/checkout/ExpiredBookingModal/ExpiredBookingModal';
import { LeaveCheckoutModal } from '@/components/checkout/LeaveCheckoutModal/LeaveCheckoutModal';
import { Spin, notification } from 'antd';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { useGetBookingStatus } from '@/queries/useGetBookingStatus';
import { getBookingCode } from '@/services/localStorage.service';
import { useNavigationBlocker } from '@/hooks/useNavigationBlocker';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import { useForm } from '@mantine/form';
import { PaymentInfo } from '@/components/checkout/PaymentInfo/PaymentInfo';

enum CheckoutStep {
  QUESTION_FORM = 'question-form',
  PAYMENT_INFO = 'payment-info',
}

const CheckoutPage: React.FC = () => {
  const { eventId, showId, step } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
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
    useGetBookingStatus(Number(showId), bookingCode);

  const { updateFormAnswer } = useBookingMutations();

  const [formRef, setFormRef] = React.useState<ReturnType<
    typeof useForm<{
      order: {
        first_name: string;
        last_name: string;
        email: string;
        address: Record<string, any>;
        questions: Array<{
          question_id: number;
          response: Record<string, any>;
        }>;
      };
      attendees: Array<{
        first_name: string;
        last_name: string;
        email: string;
        id: number;
        questions: Array<{
          question_id: number;
          response: Record<string, any>;
        }>;
      }>;
    }>
  > | null>(null);

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
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  // Validate step and redirect if invalid
  if (
    !step ||
    ![CheckoutStep.QUESTION_FORM, CheckoutStep.PAYMENT_INFO].includes(
      step as CheckoutStep,
    )
  ) {
    return (
      <Navigate
        to={`/events/${eventId}/bookings/${showId}/${CheckoutStep.QUESTION_FORM}`}
        replace
      />
    );
  }

  const getCurrentStep = () => {
    return step === CheckoutStep.QUESTION_FORM ? 2 : 3;
  };

  const handleQuestionnaireSubmit = async () => {
    if (!formRef) {
      console.error('Form reference not available');
      return;
    }

    try {
      const values = formRef.values;

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
            questions: attendee.questions,
          })),
        },
      });
      unblock();
      navigate(
        `/events/${eventId}/bookings/${showId}/${CheckoutStep.PAYMENT_INFO}`,
        { replace: true },
      );
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to submit form:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case CheckoutStep.QUESTION_FORM:
        return (
          <QuestionnaireRow>
            <QuestionnaireForm
              eventId={eventId}
              showId={showId}
              ticketTypes={show.ticketTypes}
              bookingCode={bookingCode}
              orderItems={bookingStatus?.result?.items}
              onFormReady={setFormRef}
            />
          </QuestionnaireRow>
        );
      case CheckoutStep.PAYMENT_INFO:
        return (
          <PaymentRow>
            <PaymentInfo orderId={bookingStatus?.result?.orderId} />
          </PaymentRow>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: 'black', padding: 0 }}>
      <PageTitle>{t('common.checkout')}</PageTitle>
      <ProgressRow>
        <ProgressBar currentStep={getCurrentStep()} totalSteps={3} />
      </ProgressRow>
      {event && show && (
        <EventDetailsRow>
          <EventDetails event={event} expireIn={remainingTime} />
        </EventDetailsRow>
      )}
      <CheckoutContainer>
        <MainContent>{renderStepContent()}</MainContent>
        <SideContent>
          {bookingStatus?.result && (
            <TicketInfo
              showId={showId}
              bookingCode={bookingCode}
              bookingStatus={bookingStatus.result}
              currentStep={step}
              onContinue={handleQuestionnaireSubmit}
            />
          )}
        </SideContent>
      </CheckoutContainer>
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

const CheckoutContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  padding: 24px;
  background-color: var(--background-color);
  max-width: 1200px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  flex: 1;
  width: 100%;
`;

const SideContent = styled.div`
  width: 350px;
  flex-shrink: 0;
`;

const EventDetailsRow = styled(BaseRow)`
  width: 100%;
  background-color: var(--background-color);
  padding: 24px 24px 0 24px;
`;

const QuestionnaireRow = styled(BaseRow)`
  width: 100%;
  min-width: 600px;
`;

const PaymentRow = styled(BaseRow)`
  width: 100%;
  min-width: 600px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
