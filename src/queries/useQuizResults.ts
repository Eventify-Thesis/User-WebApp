import { useQuery } from '@tanstack/react-query';
import { QuizApi } from '@/api/quiz.client';
import { QuizResult } from '@/domain/QuizModel';

export const useQuizResults = (showId: number, userId: string) => {
  return useQuery<QuizResult[]>({
    queryKey: ['quizResults', showId, userId],
    queryFn: () => QuizApi.getResults(showId, userId),
    enabled: !!showId && !!userId
  });
};
