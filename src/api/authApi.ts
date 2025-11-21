import { apiRequest } from "./base";

export interface RegisterUserPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  club_id?: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    club_id?: string;
    club_name?: string;
  };
}

export const authApi = {
  registerUser: (payload: RegisterUserPayload) =>
    apiRequest<AuthResponse>("/auth/register", "POST", payload),

  loginUser: (payload: LoginUserPayload) =>
    apiRequest<AuthResponse>("/auth/login", "POST", payload),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () =>
    apiRequest<AuthResponse["user"]>("/auth/me", "GET", null, true),
};
