import { create } from "zustand";
import { GameState, QuestionAnswer } from "@/types/game";

export const useGameState = create<GameState>()(
    (set) => ({
      playerName: "",
      playerLocation: "",
      securityCode: "",
      currentQuestionIndex: 0,
      questionTimes: [],
      answers: [],
      isGameComplete: false,
      hasVerifiedCode: false,
      hasCompletedPrayer: false,

      setPlayerName: (name: string) => set({ playerName: name }),
      setPlayerLocation: (location: string) => set({ playerLocation: location }),
      setSecurityCode: (code: string) => set({ securityCode: code }),
      setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
      addAnswer: (answer: QuestionAnswer) =>
        set((state) => ({ answers: [...state.answers, answer] })),
      addQuestionTime: (time: number) =>
        set((state) => ({ questionTimes: [...state.questionTimes, time] })),
      resetGame: () =>
        set({
          playerName: "",
          playerLocation: "",
          securityCode: "",
          currentQuestionIndex: 0,
          questionTimes: [],
          answers: [],
          isGameComplete: false,
          hasVerifiedCode: false,
          hasCompletedPrayer: false,
        }),
      setGameComplete: (complete: boolean) => set({ isGameComplete: complete }),
      setVerifiedCode: (verified: boolean) => set({ hasVerifiedCode: verified }),
      setCompletedPrayer: (completed: boolean) => set({ hasCompletedPrayer: completed }),
    })
);

