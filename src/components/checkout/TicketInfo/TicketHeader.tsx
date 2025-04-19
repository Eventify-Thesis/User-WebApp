import { useResponsive } from '@/hooks/useResponsive';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ResetTicketModal } from '../ResetTicketModal/ResetTicketModal';
import { bookingClient } from '@/api/booking.client';
import { getBookingCode } from '@/services/localStorage.service';

interface TicketHeaderProps {}

export const TicketHeader: React.FC<TicketHeaderProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId, showId } = useParams();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const bookingCode = showId ? getBookingCode(showId) : null;

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };

  const handleStayClick = () => {
    setIsResetModalOpen(false);
  };

  const handleResetConfirm = async () => {
    if (showId) {
      try {
        await bookingClient.cancelBooking(Number(showId), bookingCode!);
        navigate(`/events/${eventId}/bookings/${showId}/select-ticket`);
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Title>{t('checkout.orderInformation')}</Title>
        <ResetButton onClick={handleResetClick}>
          {t('checkout.chooseTicketAgain')}
        </ResetButton>
      </HeaderContainer>

      <ResetTicketModal
        isOpen={isResetModalOpen}
        onStay={handleStayClick}
        onReset={handleResetConfirm}
      />
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 3px;
  flex-direction: column;
  line-height: 1;
  justify-content: start;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: blue;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
`;
