import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Group, Title, Button, Box } from '@mantine/core';
import { ResetTicketModal } from '../ResetTicketModal/ResetTicketModal';
import { bookingClient } from '@/api/booking.client';
import { getBookingCode } from '@/services/localStorage.service';

interface TicketHeaderProps {
  expireIn?: number;
}

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
        localStorage.removeItem(`bookingCode_${showId}`);

        navigate(`/events/${eventId}/bookings/${showId}/select-ticket`, {
          replace: true,
        });
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };

  return (
    <Box pb="xs" w="100%">
      <Group justify="space-between" align="baseline" wrap="nowrap">
        <Title order={3} fw={600} size="h4" style={{ display: 'inline' }}>
          {t('checkout.orderInformation')}
        </Title>
        <Button
          variant="subtle"
          color="gray"
          size="compact-sm"
          onClick={handleResetClick}
          style={{
            padding: '4px 8px',
            height: 'auto',
            color: 'var(--mantine-color-gray-6)',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
          }}
        >
          {t('checkout.chooseTicketAgain')}
        </Button>
      </Group>

      <ResetTicketModal
        isOpen={isResetModalOpen}
        onStay={handleStayClick}
        onReset={handleResetConfirm}
      />
    </Box>
  );
};
