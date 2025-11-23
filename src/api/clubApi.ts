import { supabase } from "@/integrations/supabase/client";

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
  createClub: async (payload: CreateClubPayload) => {
    // 1. Create Club
    const { data: clubData, error: clubError } = await supabase
      .from("clubs")
      .insert({
        name: payload.name,
        location: payload.location,
        logo_url: payload.logo_url,
        about: payload.about,
        contact_info: payload.contact,
        // social_links are not in the table schema from types.ts, ignoring for now or assuming they might be added later
        // created_by should be handled by RLS or trigger, but if needed we can get current user
      })
      .select()
      .single();

    if (clubError) throw clubError;

    // 2. Create Courts
    if (payload.courts && payload.courts.length > 0) {
      const courtsToInsert = payload.courts.map((court) => ({
        club_id: clubData.id,
        name: court.name,
        type: court.type,
      }));

      const { error: courtsError } = await supabase
        .from("courts")
        .insert(courtsToInsert);

      if (courtsError) throw courtsError;
    }

    // Return the full club object (we might need to fetch it again to get courts, or construct it)
    // For simplicity, fetching it again
    return clubApi.getClubById(clubData.id);
  },

  getClubs: async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*, courts(*)");

    if (error) throw error;

    // Map to match Club interface if needed, but Supabase returns structure close to it.
    // courts will be an array.
    return data as unknown as Club[];
  },

  getClubById: async (id: string) => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*, courts(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as unknown as Club;
  },

  updateClub: async (id: string, payload: Partial<CreateClubPayload>) => {
    const updates: any = { ...payload };
    if (payload.contact) updates.contact_info = payload.contact;
    delete updates.contact;
    delete updates.courts; // Handle courts separately if needed, but update usually just updates club details

    const { data, error } = await supabase
      .from("clubs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Club;
  },

  deleteClub: async (id: string) => {
    const { error } = await supabase
      .from("clubs")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  searchClubs: async (query: string) => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*, courts(*)")
      .ilike("name", `%${query}%`);

    if (error) throw error;
    return data as unknown as Club[];
  },
};
