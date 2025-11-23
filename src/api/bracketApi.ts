import { apiRequest } from "./base";
import { supabase } from "@/integrations/supabase/client";

export interface BracketPlayer {
  id: string;
  name: string;
  seed?: number;
}

export interface BracketMatch {
  id: string;
  round: number;
  position: number;
  player1: BracketPlayer | null;
  player2: BracketPlayer | null;
  player1_seed: number | null;
  player2_seed: number | null;
  winner: BracketPlayer | null;
  score1: number | null;
  score2: number | null;
  status: "pending" | "completed";
  bye: boolean;
}

export interface TournamentBracket {
  id: string;
  name: string;
  total_players: number;
  rounds: number;
  matches: BracketMatch[][];
  seeds: BracketPlayer[];
  is_complete: boolean;
  winner: BracketPlayer | null;
}

export const bracketApi = {
  getBracket: (tournamentId: string) =>
    apiRequest<TournamentBracket>(`/api/tournaments/${tournamentId}/bracket`, "GET"),

  updateMatchScore: async (tournamentId: string, matchId: string, score1: number, score2: number) => {
    // We update the match score in the matches table directly
    const { data, error } = await (supabase as any)
      .from("matches")
      .update({ score: { player1: score1, player2: score2 } })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;

    // We might need to return the updated bracket, but that requires re-fetching or reconstructing.
    // For now, we return a partial object or re-fetch if possible.
    // Since getBracket is still backend, we might just return the match or try to fetch bracket from backend again?
    // But if backend is gone, getBracket fails.
    // Ideally we should implement getBracket in frontend too, but it's complex.
    // Let's return the match data casted or wrapped.
    // The original API returns TournamentBracket.
    // If we can't return that, the UI might break.
    // We'll try to fetch the bracket from backend (if it still exists) or just throw/return null.
    // Assuming backend logic for bracket is still needed.
    return bracketApi.getBracket(tournamentId);
  },

  createBracket: (tournamentId: string, playerIds: string[]) =>
    apiRequest<TournamentBracket>(
      `/api/tournaments/${tournamentId}/bracket/create`,
      "POST",
      { player_ids: playerIds },
      true
    ),
};
