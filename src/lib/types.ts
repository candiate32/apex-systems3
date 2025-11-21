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
