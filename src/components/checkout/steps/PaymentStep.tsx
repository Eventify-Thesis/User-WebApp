import React, { useEffect, useRef } from 'react';
import { PaymentInfo } from '../PaymentInfo/PaymentInfo';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CheckoutContext } from '@/types/checkout';
import { Modal } from 'antd';

export const PaymentStep: React.FC = () => {
  const { bookingStatus, event, show } = useOutletContext<CheckoutContext>();
  const hasShownModal = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(bookingStatus);
    if (
      !bookingStatus ||
      !bookingStatus.bookingCode ||
      !bookingStatus.orderId
    ) {
      if (!hasShownModal.current) {
        hasShownModal.current = true;
        Modal.info({
          title: 'No Booking Found',
          content: 'Please select a ticket first to proceed with the checkout.',
          okText: 'Select Ticket',
          onOk: () =>
            navigate(`/events/${event.id}/bookings/${show.id}/select-ticket`),
        });
      }
    }
  }, [bookingStatus, navigate, event?.id, show?.id]);
  return (
    <BaseRow
      style={{
        width: '100%',
        minWidth: 600,
      }}
    >
      <PaymentInfo
        bookingStatus={bookingStatus}
        eventId={event.id}
        showId={show.id}
      />
    </BaseRow>
  );
};
