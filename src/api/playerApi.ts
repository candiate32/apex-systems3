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
    apiRequest<Player>("/players/register", "POST", payload, true),

  getPlayers: () =>
    apiRequest<Player[]>("/players", "GET"),

  getPlayerById: (id: string) =>
    apiRequest<Player>(`/players/${id}`, "GET"),

  updatePlayer: (id: string, payload: Partial<RegisterPlayerPayload>) =>
    apiRequest<Player>(`/players/${id}`, "PUT", payload, true),

  deletePlayer: (id: string) =>
    apiRequest<void>(`/players/${id}`, "DELETE", null, true),

  getPlayersByClub: (clubId: string) =>
    apiRequest<Player[]>(`/players/club/${clubId}`, "GET"),
};
