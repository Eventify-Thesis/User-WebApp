import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Text } from '@mantine/core';

interface ExpiredBookingModalProps {
  isOpen: boolean;
  eventId: string | undefined;
  showId: string | undefined;
}

export const ExpiredBookingModal: React.FC<ExpiredBookingModalProps> = ({
  isOpen,
  eventId,
  showId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectTickets = () => {
    navigate(`/events/${eventId}/bookings/${showId}/select-ticket`);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="md"
      title={<Text fw={600}>{t('checkout.bookingExpired')}</Text>}
    >
      <Text mb="xl">{t('checkout.bookingExpiredDescription')}</Text>
      <Button
        fullWidth
        onClick={handleSelectTickets}
        variant="filled"
        color="blue"
      >
        {t('checkout.selectTicketsAgain')}
      </Button>
    </Modal>
  );
};
