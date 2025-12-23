
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

// --- Sub-components for better organization ---

const FloatingParticle = ({ index }: { index: number }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCoords({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }, []);

  return (
    <motion.div
      className="absolute rounded-full bg-blue-400/20 blur-[1px]"
      style={{
        width: Math.random() * 6 + 2 + "px",
        height: Math.random() * 6 + 2 + "px",
        left: `${coords.x}%`,
        top: `${coords.y}%`,
      }}
      animate={{
        y: [0, -40, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        delay: index * 0.2,
      }}
    />
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect for the background glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden text-slate-200 selection:bg-blue-500/30">
      {/* 1. Immersive Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic Spotlight */}
        <div 
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05), transparent 80%)`
          }}
        />
        
        {/* Base Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,7,10,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        
        {/* Subtle Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* 2. Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* 3. Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        
        {/* Logo Section with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="relative group mb-12"
        >
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
          
          <div className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
            <Image
              src="/jaago.png"
              alt="Jaago Logo"
              width={180}
              height={180}
              className="object-contain z-10 transition-transform duration-700 group-hover:scale-110"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-5xl font-black tracking-tighter text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">JAAGO</div>';
                }
              }}
            />
          </div>
        </motion.div>

        {/* Textual Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center max-w-4xl"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Journey Through
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
              Matthew
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
            <p className="text-blue-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base">
              A Biblical Quiz Experience
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
          </motion.div>

          <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Embark on a spiritual journey through the Gospel of Matthew. 
            Follow the life of Jesus through <span className="text-slate-200 font-semibold">15 key events</span>, 
            test your knowledge, and discover the timeless wisdom of Scripture.
          </p>

          {/* Interactive CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-block group"
          >
            {/* Button Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="relative text-xl px-10 py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              {/* Shimmer effect animation */}
              <motion.div 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 font-bold tracking-wide">Start Your Journey</span>
              <svg 
                className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </motion.div>
        </motion.div>

        {/* 4. Refined Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 w-full text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.button
              onClick={() => router.push("/leaderboard")}
              className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 View Leaderboard
            </motion.button>
          </div>
        </motion.footer>
      </div>

      {/* Subtle Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05070A] to-transparent pointer-events-none" />
    </div>
  );
}