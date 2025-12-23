export interface Question {
  id: number;
  level: number;
  event: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  reference: string;
}

export interface QuestionAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface GameSession {
  id?: string;
  playerName: string;
  playerLocation: string;
  securityCode: string;
  questionsAnswered: QuestionAnswer[];
  accuracyScore: number;
  timeBonusScore: number;
  finalScore: number;
  completionTimestamp: number;
  totalTimeSeconds: number;
}

export interface GameState {
  playerName: string;
  playerLocation: string;
  securityCode: string;
  currentQuestionIndex: number;
  questionTimes: number[];
  answers: QuestionAnswer[];
  isGameComplete: boolean;
  hasVerifiedCode: boolean;
  hasCompletedPrayer: boolean;
  setPlayerName: (name: string) => void;
  setPlayerLocation: (location: string) => void;
  setSecurityCode: (code: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addAnswer: (answer: QuestionAnswer) => void;
  addQuestionTime: (time: number) => void;
  resetGame: () => void;
  setGameComplete: (complete: boolean) => void;
  setVerifiedCode: (verified: boolean) => void;
  setCompletedPrayer: (completed: boolean) => void;
}

