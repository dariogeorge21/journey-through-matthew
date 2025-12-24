"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const messages = [
  "Preparing your journey...",
  "Loading biblical wisdom...",
  "Setting up your path...",
  "Almost ready...",
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message={messages[messageIndex]} size="lg" />
    </div>
  );
}

