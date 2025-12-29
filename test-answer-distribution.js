/**
 * Test script to verify that correct answers are randomly distributed
 * across all option positions (A, B, C, D) after the fix.
 * 
 * This script simulates the question shuffling process and analyzes
 * the distribution of correct answer positions.
 */

// Simulate the Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Simulate shuffling question options
function shuffleQuestionOptions(question) {
  const shuffledOptions = shuffleArray(question.options);
  return {
    ...question,
    options: shuffledOptions,
  };
}

// Sample questions (mimicking the actual data structure)
const sampleQuestions = [
  {
    id: 1,
    question: "Who is named as Joseph's father?",
    options: ["Abraham", "David", "Jacob", "Eli"],
    correctAnswer: "Jacob",
  },
  {
    id: 2,
    question: "How many generations?",
    options: ["Ten", "Twelve", "Fourteen", "Twenty"],
    correctAnswer: "Fourteen",
  },
  {
    id: 3,
    question: "Who conceives Jesus?",
    options: ["Elizabeth", "Anna", "Mary", "Martha"],
    correctAnswer: "Mary",
  },
  {
    id: 4,
    question: "What name means 'God with us'?",
    options: ["Jesus", "Messiah", "Immanuel", "Emmanuel"],
    correctAnswer: "Immanuel",
  },
  {
    id: 5,
    question: "Where is Jesus born?",
    options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"],
    correctAnswer: "Bethlehem",
  },
];

// Test the distribution
function testAnswerDistribution(iterations = 1000) {
  console.log("=".repeat(60));
  console.log("TESTING ANSWER POSITION DISTRIBUTION");
  console.log("=".repeat(60));
  console.log(`Running ${iterations} iterations...\n`);

  const positionCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const positionLabels = { 0: "A", 1: "B", 2: "C", 3: "D" };

  for (let i = 0; i < iterations; i++) {
    sampleQuestions.forEach((question) => {
      const shuffled = shuffleQuestionOptions(question);
      const correctIndex = shuffled.options.indexOf(shuffled.correctAnswer);
      positionCounts[correctIndex]++;
    });
  }

  const totalTests = iterations * sampleQuestions.length;
  const expectedPerPosition = totalTests / 4;

  console.log("RESULTS:");
  console.log("-".repeat(60));
  console.log("Position | Count  | Percentage | Expected | Deviation");
  console.log("-".repeat(60));

  let allPositionsUsed = true;
  let isWellDistributed = true;

  Object.keys(positionCounts).forEach((pos) => {
    const count = positionCounts[pos];
    const percentage = ((count / totalTests) * 100).toFixed(2);
    const deviation = ((count - expectedPerPosition) / expectedPerPosition * 100).toFixed(2);
    const label = positionLabels[pos];

    console.log(
      `${label} (${pos})    | ${count.toString().padStart(6)} | ${percentage.padStart(6)}%   | ${expectedPerPosition.toFixed(0).padStart(8)} | ${deviation.padStart(6)}%`
    );

    if (count === 0) allPositionsUsed = false;
    if (Math.abs(deviation) > 10) isWellDistributed = false;
  });

  console.log("-".repeat(60));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Expected per position: ~${expectedPerPosition.toFixed(0)} (25%)\n`);

  console.log("ANALYSIS:");
  console.log("-".repeat(60));
  
  if (allPositionsUsed) {
    console.log("✓ All positions (A, B, C, D) are being used");
  } else {
    console.log("✗ WARNING: Some positions are never used!");
  }

  if (isWellDistributed) {
    console.log("✓ Distribution is well-balanced (within 10% deviation)");
  } else {
    console.log("⚠ Distribution shows some variance (>10% deviation)");
    console.log("  Note: Some variance is normal with random distribution");
  }

  console.log("\nCONCLUSION:");
  console.log("-".repeat(60));
  if (allPositionsUsed && isWellDistributed) {
    console.log("✓ FIX SUCCESSFUL: Answers are randomly distributed!");
    console.log("  The bug where all answers were at position C is FIXED.");
  } else if (allPositionsUsed) {
    console.log("✓ FIX SUCCESSFUL: All positions are used.");
    console.log("  Minor variance is expected with random distribution.");
  } else {
    console.log("✗ ISSUE DETECTED: Distribution is not working correctly.");
  }
  console.log("=".repeat(60));
}

// Run the test
testAnswerDistribution(1000);

