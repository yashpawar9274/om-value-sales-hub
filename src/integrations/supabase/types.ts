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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: string | null
          id: string
          lead_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bookings: {
        Row: {
          agreement_status: string
          booking_amount: number
          booking_date: string
          created_at: string
          created_by: string
          document_urls: string[]
          id: string
          lead_id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          project_name: string | null
          received_amount: number
          unit_number: string | null
          updated_at: string
        }
        Insert: {
          agreement_status?: string
          booking_amount?: number
          booking_date?: string
          created_at?: string
          created_by: string
          document_urls?: string[]
          id?: string
          lead_id: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          project_name?: string | null
          received_amount?: number
          unit_number?: string | null
          updated_at?: string
        }
        Update: {
          agreement_status?: string
          booking_amount?: number
          booking_date?: string
          created_at?: string
          created_by?: string
          document_urls?: string[]
          id?: string
          lead_id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          project_name?: string | null
          received_amount?: number
          unit_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_forms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          fields: Json
          id: string
          is_active: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiry_submissions: {
        Row: {
          created_at: string
          customer_name: string
          data: Json
          form_id: string | null
          id: string
          lead_id: string | null
          mobile: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          data?: Json
          form_id?: string | null
          id?: string
          lead_id?: string | null
          mobile: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          data?: Json
          form_id?: string | null
          id?: string
          lead_id?: string | null
          mobile?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "enquiry_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_submissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          due_at: string
          id: string
          lead_id: string
          notes: string | null
          outcome: string | null
          status: Database["public"]["Enums"]["followup_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          due_at: string
          id?: string
          lead_id: string
          notes?: string | null
          outcome?: string | null
          status?: Database["public"]["Enums"]["followup_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          outcome?: string | null
          status?: Database["public"]["Enums"]["followup_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          lead_id: string
          note: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          lead_id: string
          note: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          alternate_mobile: string | null
          assigned_to: string | null
          budget: number | null
          configuration: string | null
          created_at: string
          created_by: string
          customer_name: string
          email: string | null
          id: string
          location: string | null
          mobile: string
          notes: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          alternate_mobile?: string | null
          assigned_to?: string | null
          budget?: number | null
          configuration?: string | null
          created_at?: string
          created_by: string
          customer_name: string
          email?: string | null
          id?: string
          location?: string | null
          mobile: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          alternate_mobile?: string | null
          assigned_to?: string | null
          budget?: number | null
          configuration?: string | null
          created_at?: string
          created_by?: string
          customer_name?: string
          email?: string | null
          id?: string
          location?: string | null
          mobile?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          lead_id: string | null
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          lead_id?: string | null
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          lead_id?: string | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform?: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          feedback: string | null
          id: string
          interested_unit: string | null
          lead_id: string
          location: string | null
          next_action: string | null
          project_name: string | null
          status: Database["public"]["Enums"]["visit_status"]
          updated_at: string
          visit_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          feedback?: string | null
          id?: string
          interested_unit?: string | null
          lead_id: string
          location?: string | null
          next_action?: string | null
          project_name?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_at: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          feedback?: string | null
          id?: string
          interested_unit?: string | null
          lead_id?: string
          location?: string | null
          next_action?: string | null
          project_name?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actor_name: { Args: { _user_id: string }; Returns: string }
      can_access_lead: { Args: { _lead_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_manager: { Args: { _user_id: string }; Returns: boolean }
      notify_user: {
        Args: {
          _actor_id: string
          _body: string
          _lead_id: string
          _link: string
          _title: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "executive"
      followup_status: "pending" | "completed" | "missed" | "rescheduled"
      lead_priority: "high" | "medium" | "low"
      lead_source:
        | "facebook"
        | "instagram"
        | "google"
        | "whatsapp"
        | "walk_in"
        | "reference"
        | "property_portal"
        | "others"
      lead_status:
        | "new"
        | "contacted"
        | "interested"
        | "follow_up"
        | "site_visit_scheduled"
        | "visited"
        | "negotiation"
        | "booked"
        | "lost"
        | "hold"
      payment_status: "pending" | "partial" | "completed" | "cancelled"
      visit_status: "scheduled" | "completed" | "cancelled" | "no_show"
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
      app_role: ["admin", "manager", "executive"],
      followup_status: ["pending", "completed", "missed", "rescheduled"],
      lead_priority: ["high", "medium", "low"],
      lead_source: [
        "facebook",
        "instagram",
        "google",
        "whatsapp",
        "walk_in",
        "reference",
        "property_portal",
        "others",
      ],
      lead_status: [
        "new",
        "contacted",
        "interested",
        "follow_up",
        "site_visit_scheduled",
        "visited",
        "negotiation",
        "booked",
        "lost",
        "hold",
      ],
      payment_status: ["pending", "partial", "completed", "cancelled"],
      visit_status: ["scheduled", "completed", "cancelled", "no_show"],
    },
  },
} as const
