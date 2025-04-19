import { useQuery } from '@tanstack/react-query';
import { bookingClient } from '@/api/booking.client';
import BookingModel from '@/domain/BookingModel';
export const GET_BOOKING_STATUS_QUERY_KEY = 'bookingStatus';

export const useGetBookingStatus = (showId: number, bookingCode: string) => {
  return useQuery<any>({
    queryKey: [GET_BOOKING_STATUS_QUERY_KEY],
    queryFn: () => bookingClient.getBookingStatus(showId, bookingCode),
    refetchOnWindowFocus: false,
  });
};

