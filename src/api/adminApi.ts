import { apiRequest } from "./base";
import { supabase } from "@/integrations/supabase/client";

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

export const adminApi = {
  login: async (payload: AdminLoginPayload) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) throw error;

    // Check if user has admin role
    // This assumes there's a way to check role, e.g. in metadata or a separate table.
    // For now, we just return the user as admin.
    const user = data.user;
    if (!user) throw new Error("Login failed");

    const adminData = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name || "Admin",
    };

    localStorage.setItem("admin_token", data.session.access_token);
    localStorage.setItem("admin", JSON.stringify(adminData));

    return {
      token: data.session.access_token,
      admin: adminData,
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
  },

  getCurrentAdmin: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name || "Admin",
    };
  },

  getStats: async () => {
    const [players, matches, clubs, bookings] = await Promise.all([
      supabase.from("players").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }),
      supabase.from("clubs").select("*", { count: "exact", head: true }),
      supabase.from("court_bookings").select("*", { count: "exact", head: true }),
    ]);

    return {
      total_players: players.count || 0,
      total_matches: matches.count || 0,
      total_clubs: clubs.count || 0,
      total_bookings: bookings.count || 0,
    };
  },
};
