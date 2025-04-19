import { useQuery } from "@tanstack/react-query";
import { bookingClient } from "@/api/booking.client";
import BookingModel from "@/domain/BookingModel";

export const GET_FORM_ANSWERS_QUERY_KEY = "form-answers";

export const useGetFormAnswers = (showId: number, bookingCode: string) => {
  return useQuery<BookingModel[]>({
    queryKey: [GET_FORM_ANSWERS_QUERY_KEY, showId, bookingCode],
    queryFn: () => bookingClient.getAnswer(showId, bookingCode),
    refetchOnWindowFocus: false,
  });
};
