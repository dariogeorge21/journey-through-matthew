"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full floating-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-48 h-48 flex items-center justify-center bg-gray-800 rounded-2xl">
            <Image
              src="/jaago.png"
              alt="Jaago Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-4xl font-bold text-blue-500">JAAGO</div>';
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Journey Through Matthew
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            A Biblical Quiz Experience
          </p>
          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            Embark on a spiritual journey through the Gospel of Matthew. Follow the life of Jesus
            through 15 key events, test your knowledge, and discover the timeless wisdom of
            Scripture.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="text-xl px-12 py-6 shadow-lg shadow-blue-500/50"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center text-sm text-gray-500"
        >
          <p>An educational and spiritual experience for the Jaago event</p>
        </motion.footer>
      </div>
    </div>
  );
}

