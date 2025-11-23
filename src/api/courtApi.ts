import { supabase } from "@/integrations/supabase/client";

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
  createCourt: async (payload: CreateCourtPayload) => {
    const { data, error } = await supabase
      .from("courts")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Court;
  },

  getCourts: async () => {
    const { data, error } = await supabase
      .from("courts")
      .select("*");

    if (error) throw error;
    return data as Court[];
  },

  getActiveCourts: async () => {
    // Assuming all courts are active for now as there is no status column in courts table
    const { data, error } = await supabase
      .from("courts")
      .select("*");

    if (error) throw error;
    return data as Court[];
  },

  getCourtById: async (id: string) => {
    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Court;
  },

  getCourtsByClub: async (clubId: string) => {
    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .eq("club_id", clubId);

    if (error) throw error;
    return data as Court[];
  },

  updateCourt: async (id: string, payload: Partial<CreateCourtPayload>) => {
    const { data, error } = await supabase
      .from("courts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Court;
  },

  deleteCourt: async (id: string) => {
    const { error } = await supabase
      .from("courts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
