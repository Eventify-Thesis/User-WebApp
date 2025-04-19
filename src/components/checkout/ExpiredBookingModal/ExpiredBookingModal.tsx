import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
      title={t('checkout.bookingExpired')}
      open={isOpen}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="select" type="primary" onClick={handleSelectTickets}>
          {t('checkout.selectTicketsAgain')}
        </Button>,
      ]}
    >
      <p>{t('checkout.bookingExpiredDescription')}</p>
    </Modal>
  );
};
