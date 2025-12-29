"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const hasSaved = useRef(false);
  const {
    // FIX START: Destructure 'player' object instead of 'playerName' and 'playerLocation'
    player,
    // FIX END
    securityCode,
    answers,
    questionTimes,
    resetGame,
  } = useGameState();

  // FIX START: Extract name and location from the 'player' object
  const playerName = player.name;
  const playerLocation = player.location;
  // FIX END

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
    // Check if essential data is available before calculating scores
    if (!answers || answers.length === 0 || !questionTimes) {
      // Handle case where state might be missing (e.g., direct navigation to /results)
      setIsLoading(false);
      return; 
    }
    
    const calculatedScores = calculateScores(answers, questionTimes);
    setScores(calculatedScores);

    // Score Counter Animation
    const duration = 2500;
    const steps = 60;
    const increment = calculatedScores.finalScore / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextValue = Math.min(calculatedScores.finalScore, increment * currentStep);
      setDisplayScore(Math.round(nextValue));

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsLoading(false);

        // Save to Supabase (only once)
        if (!hasSaved.current) {
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
          saveGameSession(session).catch(console.error);
          hasSaved.current = true;
        }
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
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-6">
        <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            <LoadingSpinner size="lg" />
        </div>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-blue-400 font-mono tracking-[0.3em] uppercase text-sm"
        >
            Sealing the Pilgrimage...
        </motion.p>
      </div>
    );
  }

  // Fallback for division by zero if answers.length is 0 (though checked in useEffect)
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const accuracy = answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full z-10"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          {/* Header */}
          <header className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30"
            >
              <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              Well Done, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{playerName}</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-wide">Your pilgrimage through St. Matthew is complete.</p>
          </header>

          {/* Main Score Podium */}
          <section className="mb-8 relative">
            <div className="relative inline-block px-16 py-6 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 overflow-hidden">
               {/* Internal Glow */}
               <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
               
               <p className="text-blue-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 relative z-10">Final Ranking Score</p>
               <motion.div
                 key={displayScore}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-7xl md:text-8xl font-black text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
               >
                 {displayScore.toLocaleString()}
               </motion.div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/5 rounded-2xl p-5"
              >
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Wisdom (Accuracy)</p>
                <p className="text-2xl font-black text-white">{scores.accuracyScore}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${accuracy}%` }} />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">{accuracy}%</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/5 rounded-2xl p-5"
              >
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Swiftness (Bonus)</p>
                <p className="text-2xl font-black text-blue-400">+{scores.timeBonusScore}</p>
                <p className="text-[10px] text-blue-500/60 font-medium mt-1 uppercase">Speed of Faith</p>
              </motion.div>
            </div>
          </section>

          {/* Scripture Relic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl p-6 mb-6 relative"
          >
            <svg className="absolute top-4 left-4 w-8 h-8 text-blue-500/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V3L10.017 3V15C10.017 18.3137 7.33072 21 4.017 21H3.017Z" />
            </svg>
            <p className="text-xl md:text-2xl font-serif text-blue-100 italic leading-relaxed px-6">
              {quote}
            </p>
          </motion.div>

          {/* Achievement Tagline */}
          <div className="mb-6 text-slate-500 text-sm max-w-2xl mx-auto">
            <p>You have successfully chronicled 15 key events in the Gospel of St. Matthew. Your spiritual record has been preserved in the Sanctum.</p>
          </div>

          {/* Final Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4"
          >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
                <Button 
                    size="lg" 
                    onClick={handleRestart} 
                    className="relative w-full py-8 text-xl font-black uppercase tracking-widest bg-gray-900 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all duration-500 rounded-2xl"
                >
                Restart the Pilgrimage
                </Button>
              </div>
              <Button 
                variant="secondary"
                onClick={() => router.push("/leaderboard")}
                className="w-full py-6 text-lg font-semibold"
              >
                🏆 View Leaderboard
              </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Global Style for the Quote Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif {
          font-family: 'Crimson Pro', serif;
        }
      `}</style>
    </div>
  );
}