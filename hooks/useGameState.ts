import { create } from 'zustand';
import { getRandomQuizQuestions } from '@/lib/scoring';
import { Question, QuestionAnswer } from '@/types/game';

interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  totalQuestions: number;
  isGameStarted: boolean;
  isGameFinished: boolean;
  answers: QuestionAnswer[];
  questionTimes: number[];
  player: {
    name: string;
    location: string;
    securityCode: string;
  };

  // ACTIONS (Crucial missing functions are added to this interface)
  initGame: (playerName: string, location: string, securityCode: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addAnswer: (answer: QuestionAnswer) => void;
  addQuestionTime: (time: number) => void;
  setGameComplete: (isComplete: boolean) => void;
}

export const useGameState = create<GameState>((set) => ({
  // Initial State
  questions: [],
  currentQuestionIndex: 0,
  totalQuestions: 15,
  isGameStarted: false,
  isGameFinished: false,
  answers: [],
  questionTimes: [],
  player: {
    name: '',
    location: '',
    securityCode: '',
  },

  // Actions (The implementations for the missing functions are added here)
  initGame: (playerName, location, securityCode) => {
    // Generate the 15 random questions here
    const randomQuestions = getRandomQuizQuestions();
    
    set({
      questions: randomQuestions,
      currentQuestionIndex: 0,
      totalQuestions: 15,
      isGameStarted: true,
      isGameFinished: false,
      answers: [],
      questionTimes: [],
      player: { name: playerName, location, securityCode },
    });
  },

  // FIX: These four functions were missing and caused all runtime errors on the Quiz page
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  
  addQuestionTime: (time) => set((state) => ({ questionTimes: [...state.questionTimes, time] })),
  
  setGameComplete: (isComplete) => set({ isGameFinished: isComplete }),
}));