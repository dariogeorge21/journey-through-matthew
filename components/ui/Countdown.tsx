"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CountdownProps {
  from: number;
  onComplete: () => void;
  className?: string;
}

export default function Countdown({ from, onComplete, className = "" }: CountdownProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count === 0) {
      setTimeout(() => onComplete(), 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-bold text-blue-500"
        >
          {count}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

