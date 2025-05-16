import { Quiz, QuizQuestion, QuizAnswer, QuizResult, LeaderboardEntry } from '@/domain/QuizModel';

export const generateMockQuiz = (showId: number): Quiz => {
  console.log(`Generating mock quiz for show ${showId}`);
  return {
    id: 1,
    eventId: 1,
    showId,
    title: `Who's smarter than fifth grade student?`,
    isCompleted: false,
    questions: Array(5).fill(0).map((_, i) => ({
      id: i + 1,
      quizId: 1,
      text: `Question ${i + 1}`,
      options: [
        { id: 1, text: 'Option A' },
        { id: 2, text: 'Option B' },
        { id: 3, text: 'Option C' },
        { id: 4, text: 'Option D' }
      ],
      explanation: 'Explanation for question',
      correctOption: Math.floor(Math.random() * 4) + 1,
      timeLimit: 30
    })),
    results: []
  };
};

export const generateMockResult = (): QuizResult => ({
  id: 1,
  quizId: 1,
  userId: 'user-123',
  score: Math.floor(Math.random() * 100),
  totalQuestions: 5,
  correctAnswers: Math.floor(Math.random() * 5) + 1,
  timeTaken: Math.random() * 100,
  completedAt: new Date()
});

export const generateMockLeaderboard = (): LeaderboardEntry[] => 
  Array(10).fill(0).map((_, i) => ({
    userId: `user-${i + 1}`,
    username: `User ${i + 1}`,
    score: Math.floor(Math.random() * 100),
    totalScore: Math.floor(Math.random() * 500),
    rank: i + 1,
    correctAnswers: Math.floor(Math.random() * 5) + 1,
    timeTaken: Math.random() * 100
  }));

export const generateMockLeaderboardEntry = (): LeaderboardEntry => ({
  userId: 'user-1',
  totalScore: Math.floor(Math.random() * 100)
});

export const MockQuizApi = {
  getShowQuiz: (showId: number): Promise<Quiz> => {
    console.log(`Mock API called with showId: ${showId}`);
    return Promise.resolve(generateMockQuiz(showId));
  },
  submitAnswer: (): Promise<{ isCorrect: boolean; score: number }> => {
    return Promise.resolve({ isCorrect: true, score: 100 });
  },
  submitQuizAnswers: (): Promise<QuizResult> => {
    return Promise.resolve(generateMockResult());
  },
  getResults: (): Promise<QuizResult[]> => {
    return Promise.resolve([generateMockResult()]);
  },
  getLeaderboard: (): Promise<LeaderboardEntry[]> => {
    return Promise.resolve([generateMockLeaderboardEntry()]);
  }
};
