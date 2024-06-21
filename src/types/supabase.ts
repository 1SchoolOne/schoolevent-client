export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appointment_comments: {
        Row: {
          appointment_id: number
          author_id: string
          content: string
          created_at: string
          id: number
          updated_at: string | null
        }
        Insert: {
          appointment_id: number
          author_id: string
          content: string
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          appointment_id?: number
          author_id?: string
          content?: string
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_comments_appointment_id_fkey"
            columns: ["appointment_id"]
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      appointments: {
        Row: {
          apt_status: Database["public"]["Enums"]["apt_status"]
          apt_type: string | null
          assignee: string | null
          author_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contacted_date: string | null
          created_at: string
          id: number
          note: string | null
          planned_date: string | null
          school_address: string
          school_city: string
          school_name: string
          school_postal_code: string
        }
        Insert: {
          apt_status: Database["public"]["Enums"]["apt_status"]
          apt_type?: string | null
          assignee?: string | null
          author_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contacted_date?: string | null
          created_at?: string
          id?: number
          note?: string | null
          planned_date?: string | null
          school_address: string
          school_city: string
          school_name: string
          school_postal_code: string
        }
        Update: {
          apt_status?: Database["public"]["Enums"]["apt_status"]
          apt_type?: string | null
          assignee?: string | null
          author_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contacted_date?: string | null
          created_at?: string
          id?: number
          note?: string | null
          planned_date?: string | null
          school_address?: string
          school_city?: string
          school_name?: string
          school_postal_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assignee_fkey"
            columns: ["assignee"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appointments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          city: string
          created_at: string
          id: number
          latitude: string | null
          longitude: string | null
          mail: string | null
          postal_code: string
          school_name: string
          school_type: string
          telephone: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          id?: number
          latitude?: string | null
          longitude?: string | null
          mail?: string | null
          postal_code: string
          school_name: string
          school_type: string
          telephone?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          id?: number
          latitude?: string | null
          longitude?: string | null
          mail?: string | null
          postal_code?: string
          school_name?: string
          school_type?: string
          telephone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          event_address: string
          event_assignee: string | null
          event_background: string | null
          event_creator_id: string
          event_date: string
          event_description: string
          event_duration: number
          event_points: number | null
          event_school_name: string
          event_title: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: number
        }
        Insert: {
          event_address: string
          event_assignee?: string | null
          event_background?: string | null
          event_creator_id: string
          event_date: string
          event_description: string
          event_duration: number
          event_points?: number | null
          event_school_name: string
          event_title: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: number
        }
        Update: {
          event_address?: string
          event_assignee?: string | null
          event_background?: string | null
          event_creator_id?: string
          event_date?: string
          event_description?: string
          event_duration?: number
          event_points?: number | null
          event_school_name?: string
          event_title?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_event_assignee_fkey"
            columns: ["event_assignee"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "events_event_creator_id_fkey"
            columns: ["event_creator_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      events_participants: {
        Row: {
          event_id: number
          id: number
          status:
            | Database["public"]["Enums"]["events_participants_status"]
            | null
          user_id: string
        }
        Insert: {
          event_id: number
          id?: number
          status?:
            | Database["public"]["Enums"]["events_participants_status"]
            | null
          user_id: string
        }
        Update: {
          event_id?: number
          id?: number
          status?:
            | Database["public"]["Enums"]["events_participants_status"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_participants_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      favorites: {
        Row: {
          contact_id: number | null
          created_at: string | null
          id: string
          school_city: string
          school_id: string | null
          school_name: string
          school_postal_code: string
          user_id: string
        }
        Insert: {
          contact_id?: number | null
          created_at?: string | null
          id?: string
          school_city: string
          school_id?: string | null
          school_name: string
          school_postal_code: string
          user_id: string
        }
        Update: {
          contact_id?: number | null
          created_at?: string | null
          id?: string
          school_city?: string
          school_id?: string | null
          school_name?: string
          school_postal_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rewards: {
        Row: {
          id: number
          reward_background: string | null
          reward_name: string
          reward_number: number
          reward_points: number
        }
        Insert: {
          id?: number
          reward_background?: string | null
          reward_name: string
          reward_number: number
          reward_points: number
        }
        Update: {
          id?: number
          reward_background?: string | null
          reward_name?: string
          reward_number?: number
          reward_points?: number
        }
        Relationships: []
      }
      students: {
        Row: {
          course_id: number | null
          created_at: string
          id: number
          last_event: string | null
          phone: string | null
          points: number
          user_id: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          id?: number
          last_event?: string | null
          phone?: string | null
          points?: number
          user_id: string
        }
        Update: {
          course_id?: number | null
          created_at?: string
          id?: number
          last_event?: string | null
          phone?: string | null
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      students_reward: {
        Row: {
          claimed_at: string | null
          id: number
          quantity: number
          reward_id: number
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          id?: number
          quantity: number
          reward_id: number
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          id?: number
          quantity?: number
          reward_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_reward_reward_id_fkey"
            columns: ["reward_id"]
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_reward_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          approved: boolean | null
          created_at: string
          email: string
          id: number
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          email: string
          id?: number
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          email?: string
          id?: number
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points_for_past_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_reward: {
        Args: {
          rewardid: number
          qty: number
        }
        Returns: undefined
      }
    }
    Enums: {
      apt_status: "to_contact" | "contacted" | "planned"
      event_type: "open_day" | "presentation" | "conference"
      events_participants_status: "pending" | "approved" | "completed"
      user_role: "student" | "manager" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
