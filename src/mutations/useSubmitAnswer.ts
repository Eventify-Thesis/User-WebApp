import { useMutation } from '@tanstack/react-query';
import { quizClient } from '@/api/quiz.client';
import { QuizAnswer } from '@/domain/QuizModel';

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (payload: { 
      quizId: number;
      questionId: number; 
      selectedOption: number; 
      userId: string; 
      timeTaken: number 
    }) => quizClient.submitAnswer(
      payload.quizId,
      payload.questionId, 
      payload.selectedOption, 
      payload.userId, 
      payload.timeTaken
    )
  });
};
