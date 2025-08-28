
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserSettings = {
  theme: 'electric_blue' | 'magenta_pulse' | 'emerald_haze' | 'cyber_glow';
};

export type Database = {
  public: {
    Tables: {
      app_e255c3cdb5_user_actions_log: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          payload: Json | null;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: string;
          payload?: Json | null;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action_type?: string;
          payload?: Json | null;
          timestamp?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      app_e255c3cdb5_social_links: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_social_links_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "app_e255c3cdb5_user_profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      app_e255c3cdb5_tracks: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          artwork_url: string | null;
          track_url: string | null;
          duration: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          artwork_url?: string | null;
          track_url?: string | null;
          duration?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          title?: string;
          artwork_url?: string | null;
          track_url?: string | null;
          duration?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "app_e255c3cdb5_tracks_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "app_e255c3cdb5_user_profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      app_e255c3cdb5_user_profiles: {
        Row: {
          user_id: string;
          user_type: "dj" | "business" | "listener";
          display_name: string;
          avatar_url: string;
          settings: Json | null;
        };
        Insert: {
          user_id: string;
          user_type: "dj" | "business" | "listener";
          display_name: string;
          avatar_url: string;
          settings?: Json | null;
        };
        Update: {
          user_id?: string;
          user_type?: "dj" | "business" | "listener";
          display_name?: string;
          avatar_url?: string;
          settings?: Json | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_dj_profiles: {
        Row: {
          user_id: string;
          genres: string[];
          description: string;
          location: string;
          rating: number;
          reviews_count: number;
          tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          experience_years: number | null;
          equipment_owned: string[] | null;
          hourly_rate: number | null;
          travel_radius: number | null;
          availability_schedule: Json | null;
        };
        Insert: {
          user_id: string;
          genres: string[];
          description: string;
          location: string;
          rating?: number;
          reviews_count?: number;
          tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          experience_years?: number | null;
          equipment_owned?: string[] | null;
          hourly_rate?: number | null;
          travel_radius?: number | null;
          availability_schedule?: Json | null;
        };
        Update: {
          user_id?: string;
          genres?: string[];
          description?: string;
          location?: string;
          rating?: number;
          reviews_count?: number;
          tier?: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          experience_years?: number | null;
          equipment_owned?: string[] | null;
          hourly_rate?: number | null;
          travel_radius?: number | null;
          availability_schedule?: Json | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_business_profiles: {
        Row: {
          user_id: string;
          venue_name: string;
          location: string;
          description: string;
          rating: number;
          reviews_count: number;
        };
        Insert: {
          user_id: string;
          venue_name: string;
          location: string;
          description: string;
          rating?: number;
          reviews_count?: number;
        };
        Update: {
          user_id?: string;
          venue_name?: string;
          location?: string;
          description?: string;
          rating?: number;
          reviews_count?: number;
        };
        Relationships: [];
      };
      app_e255c3cdb5_gigs: {
        Row: {
          id: string;
          title: string;
          business_user_id: string;
          date: string;
          time: string;
          budget: number;
          description: string;
          genres: string[];
          status: 'Open' | 'Booked' | 'Completed' | 'Cancelled';
          booked_dj_id: string | null;
          interest_count: number | null;
          flyer_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          business_user_id: string;
          date: string;
          time: string;
          budget: number;
          description: string;
          genres: string[];
          status: 'Open' | 'Booked' | 'Completed' | 'Cancelled';
          booked_dj_id?: string | null;
          interest_count?: number | null;
          flyer_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          business_user_id?: string;
          date?: string;
          time?: string;
          budget?: number;
          description?: string;
          genres?: string[];
          status?: 'Open' | 'Booked' | 'Completed' | 'Cancelled';
          booked_dj_id?: string | null;
          interest_count?: number | null;
          flyer_url?: string | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_url: string | null;
          media_type: 'image' | 'video' | null;
          created_at: string;
          updated_at: string;
          likes_count: number;
          comments_count: number;
          original_post_id: string | null;
          type: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          media_url?: string | null;
          media_type?: 'image' | 'video' | null;
          original_post_id?: string | null;
          type?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          media_url?: string | null;
          media_type?: 'image' | 'video' | null;
          likes_count?: number;
          comments_count?: number;
          original_post_id?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          text: string;
          timestamp: string;
          is_read: boolean;
          related_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          text: string;
          timestamp: string;
          is_read?: boolean;
          related_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          text?: string;
          timestamp?: string;
          is_read?: boolean;
          related_id?: string | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_playlists: {
        Row: {
          id: string;
          dj_user_id: string;
          name: string;
          artwork_url: string | null;
          tracks: Json | null;
        };
        Insert: {
          id?: string;
          dj_user_id: string;
          name: string;
          artwork_url?: string | null;
          tracks?: Json | null;
        };
        Update: {
          id?: string;
          dj_user_id?: string;
          name?: string;
          artwork_url?: string | null;
          tracks?: Json | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
        };
        Relationships: [];
      };
      app_e255c3cdb5_gig_applications: {
        Row: {
          id: string;
          gig_id: string;
          dj_user_id: string;
          status: string;
        };
        Insert: {
          id?: string;
          gig_id: string;
          dj_user_id: string;
          status: string;
        };
        Update: {
          id?: string;
          gig_id?: string;
          dj_user_id?: string;
          status?: string;
        };
        Relationships: [];
      };
      app_e255c3cdb5_bookings: {
        Row: {
          id: string;
          gig_id: string;
          dj_user_id: string;
          business_user_id: string;
          agreed_rate: number;
        };
        Insert: {
          id?: string;
          gig_id: string;
          dj_user_id: string;
          business_user_id: string;
          agreed_rate: number;
        };
        Update: {
          id?: string;
          gig_id?: string;
          dj_user_id?: string;
          business_user_id?: string;
          agreed_rate?: number;
        };
        Relationships: [];
      };
      app_e255c3cdb5_reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          gig_id: string | null;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          gig_id?: string | null;
        };
        Update: {
          id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          gig_id?: string | null;
        };
        Relationships: [];
      };
      app_e255c3cdb5_post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
        };
        Relationships: [];
      };
      app_e255c3cdb5_post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      app_e255c3cdb5_follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [];
      },
      app_e255c3cdb5_stream_sessions: {
        Row: {
            id: string;
            dj_user_id: string;
            title: string;
            is_live: boolean;
            listener_count: number;
            created_at: string;
        },
        Insert: {
            id?: string;
            dj_user_id: string;
            title: string;
            is_live?: boolean;
            listener_count?: number;
            created_at?: string;
        },
        Update: {
            id?: string;
            dj_user_id?: string;
            title?: string;
            is_live?: boolean;
            listener_count?: number;
            created_at?: string;
        },
        Relationships: [];
      },
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_track_to_portfolio: {
        Args: {
          dj_user_id_param: string;
          new_track: Json;
        };
        Returns: void;
      };
      add_track_to_playlist: {
        Args: {
          playlist_id_param: string;
          new_track: Json;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}