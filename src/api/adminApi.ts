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
    apiRequest<AdminAuthResponse>("/api/admin/login", "POST", payload).then((res) => {
      if (res.token) {
        localStorage.setItem("admin_token", res.token);
        localStorage.setItem("admin", JSON.stringify(res.admin));
      }
      return res;
    }),

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
  },

  getCurrentAdmin: () =>
    apiRequest<AdminAuthResponse["admin"]>("/api/admin/me", "GET", null, true),

  generateFixtures: (payload: { format: string; category: string }) =>
    apiRequest("/api/tournaments/generate-fixtures", "POST", payload, true),

  generateSchedule: (payload: {
    court_count: number;
    match_duration: number;
    rest_time: number;
    start_time: string;
  }) =>
    apiRequest("/api/algorithms/scheduling", "POST", payload, true),

  allocateCourts: (payload: AllocateCourtsPayload) =>
    apiRequest("/api/admin/allocate-courts", "POST", payload, true),

  getStats: () =>
    apiRequest<{
      total_players: number;
      total_matches: number;
      total_clubs: number;
      total_bookings: number;
    }>("/api/statistics", "GET", null, true),
};
