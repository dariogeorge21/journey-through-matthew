"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import VoiceInput from "@/components/game/VoiceInput";
import OnScreenKeyboard from "@/components/game/OnScreenKeyboard";
import LoadingScreen from "@/components/game/LoadingScreen";
import Countdown from "@/components/ui/Countdown";
import Button from "@/components/ui/Button";

// --- Configuration ---
const LOCATIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setPlayerName, setPlayerLocation, setSecurityCode, playerLocation } = useGameState();

  const [name, setName] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [step, setStep] = useState<"input" | "loading" | "code" | "countdown">("input");
  const [securityCode, setSecurityCodeLocal] = useState("");
  const [error, setError] = useState("");
  const [loadProgress, setLoadProgress] = useState(0);

  // --- Logic ---
  const validateName = (val: string) => {
    if (val.length < 2) {
      setError("Identification too short");
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(val)) {
      setError("Invalid characters detected");
      return false;
    }
    setError("");
    return true;
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (newName.length > 0 && validateName(newName)) {
      setPlayerName(newName);
    }
  };

  // Loading sequence with progress simulation
  useEffect(() => {
    if (step === "loading") {
      const interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSubmit = () => {
    if (!name || !playerLocation || error) return;
    
    setStep("loading");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCodeLocal(code);
    setSecurityCode(code);

    // Sequence timing
    setTimeout(() => setStep("code"), 4500);
    setTimeout(() => setStep("countdown"), 9000);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 selection:bg-blue-500/30 font-sans overflow-hidden">
      
      {/* 1. Immersive Background Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(29,78,216,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-10">
        
        <AnimatePresence mode="wait">
          {/* STEP: INPUT */}
          {step === "input" && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-5xl space-y-6"
            >
              <div className="text-center space-y-2">
                <motion.h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                  PILGRIM REGISTRATION
                </motion.h1>
                <p className="text-blue-400/60 font-mono text-sm tracking-widest uppercase">Initializing Soul Archive...</p>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
                {/* Voice & Name Section */}
                <section className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <VoiceInput 
                      onTranscribe={handleNameChange} 
                      onError={setError}
                      onShowKeyboard={() => setShowKeyboard(true)}
                    />
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      readOnly // Disables physical keyboard
                      onKeyDown={(e) => e.preventDefault()} // Extra safety
                      onClick={() => setShowKeyboard(true)}
                      placeholder="TOUCH TO ENTER NAME"
                      className="w-full bg-black/40 border-2 border-white/5 rounded-xl py-5 px-6 text-center text-xl font-bold tracking-widest text-blue-100 placeholder:text-gray-700 cursor-pointer transition-all hover:border-blue-500/30 focus:border-blue-500/50 outline-none"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      {error && <span className="text-red-500 text-xs font-mono uppercase tracking-tighter">{error}</span>}
                    </div>
                  </div>
                </section>

                {/* Location Grid */}
                <section className="space-y-4">
                  <h3 className="text-center text-xs font-bold text-gray-500 tracking-[0.3em] uppercase">Select Province of Origin</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setPlayerLocation(loc)}
                        className={`py-3 px-2 rounded-lg text-xs font-bold transition-all border ${
                          playerLocation === loc 
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                            : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    disabled={!name || !playerLocation || !!error}
                    onClick={handleSubmit}
                    className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                  >
                    Confirm Credentials
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: LOADING */}
          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8">
              <LoadingScreen />
              <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${loadProgress}%` }} 
                />
              </div>
              <p className="text-blue-400 font-mono text-sm animate-pulse">ENCRYPTING DATA... {loadProgress}%</p>
            </motion.div>
          )}

          {/* STEP: CODE REVEAL */}
          {step === "code" && (
            <motion.div key="code" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
              <div className="p-1 rounded-3xl bg-gradient-to-b from-blue-500 to-purple-600 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <div className="bg-[#05070A] rounded-[22px] px-16 py-10 space-y-4">
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.4em]">Unique Security Key</p>
                  <h2 className="text-7xl md:text-8xl font-black text-white font-mono tracking-tighter">
                    {securityCode}
                  </h2>
                  <div className="pt-4">
                    <p className="text-blue-400 text-lg font-bold">MEMORIZE THIS CODE</p>
                    <p className="text-gray-600 text-sm italic">Required for final ascension</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: COUNTDOWN */}
          {step === "countdown" && (
            <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="scale-150">
              <Countdown from={5} onComplete={() => router.push("/quiz")} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 4. On-Screen Keyboard Modal */}
      <AnimatePresence>
        {showKeyboard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboard(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] p-4 md:p-8 flex justify-center"
            >
              <div className="w-full max-w-4xl">
                <OnScreenKeyboard
                  value={name}
                  onChange={handleNameChange}
                  onClose={() => setShowKeyboard(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
      `}</style>
    </div>
  );
}