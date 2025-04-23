import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TicketHeader } from './TicketHeader';
import { TicketDetails } from './TicketDetails';
import { TicketSummary } from './TicketSummary';
import { ContinueButton } from './ContinueButton';
import BookingModel from '@/domain/BookingModel';

interface TicketInfoProps {
  showId: number;
  bookingCode: string;
  bookingStatus: BookingModel;
  currentStep: string;
  onContinue?: () => Promise<void>;
}

export const TicketInfo: React.FC<TicketInfoProps> = ({
  showId,
  bookingCode,
  bookingStatus,
  currentStep,
  onContinue,
}) => {
  console.log('redner,', currentStep);

  return (
    <TicketInfoWrapper>
      <TicketHeader expireIn={bookingStatus.expireIn} />
      <TicketDetails items={bookingStatus.items} />

      {currentStep === 'question-form' && (
        <>
          <TicketSummary
            subtotalAmount={bookingStatus.subtotalAmount}
            totalAmount={bookingStatus.totalAmount}
            platformDiscountAmount={bookingStatus.platformDiscountAmount}
          />
          <ContinueButton
            bookingCode={bookingCode}
            isLoading={false}
            onSubmit={onContinue}
          />
        </>
      )}
    </TicketInfoWrapper>
  );
};

const TicketInfoWrapper = styled.div`
  border-radius: 8px;
  background-color: var(--ticketbox-vn-white, #fff);
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: start;
  padding: 16px;
  position: sticky;
  top: 24px;
  height: fit-content;
  color: #27272a;
`;
