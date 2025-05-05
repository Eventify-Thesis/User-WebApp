import React from 'react';
import { Paper, Stack, Box, rem } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { TicketHeader } from './TicketHeader';
import { TicketDetails } from './TicketDetails';
import { TicketSummary } from './TicketSummary';
import { ContinueButton } from './ContinueButton';
import BookingModel from '@/domain/BookingModel';

interface TicketInfoProps {
  bookingCode: string;
  bookingStatus: BookingModel;
  currentStep: string;
  onContinue?: () => Promise<void>;
}

export const TicketInfo: React.FC<TicketInfoProps> = ({
  bookingCode,
  bookingStatus,
  currentStep,
  onContinue,
}) => {
  const { height } = useViewportSize();
  return (
    <Paper
      radius="lg"
      p="xl"
      style={{
        position: 'sticky',
        top: rem(24),
        maxHeight: `calc(${height}px - ${rem(48)})`,
        overflowY: 'auto',
        backgroundColor: 'var(--mantine-color-white)',
        color: 'var(--mantine-color-dark-7)',
        boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        borderColor: 'var(--mantine-color-gray-3)',
      }}
      withBorder
    >
      <Stack gap="lg">
        <TicketHeader expireIn={bookingStatus.expireIn} />
        <TicketDetails items={bookingStatus.items} />

        {currentStep === 'question-form' && (
          <Box
            style={{
              borderTop: '1px solid var(--mantine-color-gray-3)',
              marginTop: rem(8),
              paddingTop: rem(16),
            }}
          >
            <TicketSummary
              subtotalAmount={bookingStatus.subtotalAmount}
              totalAmount={bookingStatus.totalAmount}
              platformDiscountAmount={bookingStatus.platformDiscountAmount}
            />
            <ContinueButton
              bookingCode={bookingCode}
              isLoading={false}
              onSubmit={onContinue}
            />
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
