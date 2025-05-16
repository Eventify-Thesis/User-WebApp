import { useMutation } from '@tanstack/react-query';
import { QuizApi } from '@/api/quiz.client';
import { QuizAnswer } from '@/domain/QuizModel';

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (payload: { 
      questionId: number; 
      selectedOption: number; 
      userId: string; 
      timeTaken: number 
    }) => QuizApi.submitAnswer(
      payload.questionId, 
      payload.selectedOption, 
      payload.userId, 
      payload.timeTaken
    )
  });
};
