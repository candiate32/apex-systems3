import { apiRequest } from "./base";

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
  createBooking: (payload: CreateBookingPayload) =>
    apiRequest<Booking>("/booking/create", "POST", payload, true),

  getBookings: () =>
    apiRequest<Booking[]>("/booking", "GET", null, true),

  getBookingById: (id: string) =>
    apiRequest<Booking>(`/booking/${id}`, "GET", null, true),

  getCourtBookings: (courtId: string, date: string) =>
    apiRequest<Booking[]>(
      `/booking/court/${courtId}?date=${encodeURIComponent(date)}`,
      "GET"
    ),

  getUserBookings: () =>
    apiRequest<Booking[]>("/booking/user", "GET", null, true),

  cancelBooking: (id: string) =>
    apiRequest<Booking>(`/booking/${id}/cancel`, "PUT", null, true),

  checkAvailability: (courtId: string, date: string, startTime: string, endTime: string) =>
    apiRequest<{ available: boolean }>(
      `/booking/availability?court_id=${courtId}&date=${date}&start_time=${startTime}&end_time=${endTime}`,
      "GET"
    ),
};
