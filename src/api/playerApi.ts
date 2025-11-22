import { apiRequest } from "./base";

export interface RegisterPlayerPayload {
  player_name: string;
  age: number;
  phone: string;
  club_name: string;
  gender: "male" | "female";
  events: string[];
  partner_id?: string | null;
  partner_name?: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  phone: string;
  club: string;
  gender: "male" | "female";
  events: string[];
  partner_id?: string;
  partner_name?: string;
  created_at: string;
}

export const playerApi = {
  registerPlayer: (payload: RegisterPlayerPayload) =>
    apiRequest<Player>("/api/players", "POST", payload, true),

  getPlayers: () =>
    apiRequest<Player[]>("/api/players", "GET"),

  getPlayerById: (id: string) =>
    apiRequest<Player>(`/api/players/${id}`, "GET"),

  updatePlayer: (id: string, payload: Partial<RegisterPlayerPayload>) =>
    apiRequest<Player>(`/api/players/${id}`, "PUT", payload, true),

  deletePlayer: (id: string) =>
    apiRequest<void>(`/api/players/${id}`, "DELETE", null, true),

  getPlayersByClub: (clubId: string) =>
    apiRequest<Player[]>(`/api/players/club/${clubId}`, "GET"),
};
