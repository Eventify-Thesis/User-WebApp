import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Text, Group } from '@mantine/core';

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
      opened={isOpen}
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="md"
      title={<Text fw={600}>{t('checkout.leaveConfirmation')}</Text>}
    >
      <Text mb="xl">{t('checkout.leaveConfirmationDescription')}</Text>
      <Group justify="flex-end" gap="sm">
        <Button variant="light" color="gray" onClick={onLeave}>
          {t('common.leave')}
        </Button>
        <Button variant="filled" color="blue" onClick={onStay}>
          {t('common.stay')}
        </Button>
      </Group>
    </Modal>
  );
};
