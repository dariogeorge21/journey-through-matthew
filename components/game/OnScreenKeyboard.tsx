"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface OnScreenKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  maxLength?: number;
}

export default function OnScreenKeyboard({
  value,
  onChange,
  onClose,
  maxLength = 50,
}: OnScreenKeyboardProps) {
  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const handleKeyPress = (key: string) => {
    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    if (value.length < maxLength) {
      onChange(value + " ");
    }
  };

  return (
    <motion.div
      id="on-screen-keyboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 bg-gray-800 p-6 rounded-t-2xl shadow-2xl z-50"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">On-Screen Keyboard</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4 text-center">
          <p className="text-white text-xl font-mono">{value || "_"}</p>
        </div>

        <div className="space-y-2">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => (
                <motion.button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold min-w-[44px]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {key}
                </motion.button>
              ))}
            </div>
          ))}

          <div className="flex justify-center gap-2">
            <motion.button
              onClick={handleSpace}
              className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-3 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Space
            </motion.button>
            <motion.button
              onClick={handleBackspace}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Done
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

