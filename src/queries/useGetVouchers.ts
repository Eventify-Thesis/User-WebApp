import { useQuery } from '@tanstack/react-query';
import { voucherClient } from '@/api/voucher.client';
import VoucherModel from '@/domain/VoucherModel';

export const GET_VOUCHERS_QUERY_KEY = 'vouchers';

export const useGetVouchers = (eventId: number, showId: number) => {
  return useQuery<VoucherModel[]>({
    queryKey: [GET_VOUCHERS_QUERY_KEY, eventId, showId],
    queryFn: () => voucherClient.getAvailableVouchers(eventId, showId),
    refetchOnWindowFocus: false,
  });
};

