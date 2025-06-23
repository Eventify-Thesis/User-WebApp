import { useMutation } from '@tanstack/react-query';
import {
  bookingClient,
  QuestionAnswerDto,
  SubmitTicketInfoDto,
} from '@/api/booking.client';
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
    mutationFn: (data: {
      showId: number;
      bookingCode: string;
      data: QuestionAnswerDto;
    }) => {
      return bookingClient.updateAnswers(
        data.showId,
        data.bookingCode,
        data.data,
      );
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to update your answers. Please try again.',
      });
    },
  });

  const createPaymentIntent = useMutation({
    mutationFn: (data: { orderId: number }) => {
      return bookingClient.createPaymentIntent(data.orderId);
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to create payment. Please try again.',
      });
    },
  });

  const completeFreeOrderMutation = useMutation({
    mutationFn: (data: { orderId: number }) => {
      return bookingClient.completeFreeOrder(data.orderId);
    },
    onSuccess: () => {
      notification.success({
        message: 'Success',
        description: 'Your free tickets have been confirmed!',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: error.message,
        description: 'Failed to complete your free order. Please try again.',
      });
    },
  });

  return {
    submitTicketInfo: submitTicketInfoMutation.mutateAsync,
    updateFormAnswer: updateFormAnswerMutation.mutateAsync,
    createPaymentIntent: createPaymentIntent.mutateAsync,
    completeFreeOrder: completeFreeOrderMutation.mutateAsync,
  };
};
