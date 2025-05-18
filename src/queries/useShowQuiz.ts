import { useQuery } from '@tanstack/react-query';
import { quizClient } from '@/api/quiz.client';
import { Quiz } from '@/domain/QuizModel';

export const useShowQuiz = (eventId: number, showId: number) => {
  return useQuery<Quiz>({
    queryKey: ['quiz', eventId, showId],
    queryFn: () => quizClient.getShowQuiz(eventId, showId),
    enabled: !!eventId && !!showId
  });
};
