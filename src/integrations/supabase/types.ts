export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clubs: {
        Row: {
          about: string | null
          contact_info: string | null
          created_at: string | null
          created_by: string | null
          id: string
          location: string
          logo_url: string | null
          name: string
          player_count: number | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          contact_info?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location: string
          logo_url?: string | null
          name: string
          player_count?: number | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          contact_info?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string
          logo_url?: string | null
          name?: string
          player_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      court_bookings: {
        Row: {
          court_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          start_time: string
          status: string | null
          user_id: string
        }
        Insert: {
          court_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          start_time: string
          status?: string | null
          user_id: string
        }
        Update: {
          court_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          start_time?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "courts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_group: string | null
          category: string
          created_at: string
          end_date: string | null
          gender: "male" | "female" | "mixed" | null
          id: string
          max_participants: number | null
          name: string
          registration_open: boolean
          start_date: string | null
          type: "singles" | "doubles" | "mixed"
        }
        Insert: {
          age_group?: string | null
          category: string
          created_at?: string
          end_date?: string | null
          gender?: "male" | "female" | "mixed" | null
          id?: string
          max_participants?: number | null
          name: string
          registration_open?: boolean
          start_date?: string | null
          type: "singles" | "doubles" | "mixed"
        }
        Update: {
          age_group?: string | null
          category?: string
          created_at?: string
          end_date?: string | null
          gender?: "male" | "female" | "mixed" | null
          id?: string
          max_participants?: number | null
          name?: string
          registration_open?: boolean
          start_date?: string | null
          type?: "singles" | "doubles" | "mixed"
        }
        Relationships: []
      }
      matches: {
        Row: {
          category: string
          code: string
          court: number | null
          created_at: string | null
          end_time: string | null
          event_type: string
          id: string
          player1: string
          player2: string
          round: string | null
          score: Json | null
          start_time: string | null
          status: string | null
          winner: string | null
          tournament_id: string | null
        }
        Insert: {
          category: string
          code: string
          court?: number | null
          created_at?: string | null
          end_time?: string | null
          event_type: string
          id?: string
          player1: string
          player2: string
          round?: string | null
          score?: Json | null
          start_time?: string | null
          status?: string | null
          winner?: string | null
          tournament_id?: string | null
        }
        Update: {
          category?: string
          code?: string
          court?: number | null
          created_at?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          player1?: string
          player2?: string
          round?: string | null
          score?: Json | null
          start_time?: string | null
          status?: string | null
          winner?: string | null
          tournament_id?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number
          club: string
          created_at: string | null
          events: Json
          gender: string
          id: string
          name: string
          partner_id: string | null
          partner_name: string | null
          phone: string
        }
        Insert: {
          age: number
          club: string
          created_at?: string | null
          events?: Json
          gender: string
          id?: string
          name: string
          partner_id?: string | null
          partner_name?: string | null
          phone: string
        }
        Update: {
          age?: number
          club?: string
          created_at?: string | null
          events?: Json
          gender?: string
          id?: string
          name?: string
          partner_id?: string | null
          partner_name?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          club_id: string | null
          created_at: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          id: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_matches: {
        Row: {
          court_data: Json
          created_at: string | null
          id: string
          match_data: Json
          schedule_id: string
          scheduled_end_time: string
          scheduled_start_time: string
          status: string
        }
        Insert: {
          court_data: Json
          created_at?: string | null
          id?: string
          match_data: Json
          schedule_id: string
          scheduled_end_time: string
          scheduled_start_time: string
          status?: string
        }
        Update: {
          court_data?: Json
          created_at?: string | null
          id?: string
          match_data?: Json
          schedule_id?: string
          scheduled_end_time?: string
          scheduled_start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_matches_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          court_utilization: Json
          created_at: string | null
          created_by: string | null
          id: string
          player_rest_violations: string[] | null
          scheduling_conflicts: string[] | null
          total_schedule_time: number
          updated_at: string | null
        }
        Insert: {
          court_utilization?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          player_rest_violations?: string[] | null
          scheduling_conflicts?: string[] | null
          total_schedule_time: number
          updated_at?: string | null
        }
        Update: {
          court_utilization?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          player_rest_violations?: string[] | null
          scheduling_conflicts?: string[] | null
          total_schedule_time?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          player_id: string
          player_name: string
          event_id: string
          event_name: string
          status: "pending" | "confirmed" | "cancelled"
          registered_at: string
          partner_id: string | null
          partner_name: string | null
        }
        Insert: {
          id?: string
          player_id: string
          player_name?: string
          event_id: string
          event_name?: string
          status?: "pending" | "confirmed" | "cancelled"
          registered_at?: string
          partner_id?: string | null
          partner_name?: string | null
        }
        Update: {
          id?: string
          player_id?: string
          player_name?: string
          event_id?: string
          event_name?: string
          status?: "pending" | "confirmed" | "cancelled"
          registered_at?: string
          partner_id?: string | null
          partner_name?: string | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          id: string
          name: string
          format: "knockout" | "round-robin" | "mixed"
          category: string
          status: "upcoming" | "ongoing" | "completed"
          start_date: string | null
          end_date: string | null
          max_participants: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          format: "knockout" | "round-robin" | "mixed"
          category: string
          status?: "upcoming" | "ongoing" | "completed"
          start_date?: string | null
          end_date?: string | null
          max_participants?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          format?: "knockout" | "round-robin" | "mixed"
          category?: string
          status?: "upcoming" | "ongoing" | "completed"
          start_date?: string | null
          end_date?: string | null
          max_participants?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
