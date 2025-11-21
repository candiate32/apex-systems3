import { apiRequest } from "./base";

export interface GenerateFixturesPayload {
  format: "knockout" | "round-robin";
  category: string;
  player_ids?: string[];
}

export interface GenerateSchedulePayload {
  court_count: number;
  match_duration: number;
  rest_time: number;
  start_time: string;
  match_ids: string[];
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

export interface Schedule {
  id: string;
  court_count: number;
  match_duration: number;
  rest_time: number;
  start_time: string;
  matches: Match[];
  created_at: string;
}

export const tournamentApi = {
  generateFixtures: (payload: GenerateFixturesPayload) =>
    apiRequest<Match[]>("/tournament/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: GenerateSchedulePayload) =>
    apiRequest<Schedule>("/tournament/generate-schedule", "POST", payload, true),

  getMatches: () =>
    apiRequest<Match[]>("/tournament/matches", "GET"),

  getMatchById: (id: string) =>
    apiRequest<Match>(`/tournament/matches/${id}`, "GET"),

  updateMatchScore: (id: string, score1: number, score2: number) =>
    apiRequest<Match>(`/tournament/matches/${id}/score`, "PUT", { score1, score2 }, true),

  updateMatchStatus: (id: string, status: Match["status"]) =>
    apiRequest<Match>(`/tournament/matches/${id}/status`, "PUT", { status }, true),

  assignCourt: (matchId: string, courtNumber: number, startTime: string, endTime: string) =>
    apiRequest<Match>(`/tournament/matches/${matchId}/court`, "PUT", {
      court: courtNumber,
      start_time: startTime,
      end_time: endTime,
    }, true),

  getSchedule: () =>
    apiRequest<Schedule>("/tournament/schedule", "GET"),
};
