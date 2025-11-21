import { apiRequest } from "./base";

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

export interface SchedulingResponse {
  scheduled_matches: ScheduledMatch[];
  total_schedule_time: number;
  court_utilization: { [courtId: string]: number };
  player_rest_violations: string[];
  scheduling_conflicts: string[];
}

export const tournamentApi = {
  generateFixtures: (payload: GenerateFixturesPayload) =>
    apiRequest<Match[]>("/tournament/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: GenerateSchedulePayload) =>
    apiRequest<SchedulingResponse>("/schedule/generate", "POST", payload, true),

  saveSchedule: (schedule: SchedulingResponse) =>
    apiRequest<{ success: boolean; message: string }>("/schedule/save", "POST", schedule, true),

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
};
