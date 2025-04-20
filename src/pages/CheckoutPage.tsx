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
    notification.error({
      message: 'Error',
      description: 'Invalid booking session. Please try again.',
    });
    return <Navigate to={`/events/${eventId}/shows/${showId}`} replace />;
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
            />
          </QuestionnaireRow>
        );
      case CheckoutStep.PAYMENT_INFO:
        return (
          <PaymentRow>
            {/* TODO: Implement PaymentForm component */}
            <div>Payment form will be implemented here</div>
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
