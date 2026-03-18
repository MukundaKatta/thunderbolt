import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveArenaVote(matchId: string, modelA: string, modelB: string, winner: "A" | "B" | "tie") {
  const { data, error } = await supabase.from("arena_votes").insert({
    match_id: matchId,
    model_a: modelA,
    model_b: modelB,
    winner,
    voted_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Failed to save vote:", error);
  }
  return data;
}

export async function getArenaVotes() {
  const { data, error } = await supabase
    .from("arena_votes")
    .select("*")
    .order("voted_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("Failed to fetch votes:", error);
    return [];
  }
  return data || [];
}

export async function saveBookmark(userId: string, modelId: string) {
  const { data, error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    model_id: modelId,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Failed to save bookmark:", error);
  }
  return data;
}

export async function logPromptEstimate(promptLength: number, modelId: string, estimatedCost: number) {
  const { error } = await supabase.from("prompt_estimates").insert({
    prompt_length: promptLength,
    model_id: modelId,
    estimated_cost: estimatedCost,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Failed to log estimate:", error);
  }
}
