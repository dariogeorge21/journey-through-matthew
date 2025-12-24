"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getLeaderboard, LeaderboardEntry } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const getRankIcon = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return "from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
  if (rank === 2) return "from-slate-400/20 to-slate-500/10 border-slate-400/30";
  if (rank === 3) return "from-amber-600/20 to-orange-600/10 border-amber-600/30";
  return "from-white/5 to-white/5 border-white/5";
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await getLeaderboard(50);
    
    if (fetchError) {
      setError(fetchError);
      setIsLoading(false);
      return;
    }

    if (data) {
      setLeaderboard(data);
      setLastUpdated(new Date());
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="max-w-7xl mx-auto w-full px-8 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Hall of Faith
                </span>
              </h1>
              <p className="text-slate-400 font-medium">
                The greatest pilgrims through Matthew's Gospel
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="secondary"
                className="px-6"
              >
                ← Return Home
              </Button>
              <button
                onClick={fetchLeaderboard}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white/80 transition-all disabled:opacity-50"
              >
                {isLoading ? "Refreshing..." : "🔄 Refresh"}
              </button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400"
          >
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              📊 {leaderboard.length} Pilgrims
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              ⏰ Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-8 pb-8">
          {isLoading && leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                <LoadingSpinner size="lg" />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-400 font-mono tracking-[0.3em] uppercase text-sm"
              >
                Loading the Sanctum...
              </motion.p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center"
            >
              <p className="text-rose-400 font-semibold mb-2">Error Loading Leaderboard</p>
              <p className="text-slate-400 text-sm">{error}</p>
              <Button
                onClick={fetchLeaderboard}
                variant="secondary"
                className="mt-4"
              >
                Try Again
              </Button>
            </motion.div>
          ) : leaderboard.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
            >
              <p className="text-slate-400 text-lg mb-4">No pilgrims have completed the journey yet.</p>
              <Button
                onClick={() => router.push("/register")}
                className="mt-4"
              >
                Be the First
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, index) => {
                    const actualRank = entry.rank!;
                    const isCenter = index === 1;
                    return (
                      <motion.div
                        key={entry.player_name + entry.completion_timestamp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative bg-gradient-to-b ${getRankColor(actualRank)} backdrop-blur-xl border rounded-2xl p-5 ${
                          isCenter ? "md:scale-110 md:z-10" : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{getRankIcon(actualRank)}</div>
                          <h3 className="text-xl font-black text-white mb-1 truncate">
                            {entry.player_name}
                          </h3>
                          <p className="text-xs text-slate-400 mb-3">{entry.player_location}</p>
                          <div className="bg-black/20 rounded-xl p-3">
                            <p className="text-3xl font-black text-white mb-1">
                              {Math.round(entry.final_score).toLocaleString()}
                            </p>
                            <div className="flex justify-center gap-3 text-xs text-slate-400">
                              <span>✓ {entry.accuracy_score}</span>
                              <span>⚡ +{entry.time_bonus_score}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Rest of Leaderboard */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Complete Rankings</h2>
                </div>
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {leaderboard.map((entry, index) => {
                      const rank = entry.rank!;
                      const isTopThree = rank <= 3;
                      
                      return (
                        <motion.div
                          key={entry.player_name + entry.completion_timestamp}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: isTopThree ? 0.3 + (index - 3) * 0.02 : index * 0.02 }}
                          className={`p-5 hover:bg-white/[0.03] transition-colors ${
                            isTopThree ? "bg-gradient-to-r from-white/[0.02] to-transparent" : ""
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 text-center">
                              <span className={`text-lg font-black ${
                                rank === 1 ? "text-yellow-500" :
                                rank === 2 ? "text-slate-400" :
                                rank === 3 ? "text-amber-600" :
                                "text-slate-500"
                              }`}>
                                {getRankIcon(rank)}
                              </span>
                            </div>

                            {/* Player Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-white truncate">
                                  {entry.player_name}
                                </h3>
                                <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-400 whitespace-nowrap">
                                  {entry.player_location}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                {formatDate(entry.completion_timestamp)}
                              </p>
                            </div>

                            {/* Scores */}
                            <div className="flex-shrink-0 text-right">
                              <div className="flex items-baseline gap-4">
                                <div className="text-right">
                                  <p className="text-xs text-slate-400 mb-1">Final Score</p>
                                  <p className="text-2xl font-black text-white">
                                    {Math.round(entry.final_score).toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right border-l border-white/10 pl-4">
                                  <p className="text-xs text-slate-400 mb-1">Breakdown</p>
                                  <div className="flex gap-3 text-sm">
                                    <span className="text-emerald-400">✓ {entry.accuracy_score}</span>
                                    <span className="text-blue-400">⚡ +{entry.time_bonus_score}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto w-full px-8 pb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-slate-500 text-sm"
          >
            <p>Rankings are based on final score (accuracy + time bonus)</p>
            <p className="mt-1">Ties are broken by earliest completion time</p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}

