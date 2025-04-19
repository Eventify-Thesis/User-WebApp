import { useMutation } from '@tanstack/react-query';
import { bookingClient, QuestionAnswerDto, SubmitTicketInfoDto } from '@/api/booking.client';
import { notification } from 'antd';

export const useBookingMutations = () => {
  const submitTicketInfoMutation = useMutation({
    mutationFn: (data: SubmitTicketInfoDto) => {
      return bookingClient.submitTicketInfo(data);
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to process your booking. Please try again.',
      });
    },
  });

  const updateFormAnswerMutation = useMutation({
    mutationFn: (data: { showId: number, bookingCode: string, data: QuestionAnswerDto }) => {
      return bookingClient.updateAnswers(data.showId, data.bookingCode, data.data);
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to update your answers. Please try again.',
      });
    },
  });

  return {
    submitTicketInfo: submitTicketInfoMutation.mutateAsync,
  };
}