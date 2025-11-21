import { apiRequest } from "./base";

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
    apiRequest<TournamentBracket>(`/tournament/${tournamentId}/bracket`, "GET"),

  updateMatchScore: (tournamentId: string, matchId: string, score1: number, score2: number) =>
    apiRequest<TournamentBracket>(
      `/tournament/${tournamentId}/matches/${matchId}/score`,
      "PUT",
      { score1, score2 },
      true
    ),

  createBracket: (tournamentId: string, playerIds: string[]) =>
    apiRequest<TournamentBracket>(
      `/tournament/${tournamentId}/bracket/create`,
      "POST",
      { player_ids: playerIds },
      true
    ),
};
