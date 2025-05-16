import { useMutation } from '@tanstack/react-query';
import { QuizApi } from '@/api/quiz.client';
import { QuizResult, QuizAnswer } from '@/domain/QuizModel';

export const useSubmitQuiz = () => {
  return useMutation<QuizResult, Error, { quizId: number; userId: string; answers: QuizAnswer[] }>({
    mutationFn: (payload: { quizId: number; userId: string; answers: QuizAnswer[] }) => 
      QuizApi.submitQuizAnswers(payload.quizId, payload.userId, payload.answers)
  });
};
