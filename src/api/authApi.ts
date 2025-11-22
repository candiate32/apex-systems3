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
  access_token: string;
  token_type: string;
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
    apiRequest<AuthResponse>("/api/auth/register", "POST", payload).then((res) => {
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      return res;
    }),

  loginUser: (payload: LoginUserPayload) =>
    apiRequest<AuthResponse>("/api/auth/login", "POST", payload).then((res) => {
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      return res;
    }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () =>
    apiRequest<AuthResponse["user"]>("/api/auth/me", "GET", null, true),
};
