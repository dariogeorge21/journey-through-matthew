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

const LOCATIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function RegisterPage() {
  const router = useRouter();
  const {
    setPlayerName,
    setPlayerLocation,
    setSecurityCode,
    playerName,
    playerLocation,
  } = useGameState();

  const [name, setName] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [step, setStep] = useState<"input" | "loading" | "code" | "countdown">("input");
  const [securityCode, setSecurityCodeLocal] = useState("");
  const [error, setError] = useState("");

  // Handle Escape key to close keyboard
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showKeyboard) {
        setShowKeyboard(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showKeyboard]);

  const generateSecurityCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateName = (nameToValidate: string): boolean => {
    if (nameToValidate.length < 2 || nameToValidate.length > 50) {
      setError("Name must be between 2 and 50 characters");
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(nameToValidate)) {
      setError("Name can only contain letters, spaces, hyphens, and apostrophes");
      return false;
    }
    setError("");
    return true;
  };

  const handleNameTranscribe = (text: string) => {
    const cleaned = text.trim();
    setName(cleaned);
    if (cleaned.length > 0) {
      if (validateName(cleaned)) {
        setPlayerName(cleaned);
      }
    } else {
      setError("");
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    // Always validate if there's input, clear error if empty
    if (newName.length > 0) {
      const isValid = validateName(newName);
      // Update player name in state only if valid
      if (isValid) {
        setPlayerName(newName);
      }
    } else {
      setError("");
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

    // Close keyboard if open
    setShowKeyboard(false);
    setError("");
    setStep("loading");

    // Generate and store security code
    const code = generateSecurityCode();
    setSecurityCodeLocal(code);
    setSecurityCode(code);

    // Show loading for 4-5 seconds
    setTimeout(() => {
      setStep("code");
    }, 4500);

    // Show code for 4 seconds, then countdown
    setTimeout(() => {
      setStep("countdown");
    }, 8500);
  };

  const handleCountdownComplete = () => {
    router.push("/quiz");
  };

  if (step === "loading") {
    return <LoadingScreen />;
  }

  if (step === "code") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="border-4 border-blue-500 rounded-2xl p-8 mb-6 bg-gray-900"
          >
            <p className="text-gray-400 text-sm mb-4">Your Security Code</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold text-blue-500 font-mono"
            >
              {securityCode}
            </motion.p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white font-semibold"
          >
            REMEMBER THIS CODE
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mt-2"
          >
            You'll need it at the end!
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (step === "countdown") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Countdown from={5} onComplete={handleCountdownComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Begin Your Journey
          </h1>
          <p className="text-gray-400">Tell us a bit about yourself</p>
        </motion.div>

        <div className="space-y-8">
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <label className="block text-white text-lg font-semibold mb-4">
              Your Name
            </label>
            <VoiceInput
              onTranscribe={handleNameTranscribe}
              onError={(err) => setError(err)}
              onShowKeyboard={() => setShowKeyboard(true)}
            />
            {/* Text Input Fallback */}
            <div className="mt-4">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Or type your name here"
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowKeyboard(true)}
                className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Use On-Screen Keyboard
              </button>
            </div>
            {name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-gray-900 rounded-lg"
              >
                <p className="text-gray-300">Name: {name}</p>
              </motion.div>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Location Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <label className="block text-white text-lg font-semibold mb-4">
              Where are you from?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LOCATIONS.map((location) => (
                <motion.button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    playerLocation === location
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {location}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!name.trim() || !playerLocation || (error.length > 0 && name.trim().length > 0)}
              className="px-12"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showKeyboard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboard(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            <OnScreenKeyboard
              value={name}
              onChange={handleNameChange}
              onClose={() => setShowKeyboard(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

