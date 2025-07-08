import React from 'react';
import { Modal, ScrollArea } from '@mantine/core';
import { IssueReportForm } from './IssueReportForm';

interface IssueReportModalProps {
  opened: boolean;
  onClose: () => void;
}

export const IssueReportModal: React.FC<IssueReportModalProps> = ({
  opened,
  onClose,
}) => {
  const handleSuccess = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={null}
      centered
      padding={0}
      radius="lg"
      styles={{
        content: {
          borderRadius: '12px',
          overflow: 'hidden',
        },
        body: {
          padding: 0,
        },
      }}
    >
      <ScrollArea style={{ maxHeight: '90vh' }}>
        <IssueReportForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </ScrollArea>
    </Modal>
  );
};
