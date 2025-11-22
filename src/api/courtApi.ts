import { apiRequest } from "./base";

export interface CreateCourtPayload {
  name: string;
  type: "indoor" | "outdoor";
  club_id: string;
}

export interface Court {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  club_id: string;
  created_at: string;
}

export const courtApi = {
  createCourt: (payload: CreateCourtPayload) =>
    apiRequest<Court>("/api/courts", "POST", payload, true),

  getCourts: () =>
    apiRequest<Court[]>("/api/courts", "GET"),

  getActiveCourts: () =>
    apiRequest<Court[]>("/api/courts/active", "GET"),

  getCourtById: (id: string) =>
    apiRequest<Court>(`/api/courts/${id}`, "GET"),

  getCourtsByClub: (clubId: string) =>
    apiRequest<Court[]>(`/api/courts/club/${clubId}`, "GET"),

  updateCourt: (id: string, payload: Partial<CreateCourtPayload>) =>
    apiRequest<Court>(`/api/courts/${id}`, "PUT", payload, true),

  deleteCourt: (id: string) =>
    apiRequest<void>(`/api/courts/${id}`, "DELETE", null, true),
};
