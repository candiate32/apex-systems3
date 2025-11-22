import { apiRequest } from "./base";
import type { SchedulingResponse } from "./algorithmsApi";

export interface GenerateFixturesPayload {
  format: "knockout" | "round-robin";
  category: string;
  player_ids?: string[];
}

export interface GenerateSchedulePayload {
  player_ids: string[];
  court_ids: string[];
  match_duration: number;
  rest_time: number;
  start_time: string;
}

export interface Match {
  id: string;
  code: string;
  player1: string;
  player2: string;
  event_type: string;
  category: string;
  court?: number;
  start_time?: string;
  end_time?: string;
  round?: string;
  status: "pending" | "ongoing" | "completed";
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
  created_at: string;
}

export interface ScheduledPlayer {
  id: string;
  name: string;
  club: string;
  seed?: number;
}

export interface ScheduledMatchData {
  player1: ScheduledPlayer;
  player2: ScheduledPlayer;
  penalty: number;
}

export interface ScheduledCourt {
  id: string;
  name: string;
  type: string;
}

export interface ScheduledMatch {
  id: string;
  match: ScheduledMatchData;
  court: ScheduledCourt;
  scheduled_start_time: string;
  scheduled_end_time: string;
  status: "scheduled" | "pending" | "ongoing" | "completed";
}

export interface Tournament {
  id: string;
  name: string;
  format: "knockout" | "round-robin" | "mixed";
  category: string;
  status: "upcoming" | "ongoing" | "completed";
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  created_at: string;
}

export interface CreateTournamentPayload {
  name: string;
  format: "knockout" | "round-robin" | "mixed";
  category: string;
  start_date?: string;
  end_date?: string;
  max_participants?: number;
}

export const tournamentApi = {
  getTournaments: () =>
    apiRequest<Tournament[]>("/api/tournaments", "GET"),

  getTournamentById: (id: string) =>
    apiRequest<Tournament>(`/api/tournaments/${id}`, "GET"),

  createTournament: (payload: CreateTournamentPayload) =>
    apiRequest<Tournament>("/api/tournaments", "POST", payload, true),

  updateTournament: (id: string, payload: Partial<CreateTournamentPayload>) =>
    apiRequest<Tournament>(`/api/tournaments/${id}`, "PUT", payload, true),

  deleteTournament: (id: string) =>
    apiRequest<void>(`/api/tournaments/${id}`, "DELETE", null, true),

  generateFixtures: (payload: GenerateFixturesPayload) =>
    apiRequest<Match[]>("/api/tournaments/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: GenerateSchedulePayload) =>
    apiRequest<SchedulingResponse>("/api/algorithms/scheduling", "POST", payload, true),

  saveSchedule: (schedule: SchedulingResponse) =>
    apiRequest<{ success: boolean; message: string }>("/api/schedule/save", "POST", schedule, true),

  getMatches: () =>
    apiRequest<Match[]>("/api/matches", "GET"),

  getMatchById: (id: string) =>
    apiRequest<Match>(`/api/matches/${id}`, "GET"),

  getMatchesByTournament: (tournamentId: string) =>
    apiRequest<Match[]>(`/api/matches/tournament/${tournamentId}`, "GET"),

  updateMatchScore: (id: string, score1: number, score2: number) =>
    apiRequest<Match>(`/api/matches/${id}/score`, "PUT", { score1, score2 }, true),

  updateMatchStatus: (id: string, status: Match["status"]) =>
    apiRequest<Match>(`/api/matches/${id}/status`, "PUT", { status }, true),

  assignCourt: (matchId: string, courtNumber: number, startTime: string, endTime: string) =>
    apiRequest<Match>(`/api/matches/${matchId}/court`, "PUT", {
      court: courtNumber,
      start_time: startTime,
      end_time: endTime,
    }, true),
};
