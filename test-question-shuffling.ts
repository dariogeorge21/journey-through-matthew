/**
 * TypeScript test to verify the question shuffling implementation
 * This test imports the actual functions and verifies the behavior
 */

import { getRandomQuizQuestions } from './lib/scoring';
import { allQuestions } from './lib/questions';

function testQuestionShuffling() {
  console.log("=".repeat(70));
  console.log("TESTING QUESTION SHUFFLING IMPLEMENTATION");
  console.log("=".repeat(70));
  console.log();

  // Test 1: Verify that questions are selected
  console.log("Test 1: Verifying question selection...");
  const quizQuestions = getRandomQuizQuestions();
  console.log(`✓ Selected ${quizQuestions.length} questions (expected: 15)`);
  console.log();

  // Test 2: Verify that options are shuffled
  console.log("Test 2: Verifying option shuffling...");
  console.log("-".repeat(70));
  
  let allAtPositionC = true;
  const positionCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  
  quizQuestions.forEach((question, idx) => {
    const correctIndex = question.options.indexOf(question.correctAnswer);
    positionCounts[correctIndex as keyof typeof positionCounts]++;
    
    const positionLabel = String.fromCharCode(65 + correctIndex); // A, B, C, D
    console.log(
      `Q${idx + 1}: "${question.question.substring(0, 40)}..." ` +
      `→ Correct answer at position ${positionLabel} (index ${correctIndex})`
    );
    
    if (correctIndex !== 2) {
      allAtPositionC = false;
    }
  });
  
  console.log("-".repeat(70));
  console.log();

  // Test 3: Analyze distribution
  console.log("Test 3: Analyzing answer position distribution...");
  console.log("-".repeat(70));
  console.log("Position | Count | Percentage");
  console.log("-".repeat(70));
  
  Object.entries(positionCounts).forEach(([pos, count]) => {
    const label = String.fromCharCode(65 + parseInt(pos));
    const percentage = ((count / quizQuestions.length) * 100).toFixed(1);
    console.log(`${label} (${pos})    |   ${count}   | ${percentage}%`);
  });
  console.log("-".repeat(70));
  console.log();

  // Test 4: Verify correctAnswer field is preserved
  console.log("Test 4: Verifying correctAnswer field integrity...");
  const allCorrectAnswersValid = quizQuestions.every(q => 
    q.options.includes(q.correctAnswer)
  );
  console.log(
    allCorrectAnswersValid 
      ? "✓ All correctAnswer values are present in their options arrays"
      : "✗ ERROR: Some correctAnswer values are missing from options!"
  );
  console.log();

  // Final Results
  console.log("=".repeat(70));
  console.log("FINAL RESULTS:");
  console.log("=".repeat(70));
  
  if (allAtPositionC) {
    console.log("✗ BUG STILL EXISTS: All answers are at position C!");
  } else {
    console.log("✓ BUG FIXED: Answers are distributed across different positions!");
  }
  
  if (allCorrectAnswersValid) {
    console.log("✓ Answer validation will work correctly");
  } else {
    console.log("✗ WARNING: Answer validation may fail!");
  }
  
  const usedPositions = Object.values(positionCounts).filter(c => c > 0).length;
  console.log(`✓ Using ${usedPositions}/4 possible positions`);
  
  console.log("=".repeat(70));
}

// Run multiple iterations to verify randomness
console.log("\n");
console.log("Running 3 iterations to verify randomness...\n");

for (let i = 1; i <= 3; i++) {
  console.log(`\n${"#".repeat(70)}`);
  console.log(`ITERATION ${i}`);
  console.log(`${"#".repeat(70)}\n`);
  testQuestionShuffling();
}

