import { QuestionAnswer } from "@/types/game";

export function calculateScores(
  answers: QuestionAnswer[],
  questionTimes: number[]
): {
  accuracyScore: number;
  timeBonusScore: number;
  finalScore: number;
} {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;

  // Accuracy scoring (out of 1000 points)
  const accuracyScore = Math.round((correctAnswers / totalQuestions) * 1000);

  // Time bonus (diminishing returns, max 500 points per question)
  const timeBonusScore = questionTimes.reduce((total, timeSpent, index) => {
    const timeLeft = Math.max(0, 30 - timeSpent); // 30 seconds per question
    const bonus = Math.min(500, timeLeft * 16.67); // Linear scaling: 30s = 500pts, 0s = 0pts
    return total + bonus;
  }, 0);

  // Final score with millisecond precision for tie-breaking
  const finalScore = Math.round((accuracyScore + timeBonusScore) * 100) / 100;

  return {
    accuracyScore,
    timeBonusScore: Math.round(timeBonusScore),
    finalScore,
  };
}

