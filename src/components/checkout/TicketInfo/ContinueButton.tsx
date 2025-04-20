import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ContinueButtonProps {
  bookingCode: string;
  isLoading: boolean;
  onSubmit?: () => void;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  bookingCode,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const handleContinue = async () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleContinue}
      loading={isLoading}
      style={{ width: '100%' }}
    >
      {t('Continue')}
    </Button>
  );
};
