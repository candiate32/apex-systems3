import { apiRequest } from "./base";

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
  getRegistrations: () =>
    apiRequest<Registration[]>("/api/registrations", "GET", null, true),

  getRegistrationsByEvent: (eventId: string) =>
    apiRequest<Registration[]>(`/api/registrations/event/${eventId}`, "GET"),

  createRegistration: (payload: CreateRegistrationPayload) =>
    apiRequest<Registration>("/api/registrations", "POST", payload, true),

  updateRegistrationStatus: (id: string, status: Registration["status"]) =>
    apiRequest<Registration>(`/api/registrations/${id}`, "PUT", { status }, true),

  deleteRegistration: (id: string) =>
    apiRequest<void>(`/api/registrations/${id}`, "DELETE", null, true),
};
