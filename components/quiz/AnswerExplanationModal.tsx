"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/game";

interface AnswerExplanationModalProps {
  isOpen: boolean;
  question: Question;
  isCorrect: boolean;
  onContinue: () => void;
  isLastQuestion: boolean;
}

export default function AnswerExplanationModal({
  isOpen,
  question,
  isCorrect,
  onContinue,
  isLastQuestion,
}: AnswerExplanationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl pointer-events-auto relative overflow-hidden"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              {/* Result Indicator */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCorrect
                      ? "bg-emerald-500/20 border-2 border-emerald-500/50"
                      : "bg-rose-500/20 border-2 border-rose-500/50"
                  }`}
                >
                  {isCorrect ? (
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-rose-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </motion.div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isCorrect ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    The correct answer is:{" "}
                    <span className="text-white font-semibold">
                      {question.correctAnswer}
                    </span>
                  </p>
                </div>
              </div>

              {/* Explanation Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h4 className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
                    Explanation
                  </h4>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg">
                  {question.explanation}
                </p>
              </div>

              {/* Bible Reference */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-blue-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Bible Reference
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {question.reference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg tracking-wide shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] transition-all duration-300"
              >
                {isLastQuestion ? "View Results" : "Next Question"}
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

