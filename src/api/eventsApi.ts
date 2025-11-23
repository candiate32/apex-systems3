import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  name: string;
  type: "singles" | "doubles" | "mixed";
  category: string;
  age_group?: string;
  gender?: "male" | "female" | "mixed";
  max_participants?: number;
  registration_open: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface CreateEventPayload {
  name: string;
  type: "singles" | "doubles" | "mixed";
  category: string;
  age_group?: string;
  gender?: "male" | "female" | "mixed";
  max_participants?: number;
  registration_open?: boolean;
  start_date?: string;
  end_date?: string;
}

export const eventsApi = {
  getEvents: async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*");

    if (error) throw error;
    return data as Event[];
  },

  getEventById: async (id: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Event;
  },

  createEvent: async (payload: CreateEventPayload) => {
    const { data, error } = await supabase
      .from("events")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  updateEvent: async (id: string, payload: Partial<CreateEventPayload>) => {
    const { data, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  deleteEvent: async (id: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
