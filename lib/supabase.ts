import { createClient } from "@supabase/supabase-js";
import { GameSession } from "@/types/game";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveGameSession(session: GameSession): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("game_sessions").insert({
      player_name: session.playerName,
      player_location: session.playerLocation,
      security_code: session.securityCode,
      questions_answered: session.questionsAnswered,
      accuracy_score: session.accuracyScore,
      time_bonus_score: session.timeBonusScore,
      final_score: session.finalScore,
      completion_timestamp: new Date(session.completionTimestamp).toISOString(),
      total_time_seconds: session.totalTimeSeconds,
    });

    if (error) {
      console.error("Error saving game session:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception saving game session:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export interface LeaderboardEntry {
  player_name: string;
  player_location: string;
  final_score: number;
  accuracy_score: number;
  time_bonus_score: number;
  completion_timestamp: string;
  rank?: number;
}

export async function getLeaderboard(limit: number = 50): Promise<{ data: LeaderboardEntry[] | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("player_name, player_location, final_score, accuracy_score, time_bonus_score, completion_timestamp")
      .order("final_score", { ascending: false })
      .order("completion_timestamp", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return { data: null, error: error.message };
    }

    // Add rank to each entry
    const rankedData = data?.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    })) || null;

    return { data: rankedData };
  } catch (error) {
    console.error("Exception fetching leaderboard:", error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

