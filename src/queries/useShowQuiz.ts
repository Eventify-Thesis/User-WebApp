import { useQuery } from '@tanstack/react-query';
import { QuizApi } from '@/api/quiz.client';
import { Quiz } from '@/domain/QuizModel';

export const useShowQuiz = (showId: number) => {
  return useQuery<Quiz>({
    queryKey: ['quiz', showId],
    queryFn: () => QuizApi.getShowQuiz(showId),
    enabled: !!showId
  });
};
