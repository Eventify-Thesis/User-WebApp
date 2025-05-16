import axios from 'axios';
import { Quiz, QuizQuestion, QuizAnswer, QuizResult, LeaderboardEntry } from '@/domain/QuizModel';
import { MockQuizApi } from './mocks/quiz.mock';

const API_BASE = '/api';
const USE_MOCK_API = true;

export const QuizApi = {
  // User-facing endpoints
  getShowQuiz: async (showId: number): Promise<Quiz> => {
    if (USE_MOCK_API) {
      console.log('Returning mock quiz data');
      return MockQuizApi.getShowQuiz(showId);
    }
    
    const { data } = await axios.get(`${API_BASE}/quiz/shows/${showId}`);
    return data;
  },

  submitAnswer: async (
    questionId: number, 
    selectedOption: number, 
    userId: string, 
    timeTaken: number
  ): Promise<{ isCorrect: boolean; score: number }> => {
    if (USE_MOCK_API) return MockQuizApi.submitAnswer();
    
    const { data } = await axios.post(`${API_BASE}/quiz/answers`, {
      questionId,
      selectedOption,
      userId,
      timeTaken
    });
    return data;
  },

  submitQuizAnswers: async (
    quizId: number,
    userId: string,
    answers: QuizAnswer[]
  ): Promise<QuizResult> => {
    if (USE_MOCK_API) return MockQuizApi.submitQuizAnswers();
    
    const { data } = await axios.post(`${API_BASE}/quiz/${quizId}/submit`, {
      userId,
      answers
    });
    return data;
  },

  getResults: async (showId: number, userId: string): Promise<QuizResult[]> => {
    if (USE_MOCK_API) return MockQuizApi.getResults();
    
    const { data } = await axios.get(`${API_BASE}/quiz/results`, {
      params: { showId, userId }
    });
    return data;
  },

  getLeaderboard: async (showId: number): Promise<LeaderboardEntry[]> => {
    if (USE_MOCK_API) return MockQuizApi.getLeaderboard();
    
    const { data } = await axios.get(`${API_BASE}/quiz/leaderboard`, {
      params: { showId }
    });
    return data;
  }
};