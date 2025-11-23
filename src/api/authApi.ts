import { supabase } from "@/integrations/supabase/client";

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
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    club_id?: string;
    club_name?: string;
  } | null;
  session: any;
  error?: any;
}

export const authApi = {
  registerUser: async (payload: RegisterUserPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          phone: payload.phone,
          club_id: payload.club_id,
        },
      },
    });

    if (error) throw error;

    return {
      user: data.user ? {
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email!,
        phone: data.user.user_metadata.phone,
        club_id: data.user.user_metadata.club_id,
      } : null,
      session: data.session,
    };
  },

  loginUser: async (payload: LoginUserPayload) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) throw error;

    return {
      user: data.user ? {
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email!,
        phone: data.user.user_metadata.phone,
        club_id: data.user.user_metadata.club_id,
      } : null,
      session: data.session,
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) return null;
    if (!user) return null;

    return {
      id: user.id,
      name: user.user_metadata.name,
      email: user.email!,
      phone: user.user_metadata.phone,
      club_id: user.user_metadata.club_id,
    };
  },
};
