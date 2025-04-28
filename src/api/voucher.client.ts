import { VoucherModel } from '@/domain/VoucherModel';
import { httpApi } from './http.api';

export const voucherClient = {
  async getAvailableVouchers(eventId: number, showId: number): Promise<VoucherModel[]> {
    const response = await httpApi.get<any>(`/bookings/vouchers/${eventId}/${showId}`);
    return response.data.data.result;
  },

  async applyVoucher(showId: number, bookingCode: string, code: string): Promise<any> {
    const response = await httpApi.post(`/bookings/vouchers/${showId}/${bookingCode}/apply`, { code });
    return response.data;
  }
}
