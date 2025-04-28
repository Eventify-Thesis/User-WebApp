import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { QuestionnaireForm } from '../QuestionnaireForm/QuestionnaireForm';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { CheckoutContext } from '@/types/checkout';
import { Modal, Button } from 'antd';
import { useEffect, useRef } from 'react';

export const QuestionStep: React.FC = () => {
  const { event, show, bookingStatus, form, onContinue } =
    useOutletContext<CheckoutContext>();
  const navigate = useNavigate();
  const hasShownModal = useRef(false);

  // useEffect(() => {
  //   if (!bookingStatus) {
  //     if (!hasShownModal.current) {
  //       hasShownModal.current = true;
  //       Modal.info({
  //         title: 'No Ticket Selected',
  //         content: 'Please select a ticket first to proceed with the checkout.',
  //         okText: 'Select Ticket',
  //         onOk: () =>
  //           navigate(`/events/${event.id}/bookings/${show.id}/select-ticket`),
  //       });
  //     }
  //   }
  // }, [bookingStatus, navigate, event?.id, show?.id]);

  // if (!bookingStatus || !bookingStatus.bookingCode) {
  //   return null;
  // }

  return (
    <BaseRow
      style={{
        width: '100%',
        minWidth: 600,
      }}
    >
      <QuestionnaireForm
        eventId={event.id}
        showId={show.id}
        ticketTypes={show.ticketTypes}
        bookingCode={bookingStatus.bookingCode}
        orderItems={bookingStatus.items}
        form={form}
        onFormReady={() => {}}
        onContinue={onContinue}
      />
    </BaseRow>
  );
};
