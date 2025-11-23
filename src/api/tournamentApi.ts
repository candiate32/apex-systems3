import { apiRequest } from "./base";
import { supabase } from "@/integrations/supabase/client";
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
  tournament_id?: string; // Added this field assuming it exists in DB
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
  getTournaments: async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*");

    if (error) throw error;
    return data as Tournament[];
  },

  getTournamentById: async (id: string) => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Tournament;
  },

  createTournament: async (payload: CreateTournamentPayload) => {
    const { data, error } = await supabase
      .from("tournaments")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Tournament;
  },

  updateTournament: async (id: string, payload: Partial<CreateTournamentPayload>) => {
    const { data, error } = await supabase
      .from("tournaments")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Tournament;
  },

  deleteTournament: async (id: string) => {
    const { error } = await (supabase as any)
      .from("tournaments")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  generateFixtures: (payload: GenerateFixturesPayload) =>
    apiRequest<Match[]>("/api/tournaments/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: GenerateSchedulePayload) =>
    apiRequest<SchedulingResponse>("/api/algorithms/scheduling", "POST", payload, true),

  saveSchedule: async (schedule: SchedulingResponse) => {
    // Assuming 'schedules' table exists and matches the structure
    // This might need adjustment based on actual schema
    const { error } = await (supabase as any)
      .from("schedules")
      .insert(schedule as any); // Casting to any as structure might differ

    if (error) throw error;
    return { success: true, message: "Schedule saved" };
  },

  getMatches: async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*");

    if (error) throw error;
    return data as Match[];
  },

  getMatchById: async (id: string) => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Match;
  },

  getMatchesByTournament: async (tournamentId: string) => {
    // Assuming 'tournament_id' column exists in matches table
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId);

    if (error) throw error;
    return data as Match[];
  },

  updateMatchScore: async (id: string, score1: number, score2: number) => {
    const { data, error } = await supabase
      .from("matches")
      .update({ score: { player1: score1, player2: score2 } })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  },

  updateMatchStatus: async (id: string, status: Match["status"]) => {
    const { data, error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  },

  assignCourt: async (matchId: string, courtNumber: number, startTime: string, endTime: string) => {
    const { data, error } = await supabase
      .from("matches")
      .update({
        court: courtNumber,
        start_time: startTime,
        end_time: endTime,
      })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  },
};
