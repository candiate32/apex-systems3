import { supabase } from "@/integrations/supabase/client";

export interface Registration {
  id: string;
  player_id: string;
  player_name: string;
  event_id: string;
  event_name: string;
  status: "pending" | "confirmed" | "cancelled";
  registered_at: string;
  partner_id?: string;
  partner_name?: string;
}

export interface CreateRegistrationPayload {
  player_id: string;
  event_id: string;
  partner_id?: string;
}

export const registrationsApi = {
  getRegistrations: async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*");

    if (error) throw error;
    return data as Registration[];
  },

  getRegistrationsByEvent: async (eventId: string) => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", eventId);

    if (error) throw error;
    return data as Registration[];
  },

  createRegistration: async (payload: CreateRegistrationPayload) => {
    // We might need to fetch player and event names if they are required in the response but not in the payload
    // For now, simple insert
    const { data, error } = await supabase
      .from("registrations")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Registration;
  },

  updateRegistrationStatus: async (id: string, status: Registration["status"]) => {
    const { data, error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Registration;
  },

  deleteRegistration: async (id: string) => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
