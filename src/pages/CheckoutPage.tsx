import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import ProgressBar from '@/components/checkout/ProgressBar/ProgressBar';
import styled from 'styled-components';
import { EventDetails } from '@/components/checkout/EventDetails/EventDetails';
import { QuestionnaireForm } from '@/components/checkout/QuestionnaireForm/QuestionnaireForm';
import { Spin } from 'antd';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';

enum CheckoutStep {
  QUESTION_FORM = 'question-form',
  PAYMENT_INFO = 'payment-info',
}

const CheckoutPage: React.FC = () => {
  const { eventId, showId, bookingId, step } = useParams();
  const location = useLocation();
  const { data: event, isLoading: isLoadingEvent } = useGetEventDetail(eventId);
  const { data: show, isLoading: isLoadingShow } = useGetEventShowDetail(
    eventId,
    showId,
  );

  const { isDesktop } = useResponsive();
  const { t } = useTranslation();

  if (isLoadingEvent || isLoadingShow) {
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
            <QuestionnaireForm eventId={eventId} />
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
    <>
      <PageTitle>{t('common.checkout')}</PageTitle>
      <ProgressRow>
        <ProgressBar currentStep={getCurrentStep()} totalSteps={3} />
      </ProgressRow>
      {event && show && (
        <EventDetailsRow>
          <EventDetails event={event} />
        </EventDetailsRow>
      )}
      {renderStepContent()}
    </>
  );
};

export default CheckoutPage;

const ProgressRow = styled(BaseRow)`
  background-color: rgb(39, 39, 42);
  margin-left: 0;
  margin-right: 0;
  width: 100%;
`;

const EventDetailsRow = styled(BaseRow)`
  width: 100%;
  padding: 24px;
  background-color: var(--background-color);
`;

const QuestionnaireRow = styled(BaseRow)`
  width: 100%;
  padding: 24px;
`;

const PaymentRow = styled(BaseRow)`
  width: 100%;
  padding: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
