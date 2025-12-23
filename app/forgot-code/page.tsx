"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import Button from "@/components/ui/Button";

const HAIL_MARY_TEXT = "Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.";

export default function ForgotCodePage() {
  const router = useRouter();
  const { setCompletedPrayer } = useGameState();
  const [checkedBoxes, setCheckedBoxes] = useState<boolean[]>([false, false, false, false, false]);

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checkedBoxes];
    newChecked[index] = !newChecked[index];
    setCheckedBoxes(newChecked);
  };

  const allChecked = checkedBoxes.every((checked) => checked);
  const completedCount = checkedBoxes.filter(Boolean).length;

  const handleContinue = () => {
    if (allChecked) {
      setCompletedPrayer(true);
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden flex items-center justify-center p-6">
      {/* 1. Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        {/* Animated particles resembling floating embers/embers of light */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full blur-sm"
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
              x: [0, Math.random() * 50 - 25]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-5%"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-4"
          >
            Sacred Reconciliation
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            Path of Penance
          </h1>
          <p className="text-slate-400 mt-4 text-lg italic">Recite five Hail Marys to restore your journey.</p>
        </div>

        <div className="space-y-4 mb-10">
          {checkedBoxes.map((isChecked, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 50 }}
              onClick={() => handleCheckboxChange(index)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
                isChecked 
                  ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="p-6 flex items-start gap-6 relative z-10">
                {/* Votive Checkbox Icon */}
                <div className="relative mt-1">
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                      isChecked ? "bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-black/20 border-white/20 group-hover:border-white/40"
                    }`}
                  >
                    <AnimatePresence>
                      {isChecked && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {/* Subtle ring animation for the active/next bead */}
                  {!isChecked && completedCount === index && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-blue-500/50"
                      animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${isChecked ? "text-blue-400" : "text-slate-500"}`}>
                      Prayer Step {index + 1}
                    </span>
                  </div>
                  <p className={`text-lg transition-all duration-700 font-serif leading-relaxed ${
                    isChecked ? "text-white opacity-100" : "text-slate-500 opacity-60 italic"
                  }`}>
                    "{HAIL_MARY_TEXT}"
                  </p>
                </div>
              </div>

              {/* Completion Glow Overlay */}
              <AnimatePresence>
                {isChecked && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Progress System */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Redemption Progress</p>
              <h3 className="text-xl font-bold text-white">{completedCount} of 5 Completed</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-blue-500">{Math.round((completedCount / 5) * 100)}%</span>
            </div>
          </div>
          
          <div className="relative h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          className="mt-8"
          initial={false}
          animate={{ opacity: allChecked ? 1 : 0.4, y: allChecked ? 0 : 10 }}
        >
          <div className="relative group">
            <AnimatePresence>
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000"
                />
              )}
            </AnimatePresence>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!allChecked}
              className={`w-full py-8 text-xl font-bold tracking-widest uppercase transition-all duration-500 ${
                allChecked 
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-2xl" 
                  : "bg-slate-800 text-slate-500 border border-white/5"
              }`}
            >
              {allChecked ? "Continue to Results" : "Complete the Penance"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Global CSS for the serif font styling */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        .font-serif {
          font-family: 'Crimson Pro', serif;
        }
      `}</style>
    </div>
  );
}