import { useMutation } from '@tanstack/react-query';
import { quizClient } from '@/api/quiz.client';
import { notifications } from '@mantine/notifications';

export const useQuizMutations = (showId: number) => {
  const verifyQuizJoinCodeMutation = useMutation({
    mutationFn: (code: string) => {
      return quizClient.verifyQuizJoinCode(code);
    },
    onError: (error: Error) => {
      notifications.show({
        title: error.message,
        message: '',
        color: 'red',
      });
    },
  });

  return {
    verifyQuizJoinCode: verifyQuizJoinCodeMutation.mutateAsync,
    isVerifyPending: verifyQuizJoinCodeMutation.isPending,
  };
};
