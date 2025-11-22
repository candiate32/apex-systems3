import { apiRequest } from "./base";

export interface CreateClubPayload {
  name: string;
  location: string;
  logo_url?: string;
  about: string;
  contact: string;
  courts: {
    name: string;
    type: "indoor" | "outdoor";
  }[];
  social_links?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface Club {
  id: string;
  name: string;
  location: string;
  logo_url?: string;
  about: string;
  contact_info: string;
  player_count: number;
  courts: {
    id: string;
    name: string;
    type: "indoor" | "outdoor";
    club_id: string;
  }[];
  social_links?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  created_by: string;
  created_at: string;
}

export const clubApi = {
  createClub: (payload: CreateClubPayload) =>
    apiRequest<Club>("/api/clubs", "POST", payload, true),

  getClubs: () =>
    apiRequest<Club[]>("/api/clubs", "GET"),

  getClubById: (id: string) =>
    apiRequest<Club>(`/api/clubs/${id}`, "GET"),

  updateClub: (id: string, payload: Partial<CreateClubPayload>) =>
    apiRequest<Club>(`/api/clubs/${id}`, "PUT", payload, true),

  deleteClub: (id: string) =>
    apiRequest<void>(`/api/clubs/${id}`, "DELETE", null, true),

  searchClubs: (query: string) =>
    apiRequest<Club[]>(`/api/clubs/search?q=${encodeURIComponent(query)}`, "GET"),
};
