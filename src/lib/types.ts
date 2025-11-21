export type EventType = "singles" | "doubles" | "mixed-doubles";
export type Gender = "male" | "female";
export type AgeCategory = "U13" | "U15" | "U17" | "Open";
export type TournamentFormat = "knockout" | "round-robin";

export interface Player {
  id: string;
  name: string;
  age: number;
  phone: string;
  club: string;
  gender: Gender;
  events: EventType[];
  partnerId?: string;
  partnerName?: string;
}

export interface Match {
  id: string;
  code: string;
  player1: string;
  player2: string;
  eventType: string;
  category: string;
  court?: number;
  startTime?: string;
  endTime?: string;
  round?: string;
  status: "pending" | "ongoing" | "completed";
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
}

export interface Court {
  id: number;
  currentMatch?: Match;
  nextMatch?: Match;
}

export interface Schedule {
  courtCount: number;
  matchDuration: number;
  restTime: number;
  startTime: string;
  matches: Match[];
}

// Scheduling System Types
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
  scheduled_start_time: string; // ISO datetime string
  scheduled_end_time: string; // ISO datetime string
  status: "scheduled" | "pending" | "ongoing" | "completed";
}

export interface CourtUtilization {
  [courtId: string]: number; // percentage as float
}

export interface SchedulingResponse {
  scheduled_matches: ScheduledMatch[];
  total_schedule_time: number; // in minutes
  court_utilization: CourtUtilization;
  player_rest_violations: string[];
  scheduling_conflicts: string[];
}

export interface GenerateSchedulePayload {
  player_ids: string[];
  court_ids: string[];
  match_duration: number;
  rest_time: number;
  start_time: string;
}

export interface Club {
  id: string;
  name: string;
  logo?: string;
  location: string;
  about: string;
  playerCount: number;
  courts: ClubCourt[];
  contactInfo: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  createdBy: string;
  members: string[];
}

export interface ClubCourt {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  clubId: string;
}

export interface CourtBooking {
  id: string;
  courtId: string;
  courtName: string;
  clubId: string;
  clubName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  clubId?: string;
  clubName?: string;
  role: "user" | "admin";
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}
