import { voucherClient } from '@/api/voucher.client';
import { useMutation } from '@tanstack/react-query';
import { notification } from 'antd';

export const useVoucherMutations = () => {
  const applyVoucherMutation = useMutation({
    mutationFn: (data: { showId: number; bookingCode: string; voucherCode: string }) => {
      return voucherClient.applyVoucher(data.showId, data.bookingCode, data.voucherCode);
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to apply voucher. Please try again.',
      });
    },
  });

  return {
    applyVoucher: applyVoucherMutation.mutateAsync,
  };
}