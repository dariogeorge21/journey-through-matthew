"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const handleContinue = () => {
    if (allChecked) {
      setCompletedPrayer(true);
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Please recite 5 Hail Marys as penance
          </h1>

          <div className="space-y-6 mb-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-700 rounded-xl p-6 flex items-start gap-4 ${
                  checkedBoxes[index] ? "ring-2 ring-green-500" : ""
                }`}
              >
                <motion.button
                  onClick={() => handleCheckboxChange(index)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    checkedBoxes[index]
                      ? "bg-green-600 border-green-500"
                      : "bg-gray-600 border-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {checkedBoxes[index] && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </motion.button>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">
                    Hail Mary #{index + 1}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {HAIL_MARY_TEXT}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">
                Progress: {checkedBoxes.filter(Boolean).length} / 5
              </span>
              <span className="text-gray-400 text-sm">
                {Math.round((checkedBoxes.filter(Boolean).length / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(checkedBoxes.filter(Boolean).length / 5) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: allChecked ? 1 : 0.5 }}
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!allChecked}
              className="w-full"
            >
              Continue to Results
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

