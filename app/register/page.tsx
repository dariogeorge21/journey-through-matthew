
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

// --- Configuration & Assets ---
const LOCATIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </motion.svg>
);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const stepTransitionVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
};

// --- Main Component ---
export default function RegisterPage() {
  const router = useRouter();
  const { setPlayerName, setPlayerLocation, setSecurityCode, playerLocation } = useGameState();

  const [name, setName] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [step, setStep] = useState<"input" | "loading" | "code" | "countdown">("input");
  const [securityCode, setSecurityCodeLocal] = useState("");
  const [error, setError] = useState("");
  const [isValidName, setIsValidName] = useState(false);

  // Handle Escape key to close keyboard
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showKeyboard) setShowKeyboard(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showKeyboard]);

  const generateSecurityCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const validateName = (nameToValidate: string): boolean => {
    if (nameToValidate.length < 2 || nameToValidate.length > 50) {
      setError("Name must be between 2 and 50 characters");
      setIsValidName(false);
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(nameToValidate)) {
      setError("Name can only contain letters, spaces, hyphens, and apostrophes");
      setIsValidName(false);
      return false;
    }
    setError("");
    setIsValidName(true);
    return true;
  };

  const handleNameTranscribe = (text: string) => {
    const cleaned = text.trim();
    setName(cleaned);
    if (cleaned.length > 0 && validateName(cleaned)) {
      setPlayerName(cleaned);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (newName.length > 0) {
      if (validateName(newName)) setPlayerName(newName);
    } else {
      setError("");
      setIsValidName(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setPlayerLocation(location);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName || !validateName(trimmedName)) {
      setError("Please enter a valid name");
      return;
    }
    if (!playerLocation) {
      setError("Please select your location");
      return;
    }

    setShowKeyboard(false);
    setError("");
    setStep("loading");

    const code = generateSecurityCode();
    setSecurityCodeLocal(code);
    setSecurityCode(code);

    setTimeout(() => setStep("code"), 4000);
    setTimeout(() => setStep("countdown"), 9000);
  };

  // --- Sub-components for different steps ---

  const ProgressIndicator = ({ currentStep }: { currentStep: string }) => {
    const steps = ['input', 'loading', 'code'];
    const currentIndex = steps.indexOf(currentStep === 'countdown' ? 'code' : currentStep);

    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <motion.div 
              initial={false}
              animate={{
                backgroundColor: i <= currentIndex ? (i === currentIndex ? "#3B82F6" : "#10B981") : "#374151",
                scale: i === currentIndex ? 1.2 : 1
              }}
              className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
            {i < steps.length - 1 && <div className={`w-8 h-1 mx-2 rounded ${i < currentIndex ? 'bg-green-500' : 'bg-gray-700'}`} />}
          </div>
        ))}
      </div>
    );
  };

  const InputStep = () => (
    <motion.div key="input-step" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-3xl mx-auto">
      
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
          Identify Yourself
        </h1>
        <p className="text-blue-200/70 text-lg">Prepare for your journey through Matthew.</p>
      </motion.div>

      <div className="bg-gray-900/50 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-800/50 shadow-[0_0_30px_rgba(0,0,0,0.3)] space-y-8 relative overflow-hidden">
        {/* Subtle internal glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

        {/* Name Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-blue-300 text-sm font-bold uppercase tracking-wider mb-2">Alternatively: Use Voice or Keyboard</label>
          
          <div className="relative group">
             <VoiceInput
              onTranscribe={handleNameTranscribe}
              onError={setError}
              onShowKeyboard={() => setShowKeyboard(true)}
            />
             {/* Visual embellishment connecting voice to text */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[60px] right-[60px] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none"></div>
          </div>


          <div className="relative mt-4">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your full name..."
              maxLength={50}
              className={`w-full pl-4 pr-12 py-4 bg-black/40 text-white placeholder-gray-500 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${isValidName ? 'border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-gray-700 focus:border-blue-500/70 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isValidName ? <CheckIcon /> : null}
            </div>
          </div>
           <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-2">⚠️</span>{error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Location Section */}
        <motion.div variants={itemVariants}>
          <label className="block text-blue-300 text-sm font-bold uppercase tracking-wider mb-4">Select Origin Point</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {LOCATIONS.map((location) => {
              const isSelected = playerLocation === location;
              return (
                <motion.button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -2, backgroundColor: isSelected ? "rgba(37, 99, 235, 0.9)" : "rgba(55, 65, 81, 0.7)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "bg-gray-800/60 text-gray-300 border-gray-700/50 hover:border-blue-500/30"
                  }`}
                >
                  <MapPinIcon />
                  <span className="truncate">{location}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Submit Section */}
        <motion.div variants={itemVariants} className="pt-4 flex justify-center">
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!isValidName || !playerLocation}
                className="relative px-16 py-4 text-lg font-bold tracking-wider uppercase bg-gray-900 hover:bg-gray-800 text-white border border-blue-500/30"
              >
                Initialize Journey
              </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const CodeStep = () => (
    <motion.div
      key="code-step"
      variants={stepTransitionVariants}
      initial="initial" animate="animate" exit="exit"
      className="min-h-[60vh] flex flex-col items-center justify-center text-center"
    >
      <div className="relative">
        {/* Rotating orbital rings */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-50px] border-2 border-dashed border-blue-500/20 rounded-full pointer-events-none"></motion.div>
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-30px] border border-dashed border-purple-500/20 rounded-full pointer-events-none"></motion.div>

        <div className="bg-black/60 backdrop-blur-md p-10 rounded-3xl border-2 border-blue-500/50 shadow-[0_0_50px_rgba(37,99,235,0.3)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent animate-scanline pointer-events-none"></div>
          
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.5}} className="text-blue-300 text-sm uppercase tracking-[0.2em] mb-6">Authorization Sequence Complete</motion.p>
          <p className="text-gray-400 text-sm mb-2">Your Unique Security Identifier</p>
          
          <motion.div
            initial={{ scale: 0.8, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
            className="relative"
          >
            <h2 className="text-6xl md:text-8xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] tracking-widest">
              {securityCode}
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="mt-8 space-y-2">
             <p className="text-xl text-white font-bold uppercase tracking-wider animate-pulse">Identify & Memorize</p>
             <p className="text-gray-400 text-sm">Required for final validation.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const CountdownStep = () => (
    <motion.div key="countdown-step" variants={stepTransitionVariants} initial="initial" animate="animate" exit="exit" className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-lg p-12 rounded-full border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.2)]">
        <Countdown from={5} onComplete={() => router.push("/quiz")} />
      </div>
    </motion.div>
  );


  // --- Main Render ---
  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(29,78,216,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-[#0a0a12] to-transparent"></div>
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
         {/* Floating Particles (CSS based for performance) */}
         <div className="particle-container absolute inset-0 overflow-hidden opacity-30">
            {[...Array(15)].map((_, i) => (
                <div key={i} className="particle absolute rounded-full bg-blue-400" style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                    animationDelay: `-${Math.random() * 10}s`
                }}></div>
            ))}
         </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">
        
        {step !== 'countdown' && <ProgressIndicator currentStep={step} />}

        <AnimatePresence mode="wait">
          {step === "input" && <InputStep />}
          {step === "loading" && <motion.div key="loading" variants={stepTransitionVariants} initial="initial" animate="animate" exit="exit"><LoadingScreen text="Establishing Connection..." /></motion.div>}
          {step === "code" && <CodeStep />}
          {step === "countdown" && <CountdownStep />}
        </AnimatePresence>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {showKeyboard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboard(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-2xl">
                 <OnScreenKeyboard
                  value={name}
                  onChange={handleNameChange}
                  onClose={() => setShowKeyboard(false)}
                />
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

        {/* Global CSS for Particles & Scrollbar */}
        <style jsx global>{`
            @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(59, 130, 246, 0.5);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(59, 130, 246, 0.7);
            }
        `}</style>
    </div>
  );
}