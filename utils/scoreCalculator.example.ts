/**
 * Example usage of the score calculator
 * This file demonstrates how to use the scoring system in the game
 */

import { calculateScore, formatTime, getScoreBreakdown, type ScoreCalculationParams } from './scoreCalculator';

// Example: Player completes game with 14/15 correct answers in 8 minutes 30 seconds
const exampleParams: ScoreCalculationParams = {
  correctAnswers: 14,
  totalQuestions: 15,
  timeTakenMs: 8 * 60 * 1000 + 30 * 1000, // 8 minutes 30 seconds = 510,000 ms
  completionTimestamp: Date.now(), // Current timestamp
};

// Calculate the score
const scoreResult = calculateScore(exampleParams);

// Display results
console.log('Score Breakdown:');
console.log(`Accuracy: ${scoreResult.accuracyPoints} points (${scoreResult.accuracyPercentage}% correct)`);
console.log(`Time Bonus: ${scoreResult.timeBonusPoints} points`);
console.log(`Total Score: ${scoreResult.totalScore} points`);
console.log(`Time Taken: ${formatTime(exampleParams.timeTakenMs)}`);

// Get formatted breakdown
const breakdown = getScoreBreakdown(scoreResult);
console.log('\nFormatted Breakdown:');
console.log(breakdown);

// Example scenarios:
console.log('\n--- Example Scenarios ---\n');

// Perfect score, fast time
const perfectFast = calculateScore({
  correctAnswers: 15,
  totalQuestions: 15,
  timeTakenMs: 5 * 60 * 1000, // 5 minutes
  completionTimestamp: Date.now(),
});
console.log('Perfect score, 5 minutes:', perfectFast.totalScore.toFixed(2), 'points');

// Perfect score, slow time
const perfectSlow = calculateScore({
  correctAnswers: 15,
  totalQuestions: 15,
  timeTakenMs: 20 * 60 * 1000, // 20 minutes
  completionTimestamp: Date.now(),
});
console.log('Perfect score, 20 minutes:', perfectSlow.totalScore.toFixed(2), 'points');

// Good score, fast time
const goodFast = calculateScore({
  correctAnswers: 13,
  totalQuestions: 15,
  timeTakenMs: 6 * 60 * 1000, // 6 minutes
  completionTimestamp: Date.now(),
});
console.log('13/15 correct, 6 minutes:', goodFast.totalScore.toFixed(2), 'points');

// Poor score, fast time
const poorFast = calculateScore({
  correctAnswers: 8,
  totalQuestions: 15,
  timeTakenMs: 4 * 60 * 1000, // 4 minutes
  completionTimestamp: Date.now(),
});
console.log('8/15 correct, 4 minutes:', poorFast.totalScore.toFixed(2), 'points');

