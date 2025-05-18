import { useQuery } from '@tanstack/react-query';
import { quizClient } from '@/api/quiz.client';
import { QuizResult } from '@/domain/QuizModel';

export const useQuizResults = (quizId: number, userId: string) => {
  return useQuery<QuizResult[]>({
    queryKey: ['quizResults', quizId, userId],
    queryFn: () => quizClient.getResults(quizId, userId),
    enabled: !!quizId && !!userId
  });
};
