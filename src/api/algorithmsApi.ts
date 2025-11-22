import { apiRequest } from "./base";
import type { ScheduledPlayer, ScheduledMatchData, ScheduledCourt, ScheduledMatch } from "./tournamentApi";

// Pairing Algorithm
export interface PairingRequest {
  players: Array<{
    id: string;
    name: string;
    rating?: number;
  }>;
  rounds?: number;
}

export interface PairingResponse {
  pairings: Array<{
    round: number;
    matches: Array<{
      player1: string;
      player2: string;
    }>;
  }>;
}

// Grouping Algorithm
export interface GroupingRequest {
  players: string[];
  groups_count: number;
  seeding?: number[];
}

export interface GroupingResponse {
  groups: Array<{
    group_id: number;
    players: string[];
  }>;
}

// Knockout Algorithm
export interface KnockoutRequest {
  players: string[];
  seeding?: number[];
}

export interface KnockoutResponse {
  rounds: Array<{
    round: number;
    matches: Array<{
      match_id: string;
      player1: string | null;
      player2: string | null;
    }>;
  }>;
}

// Round Robin Algorithm
export interface RoundRobinRequest {
  players: string[];
}

export interface RoundRobinResponse {
  rounds: Array<{
    round: number;
    matches: Array<{
      player1: string;
      player2: string;
    }>;
  }>;
}

// Scheduling Algorithm
export interface SchedulingRequest {
  matches: Array<{
    id: string;
    player1: string;
    player2: string;
    duration?: number;
  }>;
  courts: Array<{
    id: string;
    name: string;
  }>;
  match_duration?: number;
  rest_time?: number;
  start_time?: string;
}

export interface SchedulingResponse {
  scheduled_matches: ScheduledMatch[];
  total_schedule_time: number;
  court_utilization: Record<string, number>;
  player_rest_violations: string[];
  scheduling_conflicts: string[];
}

// Match Code
export interface GenerateMatchCodeRequest {
  match_id: string;
}

export interface GenerateMatchCodeResponse {
  match_id: string;
  match_code: string;
  expires_at: string;
}

export interface ValidateMatchCodeRequest {
  match_code: string;
}

export interface ValidateMatchCodeResponse {
  valid: boolean;
  match_id?: string;
  message?: string;
}

export const algorithmsApi = {
  pairing: (payload: PairingRequest) =>
    apiRequest<PairingResponse>("/api/algorithms/pairing", "POST", payload, true),

  grouping: (payload: GroupingRequest) =>
    apiRequest<GroupingResponse>("/api/algorithms/grouping", "POST", payload, true),

  knockout: (payload: KnockoutRequest) =>
    apiRequest<KnockoutResponse>("/api/algorithms/knockout", "POST", payload, true),

  roundRobin: (payload: RoundRobinRequest) =>
    apiRequest<RoundRobinResponse>("/api/algorithms/round-robin", "POST", payload, true),

  scheduling: (payload: SchedulingRequest) =>
    apiRequest<SchedulingResponse>("/api/algorithms/scheduling", "POST", payload, true),

  generateMatchCode: (payload: GenerateMatchCodeRequest) =>
    apiRequest<GenerateMatchCodeResponse>("/api/algorithms/match-code", "POST", payload, true),

  validateMatchCode: (payload: ValidateMatchCodeRequest) =>
    apiRequest<ValidateMatchCodeResponse>("/api/algorithms/validate-match-code", "POST", payload, true),
};
