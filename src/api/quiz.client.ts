import {
  Quiz,
  QuizQuestion,
  QuizAnswer,
  QuizResult,
  LeaderboardEntry,
} from '@/domain/QuizModel';
import { eventHttpApi } from './eventHttp.api';

export const quizClient = {
  verifyQuizJoinCode: async (code: string) => {
    const response = await eventHttpApi.get<any>(
      `/quizzes/verify-code/${code}`,
    );
    return response.data;
  },
};
