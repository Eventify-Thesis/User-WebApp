import React from 'react';
import { PaymentInfo } from '../PaymentInfo/PaymentInfo';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { useOutletContext } from 'react-router-dom';
import { CheckoutContext } from '@/types/checkout';

export const PaymentStep: React.FC = () => {
  const { bookingStatus } = useOutletContext<CheckoutContext>();

  return (
    <BaseRow
      style={{
        width: '100%',
        minWidth: 600,
      }}
    >
      <PaymentInfo orderId={bookingStatus.orderId} />
    </BaseRow>
  );
};
