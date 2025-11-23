import { supabase } from "@/integrations/supabase/client";

export interface CreateBookingPayload {
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface Booking {
  id: string;
  court_id: string;
  court_name: string;
  club_id: string;
  club_name: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled";
  created_at: string;
}

export const bookingApi = {
  createBooking: async (payload: CreateBookingPayload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("court_bookings")
      .insert({
        court_id: payload.court_id,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        user_id: user.id,
        status: "confirmed", // Default status
      })
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Booking;
  },

  getBookings: async () => {
    const { data, error } = await supabase
      .from("court_bookings")
      .select("*");

    if (error) throw error;
    return data as unknown as Booking[];
  },

  getBookingById: async (id: string) => {
    const { data, error } = await supabase
      .from("court_bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as unknown as Booking;
  },

  getCourtBookings: async (courtId: string, date: string) => {
    const { data, error } = await supabase
      .from("court_bookings")
      .select("*")
      .eq("court_id", courtId)
      .eq("date", date);

    if (error) throw error;
    return data as unknown as Booking[];
  },

  getUserBookings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("court_bookings")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data as unknown as Booking[];
  },

  cancelBooking: async (id: string) => {
    const { data, error } = await supabase
      .from("court_bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Booking;
  },

  checkAvailability: async (courtId: string, date: string, startTime: string, endTime: string) => {
    const { data, error } = await supabase
      .from("court_bookings")
      .select("*")
      .eq("court_id", courtId)
      .eq("date", date)
      .neq("status", "cancelled");

    if (error) throw error;

    const isAvailable = !data.some((booking) => {
      // Simple overlap check
      return (
        (startTime >= booking.start_time && startTime < booking.end_time) ||
        (endTime > booking.start_time && endTime <= booking.end_time) ||
        (startTime <= booking.start_time && endTime >= booking.end_time)
      );
    });

    return { available: isAvailable };
  },
};
