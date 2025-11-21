import { apiRequest } from "./base";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AllocateCourtsPayload {
  session_id: string;
  court_count: number;
}

export const adminApi = {
  login: (payload: AdminLoginPayload) =>
    apiRequest<AdminAuthResponse>("/admin/login", "POST", payload),

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
  },

  getCurrentAdmin: () =>
    apiRequest<AdminAuthResponse["admin"]>("/admin/me", "GET", null, true),

  generateFixtures: (payload: { format: string; category: string }) =>
    apiRequest("/admin/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: {
    court_count: number;
    match_duration: number;
    rest_time: number;
    start_time: string;
  }) =>
    apiRequest("/admin/generate-schedule", "POST", payload, true),

  allocateCourts: (payload: AllocateCourtsPayload) =>
    apiRequest("/admin/allocate-courts", "POST", payload, true),

  getStats: () =>
    apiRequest<{
      total_players: number;
      total_matches: number;
      total_clubs: number;
      total_bookings: number;
    }>("/admin/stats", "GET", null, true),
};
