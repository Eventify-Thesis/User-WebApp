import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ContinueButtonProps {
  showId: number;
  bookingCode: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  showId,
  bookingCode,
}) => {
  const navigate = useNavigate();
  const { updateFormAnswer } = useBookingMutations();
  const { t } = useTranslation();

  const handleContinue = async () => {
    try {
      await updateFormAnswer({
        showId: showId!,
        bookingCode: bookingCode!,
        data: answers,
      });
      // navigate('payment-info');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Button type="primary" onClick={handleContinue} block>
      {t('checkout.continue')}
    </Button>
  );
};
