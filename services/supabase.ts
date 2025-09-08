
// supabase-schema.ts
// FIX: Added the `Relationships` property back to all table definitions with foreign keys. This property is essential for the Supabase client's type inference. Its complete removal was causing all table-related types to be inferred as `never`, resulting in widespread compilation errors.
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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  net: {
    Tables: {
      _http_response: {
        Row: {
          content: string | null
          content_type: string | null
          created: string
          error_msg: string | null
          headers: Json | null
          id: number | null
          status_code: number | null
          timed_out: boolean | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created?: string
          error_msg?: string | null
          headers?: Json | null
          id?: number | null
          status_code?: number | null
          timed_out?: boolean | null
        }
        Relationships: []
      }
      http_request_queue: {
        Row: {
          body: string | null
          headers: Json
          id: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Insert: {
          body?: string | null
          headers: Json
          id?: number
          method: string
          timeout_milliseconds: number
          url: string
        }
        Update: {
          body?: string | null
          headers?: Json
          id?: number
          method?: string
          timeout_milliseconds?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _await_response: {
        Args: { request_id: number }
        Returns: boolean
      }
      _encode_url_with_params_array: {
        Args: { params_array: string[]; url: string }
        Returns: string
      }
      _http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      _urlencode_string: {
        Args: { string: string }
        Returns: string
      }
      check_worker_is_up: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      http_collect_response: {
        Args: { async?: boolean; request_id: number }
        Returns: Database["net"]["CompositeTypes"]["http_response_result"]
      }
      http_delete: {
        Args: {
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_get: {
        Args: {
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      http_post: {
        Args: {
          body?: Json
          headers?: Json
          params?: Json
          timeout_milliseconds?: number
          url: string
        }
        Returns: number
      }
      worker_restart: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      request_status: "PENDING" | "SUCCESS" | "ERROR"
    }
    CompositeTypes: {
      http_response: {
        status_code: number | null
        headers: Json | null
        body: string | null
      }
      http_response_result: {
        status: Database["net"]["Enums"]["request_status"] | null
        message: string | null
        response: Database["net"]["CompositeTypes"]["http_response"] | null
      }
    }
  }
  public: {
    Tables: {
      app_e255c3cdb5_bookings: {
        Row: {
          agreed_rate: number
          booking_status: string | null
          business_user_id: string
          created_at: string
          dj_user_id: string
          gig_id: string
          id: string
          payment_status: string | null
          special_requests: string | null
          updated_at: string
        }
        Insert: {
          agreed_rate: number
          booking_status?: string | null
          business_user_id: string
          created_at?: string
          dj_user_id: string
          gig_id: string
          id?: string
          payment_status?: string | null
          special_requests?: string | null
          updated_at?: string
        }
        Update: {
          agreed_rate?: number
          booking_status?: string | null
          business_user_id?: string
          created_at?: string
          dj_user_id?: string
          gig_id?: string
          id?: string
          payment_status?: string | null
          special_requests?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_bookings_business_user_id_fkey"
            columns: ["business_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_bookings_dj_user_id_fkey"
            columns: ["dj_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_bookings_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      app_e255c3cdb5_business_profiles: {
        Row: {
          address: string | null
          business_type: string | null
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          rating: number | null
          reviews_count: number | null
          // FIX: Added missing 'socials' column.
          socials: Json | null
          typical_event_types: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          rating?: number | null
          reviews_count?: number | null
          // FIX: Added missing 'socials' column.
          socials?: Json | null
          typical_event_types?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_type?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          rating?: number | null
          reviews_count?: number | null
          // FIX: Added missing 'socials' column.
          socials?: Json | null
          typical_event_types?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "business_profiles_user_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_profiles_user_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_business_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_dj_profiles: {
        Row: {
          availability_schedule: Json | null
          bio: string | null
          created_at: string
          equipment_owned: Json | null
          experience_years: number | null
          genres: Json | null
          hourly_rate: number | null
          id: string
          portfolio_tracks: Json | null
          rating: number | null
          reviews_count: number | null
          // FIX: Added missing 'socials' column.
          socials: Json | null
          // FIX: Added missing 'tier' column.
          tier: Database["public"]["Enums"]["dj_tier"] | null
          travel_radius: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_schedule?: Json | null
          bio?: string | null
          created_at?: string
          equipment_owned?: Json | null
          experience_years?: number | null
          genres?: Json | null
          hourly_rate?: number | null
          id?: string
          portfolio_tracks?: Json | null
          rating?: number | null
          reviews_count?: number | null
          // FIX: Added missing 'socials' column.
          socials?: Json | null
          // FIX: Added missing 'tier' column.
          tier?: Database["public"]["Enums"]["dj_tier"] | null
          travel_radius?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_schedule?: Json | null
          bio?: string | null
          created_at?: string
          equipment_owned?: Json | null
          experience_years?: number | null
          genres?: Json | null
          hourly_rate?: number | null
          id?: string
          portfolio_tracks?: Json | null
          rating?: number | null
          reviews_count?: number | null
          // FIX: Added missing 'socials' column.
          socials?: Json | null
          // FIX: Added missing 'tier' column.
          tier?: Database["public"]["Enums"]["dj_tier"] | null
          travel_radius?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_dj_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "dj_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dj_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_dj_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_follows_follower_id"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "fk_follows_following_id"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_gig_applications: {
        Row: {
          created_at: string
          dj_user_id: string
          gig_id: string
          id: string
          message: string | null
          proposed_rate: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dj_user_id: string
          gig_id: string
          id?: string
          message?: string | null
          proposed_rate?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dj_user_id?: string
          gig_id?: string
          id?: string
          message?: string | null
          proposed_rate?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_gig_applications_dj_user_id_fkey"
            columns: ["dj_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_gig_applications_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      app_e255c3cdb5_gigs: {
        Row: {
          booked_dj_id: string | null
          budget: number | null
          business_user_id: string
          created_at: string
          date: string | null
          description: string | null
          duration_hours: number | null
          flyer_url: string | null
          genres: Json | null
          id: string
          interest_count: number
          location: string | null
          required_equipment: Json | null
          status: string | null
          time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          booked_dj_id?: string | null
          budget?: number | null
          business_user_id: string
          created_at?: string
          date?: string | null
          description?: string | null
          duration_hours?: number | null
          flyer_url?: string | null
          genres?: Json | null
          id?: string
          interest_count?: number
          location?: string | null
          required_equipment?: Json | null
          status?: string | null
          time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          booked_dj_id?: string | null
          budget?: number | null
          business_user_id?: string
          created_at?: string
          date?: string | null
          description?: string | null
          duration_hours?: number | null
          flyer_url?: string | null
          genres?: Json | null
          id?: string
          interest_count?: number
          location?: string | null
          required_equipment?: Json | null
          status?: string | null
          time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_gigs_booked_dj_id_fkey"
            columns: ["booked_dj_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_dj_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_gigs_booked_dj_id_fkey"
            columns: ["booked_dj_id"]
            isOneToOne: false
            referencedRelation: "dj_profiles_with_rating"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_gigs_business_user_id_fkey"
            columns: ["business_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          related_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          related_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          related_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_playlists: {
        Row: {
          artwork_url: string | null
          created_at: string
          description: string | null
          dj_user_id: string
          genre: string | null
          id: string
          is_public: boolean | null
          mood: string | null
          name: string
          tracks: Json | null
          updated_at: string
        }
        Insert: {
          artwork_url?: string | null
          created_at?: string
          description?: string | null
          dj_user_id: string
          genre?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          name: string
          tracks?: Json | null
          updated_at?: string
        }
        Update: {
          artwork_url?: string | null
          created_at?: string
          description?: string | null
          dj_user_id?: string
          genre?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          name?: string
          tracks?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_playlists_dj_user_id_fkey"
            columns: ["dj_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_post_comments_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_post_comments_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      app_e255c3cdb5_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          media_type: string
          media_url: string | null
          metadata: Json | null
          original_post_id: string | null
          // FIX: Added missing 'related_id' column.
          related_id: string | null
          repost_of_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string
          media_url?: string | null
          metadata?: Json | null
          original_post_id?: string | null
          // FIX: Added missing 'related_id' column.
          related_id?: string | null
          repost_of_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string
          media_url?: string | null
          metadata?: Json | null
          original_post_id?: string | null
          // FIX: Added missing 'related_id' column.
          related_id?: string | null
          repost_of_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_posts_repost_of_id_fkey"
            columns: ["repost_of_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_posts_repost_of_id_fkey"
            columns: ["repost_of_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_e255c3cdb5_reviews: {
        Row: {
          comment: string | null
          created_at: string
          gig_id: string | null
          id: string
          rating: number
          review_type: string | null
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          gig_id?: string | null
          id?: string
          rating: number
          review_type?: string | null
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          gig_id?: string | null
          id?: string
          rating?: number
          review_type?: string | null
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_reviews_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "app_e255c3cdb5_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      // FIX: Added missing table definition for stream sessions.
      app_e255c3cdb5_stream_sessions: {
        Row: {
          id: string
          dj_user_id: string
          title: string
          is_live: boolean
          listener_count: number
          created_at: string
        }
        Insert: {
          id?: string
          dj_user_id: string
          title: string
          is_live?: boolean
          listener_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          dj_user_id?: string
          title?: string
          is_live?: boolean
          listener_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_stream_sessions_dj_user_id_fkey"
            columns: ["dj_user_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      app_e255c3cdb5_user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          location: string | null
          phone: string | null
          // FIX: Added missing 'settings' column.
          settings: Json | null
          social_links: Json | null
          updated_at: string
          user_id: string
          user_type: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          location?: string | null
          phone?: string | null
          // FIX: Added missing 'settings' column.
          settings?: Json | null
          social_links?: Json | null
          updated_at?: string
          user_id: string
          user_type: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          // FIX: Added missing 'settings' column.
          settings?: Json | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
          user_type?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "fk_user_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      app_to_db_field_mapping: {
        Row: {
          app_field_name: string
          app_table_name: string
          created_at: string | null
          db_field_name: string
          description: string | null
          id: string
          is_primary_key: boolean | null
          transformation_type: string | null
        }
        Insert: {
          app_field_name: string
          app_table_name: string
          created_at?: string | null
          db_field_name: string
          description?: string | null
          id?: string
          is_primary_key?: boolean | null
          transformation_type?: string | null
        }
        Update: {
          app_field_name?: string
          app_table_name?: string
          created_at?: string | null
          db_field_name?: string
          description?: string | null
          id?: string
          is_primary_key?: boolean | null
          transformation_type?: string | null
        }
        Relationships: []
      }
      artwork_metadata: {
        Row: {
          artwork_details: Json | null
          created_at: string | null
          object_id: string
          user_id: string
        }
        Insert: {
          artwork_details?: Json | null
          created_at?: string | null
          object_id: string
          user_id?: string
        }
        Update: {
          artwork_details?: Json | null
          created_at?: string | null
          object_id?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          creator_id: string | null
          id: number
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: never
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: never
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      json_schemas: {
        Row: {
          name: string
          schema: Json
        }
        Insert: {
          name: string
          schema: Json
        }
        Update: {
          name?: string
          schema?: Json
        }
        Relationships: []
      }
      legacy_track_mapping: {
        Row: {
          created_at: string | null
          current_track_id: string | null
          legacy_track_id: string
        }
        Insert: {
          created_at?: string | null
          current_track_id?: string | null
          legacy_track_id: string
        }
        Update: {
          created_at?: string | null
          current_track_id?: string | null
          legacy_track_id?: string
        }
        Relationships: []
      }
      playlist_tracks: {
        Row: {
          added_at: string | null
          added_by: string | null
          id: string
          playlist_id: string
          track_id: string
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          playlist_id: string
          track_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          id?: string
          playlist_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_dj_profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "playlist_tracks_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey1"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "app_e255c3cdb5_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          data: Json
          id: number
        }
        Insert: {
          data: Json
          id?: never
        }
        Update: {
          data?: Json
          id?: never
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      app_e255c3cdb5_user_dj_profile: {
        Row: {
          auth_user_confirmed_at: string | null
          auth_user_created_at: string | null
          auth_user_email: string | null
          auth_user_id: string | null
          auth_user_is_anonymous: boolean | null
          auth_user_last_sign_in_at: string | null
          auth_user_raw_meta: Json | null
          auth_user_recovery_sent_at: string | null
          auth_user_role: string | null
          auth_user_updated_at: string | null
          availability_schedule: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          dj_profile_id: string | null
          equipment_owned: Json | null
          experience_years: number | null
          genres: Json | null
          hourly_rate: number | null
          id: string | null
          location: string | null
          phone: string | null
          portfolio_tracks: Json | null
          social_links: Json | null
          travel_radius: number | null
          updated_at: string | null
          user_id: string | null
          user_type: string | null
          website_url: string | null
        }
        Relationships: []
      }
      comprehensive_dj_profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          dj_profile_id: string | null
          email: string | null
          experience_years: number | null
          genres: Json | null
          id: string | null
          name: string | null
          role: string | null
          user_profile_id: string | null
          user_type: string | null
        }
        Relationships: []
      }
      dj_profiles_with_rating: {
        Row: {
          availability_schedule: Json | null
          avg_rating: number | null
          created_at: string | null
          equipment_owned: Json | null
          experience_years: number | null
          genres: Json | null
          hourly_rate: number | null
          id: string | null
          portfolio_tracks: Json | null
          rating: number | null
          reviews_count: number | null
          travel_radius: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      tracks: {
        Row: {
          added_at: string | null
          added_by: string | null
          id: string | null
          playlist_id: string | null
          track_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _policy_exists: {
        Args: { p_policy: string; p_schema: string; p_table: string }
        Returns: boolean
      }
      add_track_to_playlist: {
        Args:
          | { new_track: Json; playlist_id_param: string }
          | { p_playlist_id: string; p_track_id: string }
        Returns: undefined
      }
      add_track_to_portfolio: {
        Args: { dj_user_id_param: string; new_track: Json }
        Returns: undefined
      }
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      is_current_user: {
        Args: Record<PropertyKey, never> | { input_id: string }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args:
          | { instance: Json; schema: Json }
          | { p_json: Json; p_schema: unknown }
        Returns: boolean
      }
      sync_user_to_business_profiles: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      sync_user_to_dj_profile: {
        Args:
          | { p_is_active: boolean; p_user_id: string }
          | { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      dj_tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend"
      genre_type:
        | "Deep House"
        | "Minimal"
        | "Dub Techno"
        | "Deep Tech"
        | "Techno"
        | "Afro House"
        | "Soulful House"
        | "Melodic House"
        | "Progressive House"
        | "Lo-fi House"
        | "Industrial Techno"
        | "EDM"
        | "90s House"
        | "Jazz"
        | "Breaks"
        | "RnB/Hip-Hop"
      gig_status: "Open" | "Booked" | "Completed" | "Cancelled"
      media_type: "image" | "video" | "audio"
      user_type: "dj" | "business" | "listener"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  realtime: {
    Tables: {
      messages: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_05: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_06: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_07: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_08: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_09: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_10: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_09_11: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      subscription: {
        Row: {
          claims: Json
          claims_role: unknown
          created_at: string
          entity: unknown
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id: number
          subscription_id: string
        }
        Insert: {
          claims: Json
          claims_role?: unknown
          created_at?: string
          entity: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id: string
        }
        Update: {
          claims?: Json
          claims_role?: unknown
          created_at?: string
          entity?: unknown
          filters?: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
          id?: never
          subscription_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_rls: {
        Args: { max_record_bytes?: number; wal: Json }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      broadcast_changes: {
        Args: {
          event_name: string
          level?: string
          new: Record<string, unknown>
          old: Record<string, unknown>
          operation: string
          table_name: string
          table_schema: string
          topic_name: string
        }
        Returns: undefined
      }
      build_prepared_statement_sql: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          entity: unknown
          prepared_statement_name: string
        }
        Returns: string
      }
      cast: {
        Args: { type_: unknown; val: string }
        Returns: Json
      }
      check_equality_op: {
        Args: {
          op: Database["realtime"]["Enums"]["equality_op"]
          type_: unknown
          val_1: string
          val_2: string
        }
        Returns: boolean
      }
      is_visible_through_filters: {
        Args: {
          columns: Database["realtime"]["CompositeTypes"]["wal_column"][]
          filters: Database["realtime"]["CompositeTypes"]["user_defined_filter"][]
        }
        Returns: boolean
      }
      list_changes: {
        Args: {
          max_changes: number
          max_record_bytes: number
          publication: unknown
          slot_name: unknown
        }
        Returns: Database["realtime"]["CompositeTypes"]["wal_rls"][]
      }
      quote_wal2json: {
        Args: { entity: unknown }
        Returns: string
      }
      send: {
        Args: { event: string; payload: Json; private?: boolean; topic: string }
        Returns: undefined
      }
      to_regrole: {
        Args: { role_name: string }
        Returns: unknown
      }
      topic: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      action: "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE" | "ERROR"
      equality_op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in"
    }
    CompositeTypes: {
      user_defined_filter: {
        column_name: string | null
        op: Database["realtime"]["Enums"]["equality_op"] | null
        value: string | null
      }
      wal_column: {
        name: string | null
        type_name: string | null
        type_oid: unknown | null
        value: Json | null
        is_pkey: boolean | null
        is_selectable: boolean | null
      }
      wal_rls: {
        wal: Json | null
        is_rls_enabled: boolean | null
        subscription_ids: string[] | null
        errors: string[] | null
      }
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
          type: Database["storage"]["Enums"]["buckettype"]
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
          type?: Database["storage"]["Enums"]["buckettype"]
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
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
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
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
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
          user_metadata: Json | null
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
          user_metadata?: Json | null
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
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
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
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  supabase_functions: {
    Tables: {
      hooks: {
        Row: {
          created_at: string
          hook_name: string
          hook_table_id: number
          id: number
          request_id: number | null
        }
        Insert: {
          created_at?: string
          hook_name: string
          hook_table_id: number
          id?: number
          request_id?: number | null
        }
        Update: {
          created_at?: string
          hook_name?: string
          hook_table_id?: number
          id?: number
          request_id?: number | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          inserted_at: string
          version: string
        }
        Insert: {
          inserted_at?: string
          version: string
        }
        Update: {
          inserted_at?: string
          version?: string
        }
        Relationships: []
      }
      ptofiledata: {
        Row: {
          avatarUrl: string | null
          bio: string | null
          email: string | null
          followers: number | null
          following: string | null
          genres: string | null
          id: string
          location: string | null
          name: string | null
          rating: number | null
          reviewsCount: number | null
          role: string | null
          socials: string | null
          tier: string | null
        }
        Insert: {
          avatarUrl?: string | null
          bio?: string | null
          email?: string | null
          followers?: number | null
          following?: string | null
          genres?: string | null
          id: string
          location?: string | null
          name?: string | null
          rating?: number | null
          reviewsCount?: number | null
          role?: string | null
          socials?: string | null
          tier?: string | null
        }
        Update: {
          avatarUrl?: string | null
          bio?: string | null
          email?: string | null
          followers?: number | null
          following?: string | null
          genres?: string | null
          id?: string
          location?: string | null
          name?: string | null
          rating?: number | null
          reviewsCount?: number | null
          role?: string | null
          socials?: string | null
          tier?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  net: {
    Enums: {
      request_status: ["PENDING", "SUCCESS", "ERROR"],
    },
  },
  public: {
    Enums: {
      dj_tier: ["Bronze", "Silver", "Gold Groove", "Neon Legend"],
      genre_type: [
        "Deep House",
        "Minimal",
        "Dub Techno",
        "Deep Tech",
        "Techno",
        "Afro House",
        "Soulful House",
        "Melodic House",
        "Progressive House",
        "Lo-fi House",
        "Industrial Techno",
        "EDM",
        "90s House",
        "Jazz",
        "Breaks",
        "RnB/Hip-Hop",
      ],
      gig_status: ["Open", "Booked", "Completed", "Cancelled"],
      media_type: ["image", "video", "audio"],
      user_type: ["dj", "business", "listener"],
    },
  },
  realtime: {
    Enums: {
      action: ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"],
      equality_op: ["eq", "neq", "lt", "lte", "gt", "gte", "in"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
  supabase_functions: {
    Enums: {},
  },
} as const
