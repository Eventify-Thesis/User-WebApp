import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface ResetTicketModalProps {
  isOpen: boolean;
  onStay: () => void;
  onReset: () => void;
}

export const ResetTicketModal: React.FC<ResetTicketModalProps> = ({
  isOpen,
  onStay,
  onReset,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('checkout.resetConfirmation')}
      open={isOpen}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="stay" type="primary" onClick={onStay}>
          {t('common.stay')}
        </Button>,
        <Button key="reset" danger onClick={onReset}>
          {t('common.reset')}
        </Button>,
      ]}
    >
      <p>{t('checkout.resetConfirmationDescription')}</p>
    </Modal>
  );
};
