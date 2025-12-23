/**
 * Score calculation utility for Journey Through Matthew
 * 
 * Scoring Formula:
 * - Accuracy: 100% correct = 1000 points
 * - Time Bonus: Less time = more points (max 500 points)
 * - Total Score = Accuracy Points + Time Bonus Points
 * - Tie-breaker: Timestamp of completion (earlier completion wins)
 */

export interface ScoreCalculationParams {
  correctAnswers: number;
  totalQuestions: number;
  timeTakenMs: number; // Time in milliseconds
  completionTimestamp: number; // Unix timestamp in milliseconds
}

export interface ScoreResult {
  accuracyPoints: number;
  timeBonusPoints: number;
  totalScore: number;
  completionTimestamp: number;
  accuracyPercentage: number;
}

// Maximum time bonus points
const MAX_TIME_BONUS = 500;

// Base time for scoring (in milliseconds)
// This represents a "reasonable" completion time - players faster than this get full bonus
// Players slower than this get proportionally less bonus
// Using 10 minutes (600,000 ms) as a reasonable baseline
const BASE_TIME_MS = 10 * 60 * 1000; // 10 minutes

// Maximum time to consider for scoring (in milliseconds)
// Times beyond this get minimal/no bonus
const MAX_TIME_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Calculate time bonus points using a continuous exponential decay function
 * This ensures fine-grained scoring and makes ties statistically unlikely
 * 
 * Formula: maxBonus * e^(-k * normalizedTime)
 * where normalizedTime = (timeTaken / baseTime) - 1, clamped between 0 and maxTime/baseTime
 */
function calculateTimeBonus(timeTakenMs: number): number {
  // Normalize time: 0 = instant, 1 = base time, >1 = slower than base
  const normalizedTime = Math.max(0, Math.min(timeTakenMs / BASE_TIME_MS, MAX_TIME_MS / BASE_TIME_MS));
  
  // Exponential decay factor (k) - controls how quickly bonus decreases
  // Lower k = slower decay (more forgiving), higher k = faster decay (more competitive)
  const k = 0.5;
  
  // Calculate bonus using exponential decay
  // At normalizedTime = 0 (instant): bonus = MAX_TIME_BONUS
  // At normalizedTime = 1 (base time): bonus ≈ MAX_TIME_BONUS * e^(-0.5) ≈ 303 points
  // At normalizedTime = 3 (3x base time): bonus ≈ MAX_TIME_BONUS * e^(-1.5) ≈ 111 points
  const timeBonus = MAX_TIME_BONUS * Math.exp(-k * normalizedTime);
  
  // Ensure minimum bonus of 0 (no negative scores)
  return Math.max(0, Math.round(timeBonus * 100) / 100); // Round to 2 decimal places for precision
}

/**
 * Calculate accuracy points
 * 100% correct = 1000 points
 */
function calculateAccuracyPoints(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  
  const accuracyPercentage = correctAnswers / totalQuestions;
  const accuracyPoints = accuracyPercentage * 1000;
  
  // Round to 2 decimal places for precision
  return Math.round(accuracyPoints * 100) / 100;
}

/**
 * Calculate total score from game results
 * 
 * @param params - Score calculation parameters
 * @returns Score result with breakdown
 */
export function calculateScore(params: ScoreCalculationParams): ScoreResult {
  const { correctAnswers, totalQuestions, timeTakenMs, completionTimestamp } = params;
  
  // Calculate accuracy points (max 1000)
  const accuracyPoints = calculateAccuracyPoints(correctAnswers, totalQuestions);
  
  // Calculate time bonus points (max 500)
  const timeBonusPoints = calculateTimeBonus(timeTakenMs);
  
  // Total score = accuracy + time bonus
  // Maximum possible: 1000 + 500 = 1500 points
  const totalScore = accuracyPoints + timeBonusPoints;
  
  // Calculate accuracy percentage for display
  const accuracyPercentage = totalQuestions > 0 
    ? (correctAnswers / totalQuestions) * 100 
    : 0;
  
  return {
    accuracyPoints: Math.round(accuracyPoints * 100) / 100,
    timeBonusPoints: Math.round(timeBonusPoints * 100) / 100,
    totalScore: Math.round(totalScore * 100) / 100,
    completionTimestamp,
    accuracyPercentage: Math.round(accuracyPercentage * 100) / 100,
  };
}

/**
 * Compare two scores for leaderboard ranking
 * Returns:
 * - Negative if score1 should rank higher (better score)
 * - Positive if score2 should rank higher
 * - 0 if identical (shouldn't happen due to fine-grained scoring)
 */
export function compareScores(score1: ScoreResult, score2: ScoreResult): number {
  // Primary: Higher total score wins
  if (score1.totalScore !== score2.totalScore) {
    return score2.totalScore - score1.totalScore; // Descending order
  }
  
  // Tie-breaker: Earlier completion wins (lower timestamp = better)
  return score1.completionTimestamp - score2.completionTimestamp;
}

/**
 * Format time in milliseconds to human-readable string
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ${milliseconds}ms`;
  }
  return `${seconds}s ${milliseconds}ms`;
}

/**
 * Get score breakdown for display purposes
 */
export function getScoreBreakdown(score: ScoreResult): {
  accuracy: string;
  timeBonus: string;
  total: string;
  accuracyPercentage: string;
} {
  return {
    accuracy: score.accuracyPoints.toFixed(2),
    timeBonus: score.timeBonusPoints.toFixed(2),
    total: score.totalScore.toFixed(2),
    accuracyPercentage: `${score.accuracyPercentage.toFixed(1)}%`,
  };
}

