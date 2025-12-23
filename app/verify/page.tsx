"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import Button from "@/components/ui/Button";

export default function VerifyPage() {
  const router = useRouter();
  const { securityCode, setVerifiedCode } = useGameState();
  const [enteredCode, setEnteredCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  // Mask code after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowCode(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberPress = (num: number) => {
    if (enteredCode.length < 6) {
      setEnteredCode(enteredCode + num.toString());
      setError("");
    }
  };

  const handleBackspace = () => {
    setEnteredCode(enteredCode.slice(0, -1));
    setError("");
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleVerify = () => {
    if (enteredCode.length !== 6) {
      setError("Identification incomplete");
      triggerShake();
      return;
    }

    if (enteredCode === securityCode) {
      setVerifiedCode(true);
      router.push("/results");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      triggerShake();
      
      if (newAttempts >= 3) {
        setError("Security lockout. Redirecting...");
        setTimeout(() => router.push("/forgot-code"), 1500);
      } else {
        setError(`Access Denied. ${3 - newAttempts} attempts remaining.`);
        setEnteredCode("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden flex items-center justify-center p-6">
      {/* 1. Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: isShaking ? [-10, 10, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent h-1/2 pointer-events-none animate-pulse" />
          
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
            >
              Authorization Required
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              The Final Seal
            </h1>
            <p className="text-slate-500 text-sm mt-2">Enter the 6-digit key from your registration.</p>
          </div>

          {/* 2. Code Input Display */}
          <div className="flex justify-between gap-2 mb-10">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  borderColor: enteredCode.length === index ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)",
                  scale: enteredCode[index] ? 1.05 : 1,
                  backgroundColor: enteredCode[index] ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)"
                }}
                className={`w-12 h-16 md:w-14 md:h-20 rounded-2xl border-2 flex items-center justify-center text-2xl font-black font-mono transition-all duration-300 ${
                  enteredCode[index] ? "text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "text-slate-700"
                }`}
              >
                <AnimatePresence mode="wait">
                  {enteredCode[index] ? (
                    <motion.span
                      key={showCode ? "visible" : "masked"}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                    >
                      {showCode ? enteredCode[index] : "•"}
                    </motion.span>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: enteredCode.length === index ? [0.3, 0.6, 0.3] : 0.3 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-current" 
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Error Message */}
          <div className="h-6 mb-4 text-center">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs font-bold uppercase tracking-wider"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Immersive Keypad */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                onClick={() => handleNumberPress(num)}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.9 }}
                className="h-16 rounded-2xl bg-white/[0.04] border border-white/5 text-white text-2xl font-bold transition-colors active:border-blue-500/50"
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              onClick={handleBackspace}
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="h-16 rounded-2xl bg-white/[0.04] border border-white/5 text-red-500 text-xl flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.41-6.41a2 2 0 012.83 0L19 12l-6.76 6.76a2 2 0 01-2.83 0L3 12z" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => handleNumberPress(0)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.9 }}
              className="h-16 rounded-2xl bg-white/[0.04] border border-white/5 text-white text-2xl font-bold"
            >
              0
            </motion.button>
            <motion.button
              onClick={() => setEnteredCode("")}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="h-16 rounded-2xl bg-white/[0.04] border border-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest"
            >
              Reset
            </motion.button>
          </div>

          {/* 4. Action Buttons */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <Button
                size="lg"
                onClick={handleVerify}
                disabled={enteredCode.length !== 6}
                className={`relative w-full py-7 text-lg font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${
                  enteredCode.length === 6 
                  ? "bg-blue-600 text-white shadow-xl" 
                  : "bg-white/5 text-slate-600 border border-white/5"
                }`}
              >
                Authorize
              </Button>
            </div>
            
            <button
              onClick={() => router.push("/forgot-code")}
              className="w-full text-slate-500 hover:text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors py-2"
            >
              Lost your security key?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}