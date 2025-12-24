"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { questions } from "@/lib/questions";
import { QuestionAnswer } from "@/types/game";

const QUESTION_TIME_LIMIT = 30;

// --- Sub-components for a cleaner UI ---

const TimerCircle = ({ timeLeft }: { timeLeft: number }) => {
  const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="44"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="44"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray="276.46" // 2 * pi * r
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 276.46 - (276.46 * percentage) / 100 }}
          transition={{ duration: 1, ease: "linear" }}
          className={isUrgent ? "text-red-500" : "text-blue-500"}
          style={{ filter: `drop-shadow(0 0 8px ${isUrgent ? "#ef4444" : "#3b82f6"})` }}
        />
      </svg>
      <motion.span 
        key={timeLeft}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`absolute text-3xl font-black font-mono ${isUrgent ? "text-red-500" : "text-white"}`}
      >
        {timeLeft}
      </motion.span>
    </div>
  );
};

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Error loading question</div>;
  }

  useEffect(() => {
    setTimeLeft(QUESTION_TIME_LIMIT);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentQuestionIndex]);

  const handleAnswer = (answerText: string) => {
    if (isAnswered) return;
    const timeSpent = QUESTION_TIME_LIMIT - timeLeft;
    const correct = answerText === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answerText);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const questionAnswer: QuestionAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerText,
      isCorrect: correct,
      timeSpent: timeSpent || QUESTION_TIME_LIMIT,
    };

    addAnswer(questionAnswer);
    addQuestionTime(timeSpent || QUESTION_TIME_LIMIT);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameComplete(true);
        router.push("/verify");
      }
    }, 800); // Slightly longer feedback for visual polish
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-8 py-6">
        
        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <div className="flex justify-between items-end mb-1">
              <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">
                Progress: Stage {currentQuestionIndex + 1}/{questions.length}
              </span>
              <span className="text-white/40 text-xs font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <TimerCircle timeLeft={timeLeft} />

          <div className="hidden md:block w-1/2 text-right">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium">
              📖 {currentQuestion.reference}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              {/* Question Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative mb-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                
                <div className="inline-block px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                  {currentQuestion.event}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold leading-tight md:leading-snug tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  {currentQuestion.question}
                </h1>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOption = option === currentQuestion.correctAnswer;
                  const showResult = isAnswered && isCorrectOption;
                  const showWrong = isAnswered && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`
                        relative group p-5 rounded-2xl text-left transition-all duration-300 border-2
                        ${isAnswered ? "cursor-default" : "cursor-pointer active:scale-95"}
                        ${showResult 
                            ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                            : showWrong 
                            ? "bg-rose-500/20 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                            : isSelected
                            ? "bg-blue-600 border-blue-400"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`
                          w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border
                          ${showResult ? "bg-emerald-500 border-emerald-400 text-white" : 
                            showWrong ? "bg-rose-500 border-rose-400 text-white" :
                            "bg-black/20 border-white/10 text-white/40 group-hover:text-white/80"}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-lg font-semibold ${isAnswered && !isCorrectOption && !isSelected ? "opacity-40" : "opacity-100"}`}>
                          {option}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Footer Meta */}
        <footer className="md:hidden flex justify-center py-4">
           <span className="text-white/30 text-xs font-medium tracking-wide">
             REF: {currentQuestion.reference}
           </span>
        </footer>
      </div>

      {/* Screen Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 pointer-events-none mix-blend-screen transition-colors duration-300 ${
              isCorrect ? "bg-emerald-500/10" : "bg-rose-500/10"
            }`}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes flash-green {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.2; }
        }
        .flash-green { animation: flash-green 0.5s ease-out; background: #10b981; }
        .flash-red { animation: flash-green 0.5s ease-out; background: #f43f5e; }
      `}</style>
    </div>
  );
}