"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import Button from "@/components/ui/Button";

export default function VerifyPage() {
  const router = useRouter();
  const { securityCode, setVerifiedCode } = useGameState();
  const [enteredCode, setEnteredCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(true);

  // Mask code after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCode(false);
    }, 2000);
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

  const handleClear = () => {
    setEnteredCode("");
    setError("");
  };

  const handleVerify = () => {
    if (enteredCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    if (enteredCode === securityCode) {
      setVerifiedCode(true);
      router.push("/results");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Incorrect code. ${2 - newAttempts} attempt(s) remaining.`);

      if (newAttempts >= 2) {
        setTimeout(() => {
          router.push("/forgot-code");
        }, 2000);
      } else {
        setEnteredCode("");
        setTimeout(() => {
          setShowCode(false);
          setTimeout(() => setShowCode(true), 100);
        }, 500);
      }
    }
  };

  const handleForgotCode = () => {
    router.push("/forgot-code");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-gray-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Security Verification
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Please enter your 6-digit security code
          </p>

          {/* Code Display */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={index}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold font-mono ${
                  enteredCode[index]
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
                animate={{
                  scale: enteredCode[index] ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {enteredCode[index] ? (showCode ? enteredCode[index] : "•") : ""}
              </motion.div>
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                onClick={() => handleNumberPress(num)}
                className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              onClick={handleBackspace}
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={() => handleNumberPress(0)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              0
            </motion.button>
            <motion.button
              onClick={handleClear}
              className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold py-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleVerify}
              disabled={enteredCode.length !== 6}
              className="w-full"
            >
              Verify Code
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleForgotCode}
              className="w-full"
            >
              Forgot Code
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

