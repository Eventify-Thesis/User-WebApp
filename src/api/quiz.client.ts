import { httpApi } from '@/api/http.api';
import { Quiz, QuizQuestion, QuizAnswer, QuizResult, LeaderboardEntry } from '@/domain/QuizModel';
import { MockQuizApi } from './mocks/quiz.mock';

export const quizClient = {
  // Fetch quiz for a show
  getShowQuiz: async (eventId: number, showId: number): Promise<Quiz> => {
    const response = await httpApi.get<any>(`/events/${eventId}/shows/${showId}/quiz`);
    return response.data.data;
  },

  // Submit answer for a question
  submitAnswer: async (
    quizId: number,
    questionId: number,
    selectedOption: number,
    userId: string,
    timeTaken: number
  ): Promise<{ isCorrect: boolean; score: number }> => {
    const response = await httpApi.post<any>(`/quizzes/${quizId}/answers`, {
      questionId,
      selectedOption,
      userId,
      timeTaken
    });
    return response.data.data;
  },

  // Get quiz results for a user in a quiz
  getResults: async (quizId: number, userId: string): Promise<QuizResult[]> => {
    const response = await httpApi.get<any>(`/quizzes/${quizId}/results`, {
      params: { userId }
    });
    return response.data.data;
  },

  // Get leaderboard for a quiz
  getLeaderboard: async (quizId: number): Promise<LeaderboardEntry[]> => {
    const response = await httpApi.get<any>(`/quizzes/${quizId}/leaderboard`);
    return response.data.data;
  }
};