import { apiRequest } from "./base";

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
  getEvents: () =>
    apiRequest<Event[]>("/api/events", "GET"),

  getEventById: (id: string) =>
    apiRequest<Event>(`/api/events/${id}`, "GET"),

  createEvent: (payload: CreateEventPayload) =>
    apiRequest<Event>("/api/events", "POST", payload, true),

  updateEvent: (id: string, payload: Partial<CreateEventPayload>) =>
    apiRequest<Event>(`/api/events/${id}`, "PUT", payload, true),

  deleteEvent: (id: string) =>
    apiRequest<void>(`/api/events/${id}`, "DELETE", null, true),
};
