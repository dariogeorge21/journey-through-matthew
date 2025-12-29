"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundType: "success" | "failure") => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = useCallback(
    (soundType: "success" | "failure") => {
      if (isMuted) return;

      try {
        const audioPath =
          soundType === "success"
            ? "/audio/success.wav"
            : "/audio/failure.wav";

        const audio = new Audio(audioPath);
        audio.volume = 0.7;
        audio.play().catch((error) => {
          console.warn(`Failed to play ${soundType} sound:`, error);
        });
      } catch (error) {
        console.warn(`Error playing ${soundType} sound:`, error);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}

