import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Group, Text } from '@mantine/core';

interface TicketSummaryProps {
  subtotalAmount: number;
  totalAmount: number;
  platformDiscountAmount: number;
}

export const TicketSummary: React.FC<TicketSummaryProps> = ({
  subtotalAmount,
  totalAmount,
  platformDiscountAmount,
}) => {
  const { t } = useTranslation();
  return (
    <Stack gap="md" mt="md">
      <Group justify="space-between" align="flex-start">
        <Text fw={700} size="sm">
          {t('checkout.temporaryCalculate')}
        </Text>
        <Text fw={700} size="sm" c="#2CC275">
          {subtotalAmount.toLocaleString('vi-VN')} đ
        </Text>
      </Group>
      {platformDiscountAmount > 0 && (
        <Group justify="space-between" align="flex-start">
          <Text fw={700} size="sm">
            {t('checkout.platformDiscount')}
          </Text>
          <Text fw={700} size="sm" c="red">
            -{platformDiscountAmount.toLocaleString('vi-VN')} đ
          </Text>
        </Group>
      )}
      <Group justify="space-between" align="flex-start">
        <Text fw={700} size="sm">
          {t('checkout.total')}
        </Text>
        <Text fw={700} size="sm" c="#2CC275">
          {totalAmount.toLocaleString('vi-VN')} đ
        </Text>
      </Group>
      <Text size="sm" color="dimmed">
        {t('checkout.pleaseFill')}
      </Text>
    </Stack>
  );
};
