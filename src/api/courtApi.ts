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
    apiRequest<Court>("/courts/create", "POST", payload, true),

  getCourts: () =>
    apiRequest<Court[]>("/courts", "GET"),

  getCourtById: (id: string) =>
    apiRequest<Court>(`/courts/${id}`, "GET"),

  getCourtsByClub: (clubId: string) =>
    apiRequest<Court[]>(`/courts/club/${clubId}`, "GET"),

  updateCourt: (id: string, payload: Partial<CreateCourtPayload>) =>
    apiRequest<Court>(`/courts/${id}`, "PUT", payload, true),

  deleteCourt: (id: string) =>
    apiRequest<void>(`/courts/${id}`, "DELETE", null, true),
};
