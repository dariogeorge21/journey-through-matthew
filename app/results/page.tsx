"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { calculateScores } from "@/lib/scoring";
import { saveGameSession } from "@/lib/supabase";
import { GameSession } from "@/types/game";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

const INSPIRATIONAL_QUOTES = [
  "Come to me, all you who are weary and burdened, and I will give you rest. - Matthew 11:28",
  "For where two or three gather in my name, there am I with them. - Matthew 18:20",
  "Therefore go and make disciples of all nations. - Matthew 28:19",
  "Blessed are the peacemakers, for they will be called children of God. - Matthew 5:9",
  "Ask and it will be given to you; seek and you will find. - Matthew 7:7",
];

export default function ResultsPage() {
  const router = useRouter();
  const {
    playerName,
    playerLocation,
    securityCode,
    answers,
    questionTimes,
    hasVerifiedCode,
    hasCompletedPrayer,
    resetGame,
  } = useGameState();

  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<{
    accuracyScore: number;
    timeBonusScore: number;
    finalScore: number;
  } | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [quote] = useState(
    INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]
  );

  useEffect(() => {
    // Calculate scores
    const calculatedScores = calculateScores(answers, questionTimes);
    setScores(calculatedScores);

    // Animate score counter
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = calculatedScores.finalScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(calculatedScores.finalScore, increment * step);
      setDisplayScore(Math.round(current * 100) / 100);

      if (step >= steps) {
        clearInterval(timer);
        setIsLoading(false);

        // Save to Supabase
        const totalTimeSeconds = questionTimes.reduce((a, b) => a + b, 0);
        const session: GameSession = {
          playerName,
          playerLocation,
          securityCode,
          questionsAnswered: answers,
          accuracyScore: calculatedScores.accuracyScore,
          timeBonusScore: calculatedScores.timeBonusScore,
          finalScore: calculatedScores.finalScore,
          completionTimestamp: Date.now(),
          totalTimeSeconds,
        };

        saveGameSession(session).catch((error) => {
          console.error("Failed to save game session:", error);
        });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [answers, questionTimes, playerName, playerLocation, securityCode]);

  const handleRestart = () => {
    resetGame();
    router.push("/");
  };

  if (isLoading || !scores) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Calculating your spiritual journey score..." size="lg" />
      </div>
    );
  }

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctAnswers / answers.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center">
          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Thank You, {playerName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-8"
          >
            You completed the journey through Matthew's Gospel!
          </motion.p>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-6">
              <p className="text-gray-300 text-sm mb-2">Your Final Score</p>
              <motion.p
                key={displayScore}
                className="text-6xl font-bold text-white font-mono"
              >
                {displayScore.toLocaleString()}
              </motion.p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {scores.accuracyScore}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {correctAnswers}/{answers.length} correct ({accuracy}%)
                </p>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Time Bonus</p>
                <p className="text-2xl font-bold text-white">
                  {scores.timeBonusScore}
                </p>
                <p className="text-gray-500 text-xs mt-1">Speed reward</p>
              </div>
            </div>
          </motion.div>

          {/* Inspirational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-700 rounded-xl p-6 mb-8"
          >
            <p className="text-gray-300 italic text-lg leading-relaxed">
              "{quote}"
            </p>
          </motion.div>

          {/* Achievement Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <p className="text-gray-400 mb-4">
              You've journeyed through 15 key events from the Gospel of Matthew,
              from the birth of Jesus to His resurrection.
            </p>
            <p className="text-gray-500 text-sm">
              Your journey has been recorded and saved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            <Button size="lg" onClick={handleRestart} className="w-full">
              Restart Game
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

