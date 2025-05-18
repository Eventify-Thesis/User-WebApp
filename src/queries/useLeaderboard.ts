import { useQuery } from '@tanstack/react-query';
import { quizClient } from '@/api/quiz.client';
import { LeaderboardEntry } from '@/domain/QuizModel';

export const useLeaderboard = (quizId: number) => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['quizLeaderboard', quizId],
    queryFn: () => quizClient.getLeaderboard(quizId),
    enabled: !!quizId
  });
};
