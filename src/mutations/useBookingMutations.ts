import { useMutation } from '@tanstack/react-query';
import { bookingClient, SubmitTicketInfoDto } from '@/api/booking.client';
import { notification } from 'antd';

export const useBookingMutations = () => {
  const submitTicketInfoMutation = useMutation({
    mutationFn: (data: SubmitTicketInfoDto) => {
      return bookingClient.submitTicketInfo(data);
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: 'Failed to process your booking. Please try again.',
      });
    },
  });

  return {
    submitTicketInfo: submitTicketInfoMutation.mutateAsync,
    isSubmitting: submitTicketInfoMutation.isLoading,
  };
};