import { create } from 'zustand';
import { getRandomQuizQuestions } from '@/lib/scoring';
import { Question, QuestionAnswer } from '@/types/game';

// Define the initial state object for easy reuse (crucial for resetGame)
const INITIAL_STATE = {
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
    // Missing State Properties Added:
    securityCode: '',
    isVerified: false,
    completedPrayer: false,
};

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
    
    // Missing State Properties Added to Interface:
    securityCode: string; 
    isVerified: boolean;
    completedPrayer: boolean;

    // ACTIONS (All necessary actions, including missing ones)
    initGame: (playerName: string, location: string, securityCode: string) => void;
    setCurrentQuestionIndex: (index: number) => void;
    addAnswer: (answer: QuestionAnswer) => void;
    addQuestionTime: (time: number) => void;
    setGameComplete: (isComplete: boolean) => void;
    
    // Missing Actions Added to Interface:
    setVerifiedCode: (verified: boolean) => void;
    setCompletedPrayer: (completed: boolean) => void;
    resetGame: () => void; // Required by ResultsPage
}

export const useGameState = create<GameState>((set) => ({
    // Initial State: Spread the reusable object
    ...INITIAL_STATE, 

    // Actions
    initGame: (playerName, location, securityCode) => {
      const randomQuestions = getRandomQuizQuestions();
      
      set({
        questions: randomQuestions,
        currentQuestionIndex: 0,
        totalQuestions: 15,
        isGameStarted: true,
        isGameFinished: false,
        answers: [],
        questionTimes: [],
        // Setting player object and root securityCode
        player: { name: playerName, location, securityCode },
        securityCode: securityCode, 
      });
    },

    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    
    addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
    
    addQuestionTime: (time) => set((state) => ({ questionTimes: [...state.questionTimes, time] })),
    
    setGameComplete: (isComplete) => set({ isGameFinished: isComplete }),

    // Implementation of the missing actions (fixes app/verify/page.tsx, app/page.tsx)
    setVerifiedCode: (verified) => set({ isVerified: verified }),
    setCompletedPrayer: (completed) => set({ completedPrayer: completed }),

    // Implementation of the reset action (fixes app/results/page.tsx)
    resetGame: () => set(INITIAL_STATE), 
}));