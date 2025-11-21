import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  async getBracket(tournamentId: string): Promise<TournamentBracket> {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/bracket`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bracket");
      }
      
      return await response.json();
    } catch (error) {
      toast.error("Failed to load tournament bracket");
      throw error;
    }
  },

  async updateMatchScore(
    tournamentId: string,
    matchId: string,
    score1: number,
    score2: number
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}/score`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score1, score2 }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update match score");
      }

      toast.success("Match score updated");
    } catch (error) {
      toast.error("Failed to update score");
      throw error;
    }
  },
};
