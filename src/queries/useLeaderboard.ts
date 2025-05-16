import { useQuery } from '@tanstack/react-query';
import { QuizApi } from '@/api/quiz.client';
import { LeaderboardEntry } from '@/domain/QuizModel';

export const useLeaderboard = (showId: number) => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['quizLeaderboard', showId],
    queryFn: () => QuizApi.getLeaderboard(showId),
    enabled: !!showId
  });
};
