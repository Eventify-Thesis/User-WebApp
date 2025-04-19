import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface LeaveCheckoutModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export const LeaveCheckoutModal: React.FC<LeaveCheckoutModalProps> = ({
  isOpen,
  onStay,
  onLeave,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('checkout.leaveConfirmation')}
      open={isOpen}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="stay" type="primary" onClick={onStay}>
          {t('common.stay')}
        </Button>,
        <Button key="leave" danger onClick={onLeave}>
          {t('common.leave')}
        </Button>,
      ]}
    >
      <p>{t('checkout.leaveConfirmationDescription')}</p>
    </Modal>
  );
};
