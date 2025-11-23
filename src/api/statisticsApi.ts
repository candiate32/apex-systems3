import { supabase } from "@/integrations/supabase/client";

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
  getStatistics: async () => {
    const [
      players,
      matches,
      clubs,
      courts,
      tournaments,
      registrations,
    ] = await Promise.all([
      supabase.from("players").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }),
      supabase.from("clubs").select("*", { count: "exact", head: true }),
      supabase.from("courts").select("*", { count: "exact", head: true }),
      (supabase as any).from("tournaments").select("*", { count: "exact", head: true }),
      supabase.from("registrations").select("*", { count: "exact", head: true }),
    ]);

    // For more granular stats like active_tournaments, we would need to filter.
    // Assuming simple counts for now or implementing filters if critical.

    return {
      total_players: players.count || 0,
      total_matches: matches.count || 0,
      total_clubs: clubs.count || 0,
      total_courts: courts.count || 0,
      total_tournaments: tournaments.count || 0,
      active_tournaments: 0, // Placeholder or need filter
      completed_matches: 0, // Placeholder or need filter
      pending_matches: 0, // Placeholder or need filter
      total_registrations: registrations.count || 0,
      active_courts: courts.count || 0,
    } as Statistics;
  },
};
