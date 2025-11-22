import { apiRequest } from "./base";

export interface Statistics {
  total_players: number;
  total_matches: number;
  total_clubs: number;
  total_courts: number;
  total_tournaments: number;
  active_tournaments: number;
  completed_matches: number;
  pending_matches: number;
  total_registrations: number;
  active_courts: number;
}

export const statisticsApi = {
  getStatistics: () =>
    apiRequest<Statistics>("/api/statistics", "GET"),
};
