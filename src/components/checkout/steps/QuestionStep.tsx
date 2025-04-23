import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { useForm } from '@mantine/form';
import { QuestionnaireForm } from '../QuestionnaireForm/QuestionnaireForm';
import { useOutletContext } from 'react-router-dom';
import { CheckoutContext } from '@/types/checkout';

export const QuestionStep: React.FC = () => {
  const { event, show, bookingStatus, form, onContinue } =
    useOutletContext<CheckoutContext>();

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
