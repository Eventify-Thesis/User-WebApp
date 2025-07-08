import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  commentApi,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/api/commentApi';
import { showError, showSuccess } from '@/utils/notifications';
import { GET_COMMENTS_QUERY_KEY } from '@/queries/useGetComments';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: CreateCommentRequest;
    }) => {
      return commentApi.createComment(eventId, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMMENTS_QUERY_KEY, variables.eventId],
      });
      showSuccess('Comment posted successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to post comment',
      );
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      commentId,
      data,
    }: {
      eventId: string;
      commentId: number;
      data: UpdateCommentRequest;
    }) => {
      return commentApi.updateComment(eventId, commentId, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMMENTS_QUERY_KEY, variables.eventId],
      });
      showSuccess('Comment updated successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update comment',
      );
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      commentId,
    }: {
      eventId: string;
      commentId: number;
    }) => {
      return commentApi.deleteComment(eventId, commentId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMMENTS_QUERY_KEY, variables.eventId],
      });
      showSuccess('Comment deleted successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete comment',
      );
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      commentId,
    }: {
      eventId: string;
      commentId: number;
    }) => {
      return commentApi.likeComment(eventId, commentId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMMENTS_QUERY_KEY, variables.eventId],
      });
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update like',
      );
    },
  });
};
