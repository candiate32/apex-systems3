import { supabase } from "@/integrations/supabase/client";

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
  registerPlayer: async (payload: RegisterPlayerPayload) => {
    const { data, error } = await supabase
      .from("players")
      .insert({
        name: payload.player_name,
        age: payload.age,
        phone: payload.phone,
        club: payload.club_name,
        gender: payload.gender,
        events: payload.events,
        partner_id: payload.partner_id,
        partner_name: payload.partner_name,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Player;
  },

  getPlayers: async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Player[];
  },

  getPlayerById: async (id: string) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Player;
  },

  updatePlayer: async (id: string, payload: Partial<RegisterPlayerPayload>) => {
    const updates: any = { ...payload };
    if (payload.player_name) updates.name = payload.player_name;
    if (payload.club_name) updates.club = payload.club_name;
    delete updates.player_name;
    delete updates.club_name;

    const { data, error } = await supabase
      .from("players")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Player;
  },

  deletePlayer: async (id: string) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  getPlayersByClub: async (clubId: string) => {
    // Assuming clubId corresponds to the club name or ID stored in 'club' column
    // The original API used clubId, but the table has 'club' (string). 
    // If clubId is actually the name, this works. If it's a UUID, we might need to join or check how it's stored.
    // Based on RegisterPlayerPayload, club_name is passed.
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("club", clubId);

    if (error) throw error;
    return data as Player[];
  },
};
