"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { questions } from "@/lib/questions";
import { QuestionAnswer } from "@/types/game";

const QUESTION_TIME_LIMIT = 30; // seconds

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addAnswer,
    addQuestionTime,
    setGameComplete,
  } = useGameState();

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Safety check: ensure currentQuestion exists and has valid data
  if (!currentQuestion || typeof currentQuestion.correctAnswer !== 'number') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Error loading question</div>;
  }

  useEffect(() => {
    setStartTime(Date.now());
    setTimeLeft(QUESTION_TIME_LIMIT);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Timeout - no answer selected
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex]);

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    if (!currentQuestion) return;

    const timeSpent = QUESTION_TIME_LIMIT - timeLeft;
    // Ensure both values are numbers and compare strictly
    const correctAnswerIndex = Number(currentQuestion.correctAnswer);
    const selectedIndex = Number(answerIndex);
    // Use strict equality to ensure exact match
    const correct = selectedIndex === correctAnswerIndex && !isNaN(selectedIndex) && !isNaN(correctAnswerIndex);
    
    setSelectedAnswer(selectedIndex);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Record answer
    const questionAnswer: QuestionAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect: correct,
      timeSpent: timeSpent || QUESTION_TIME_LIMIT,
    };

    addAnswer(questionAnswer);
    addQuestionTime(timeSpent || QUESTION_TIME_LIMIT);

    // Show feedback for 500ms, then advance
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Game complete
        setGameComplete(true);
        router.push("/verify");
      }
    }, 500);
  };

  const getAnswerLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">
            Level {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-gray-400 text-sm">
            {currentQuestion.reference}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <motion.div
          key={timeLeft}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-bold font-mono ${
            timeLeft <= 10 ? "text-red-500" : "text-blue-500"
          }`}
        >
          {timeLeft}s
        </motion.div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="bg-gray-800 rounded-2xl p-8 md:p-12 mb-8"
        >
          <h2 className="text-gray-400 text-sm mb-4 font-semibold">
            {currentQuestion.event}
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-12 leading-relaxed">
            {currentQuestion.question}
          </h1>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const optionIndex = Number(index);
              const isSelected = selectedAnswer !== null && Number(selectedAnswer) === optionIndex;
              // Ensure both values are numbers for comparison
              const correctAnswerIndex = Number(currentQuestion.correctAnswer);
              const isCorrectOption = optionIndex === correctAnswerIndex;
              const showCorrect = isAnswered && isCorrectOption;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-6 rounded-xl text-left font-semibold text-lg transition-all ${
                    isAnswered
                      ? "cursor-not-allowed"
                      : "hover:scale-[1.02] cursor-pointer"
                  } ${
                    showCorrect
                      ? "bg-green-600 text-white"
                      : isSelected && !isCorrect
                      ? "bg-red-600 text-white"
                      : isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <span className="font-bold mr-4">
                    {getAnswerLabel(index)}.
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Screen Flash Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 pointer-events-none ${
              isCorrect ? "flash-green" : "flash-red"
            }`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

