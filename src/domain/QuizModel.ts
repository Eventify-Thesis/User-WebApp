export interface Quiz {
    id: number;
    eventId: number;
    showId: number;
    title: string;
    isCompleted: boolean;
    questions?: QuizQuestion[];
    results?: QuizResult[];
  }
  
  export interface QuizQuestion {
    id: number;
    quizId: number;
    text: string;
    options: { id: number; text: string }[];
    explanation: string;
    correctOption: number;
    timeLimit?: number;
  }
  
  export interface QuizAnswer {
    id?: number;
    quizId: number;
    questionId: number;
    userId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeTaken: number;
  }
  
  export interface QuizResult {
    id: number;
    quizId: number;
    userId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number;
    completedAt: Date;
  }
  
  export interface LeaderboardEntry {
    userId: string;
    totalScore: number;
  }