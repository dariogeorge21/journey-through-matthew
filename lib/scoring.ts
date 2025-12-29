// lib/scoring.ts

import { QuestionAnswer, Question } from "@/types/game";
// Assuming you have exported 'allQuestions' from '@/lib/questions'
import { allQuestions } from './questions'; 

// Define the fixed length for the quiz
const QUIZ_LENGTH = 15;

/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
 * @param array The array to shuffle.
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Shuffles the options array for a question and updates the correctAnswer to track the new position.
 * This ensures that correct answers are randomly distributed across all option positions.
 * @param question The question object to shuffle options for
 * @returns A new question object with shuffled options and updated correctAnswer
 */
function shuffleQuestionOptions(question: Question): Question {
  // Create a copy of the options array
  const shuffledOptions = [...question.options];

  // Shuffle the options array using Fisher-Yates algorithm
  shuffleArray(shuffledOptions);

  // The correctAnswer string remains the same (it's still the same text)
  // The validation logic will compare the selected option text with correctAnswer text
  // This ensures correct answers are randomly distributed across all positions (A, B, C, D)
  return {
    ...question,
    options: shuffledOptions,
  };
}

/**
 * Selects 15 unique questions randomly from the pool of 100.
 * Also shuffles the options for each question to randomize answer positions.
 * @returns An array of 15 random Question objects with shuffled options.
 */
export function getRandomQuizQuestions(): Question[] {
  // 1. Create a shallow copy of the full question set (allQuestions)
  const questionsCopy = [...allQuestions];

  // 2. Shuffle the copy to get random questions
  const shuffledQuestions = shuffleArray(questionsCopy);

  // 3. Select the first 15 questions for the quiz
  const selectedQuestions = shuffledQuestions.slice(0, QUIZ_LENGTH);

  // 4. Shuffle the options for each question to randomize answer positions
  const questionsWithShuffledOptions = selectedQuestions.map(shuffleQuestionOptions);

  return questionsWithShuffledOptions;
}

/**
 * Calculates the final score based on accuracy and time spent.
 * The scoring is now fixed to a maximum of 15 questions.
 */
export function calculateScores(
  answers: QuestionAnswer[],
  questionTimes: number[]
): {
  accuracyScore: number;
  timeBonusScore: number;
  finalScore: number;
} {
  // --- Fixed the total questions count to 15 (based on the new game flow) ---
  const totalQuestions = QUIZ_LENGTH; 
  
  // Ensure we only process up to 15 answers/times
  const processedAnswers = answers.slice(0, totalQuestions);
  const processedTimes = questionTimes.slice(0, totalQuestions);
  
  const correctAnswers = processedAnswers.filter((a) => a.isCorrect).length;

  // --- 1. Accuracy scoring (Max 1000 points) ---
  // Points per correct answer: 1000 / 15 ≈ 66.67
  const pointsPerCorrectAnswer = 1000 / totalQuestions; 
  
  const accuracyScore = Math.round(correctAnswers * pointsPerCorrectAnswer);

  // --- 2. Time bonus calculation (Max 500 points per question, 7500 total) ---
  const MAX_TIME_PER_QUESTION = 30; // seconds
  const MAX_BONUS_PER_QUESTION = 500; 
  const BONUS_RATE = MAX_BONUS_PER_QUESTION / MAX_TIME_PER_QUESTION; // 16.666... points/sec saved

  const timeBonusScore = processedTimes.reduce((total, timeSpent) => {
    const timeLeft = Math.max(0, MAX_TIME_PER_QUESTION - timeSpent);
    const bonus = timeLeft * BONUS_RATE;
    return total + bonus; 
  }, 0);

  // --- 3. Final score ---
  const finalScore = Math.round((accuracyScore + timeBonusScore) * 100) / 100;

  return {
    accuracyScore,
    timeBonusScore: Math.round(timeBonusScore), // Round the bonus for integer display
    finalScore,
  };
}