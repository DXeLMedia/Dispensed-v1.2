
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

export interface Database {
  public: {
    Tables: {
      app_e255c3cdb5_user_profiles: {
        Row: {
          user_id: string;
          user_type: "dj" | "business" | "listener";
          display_name: string;
          email: string;
          avatar_url: string;
          settings: Json | null;
        };
        Insert: {
          user_id: string;
          user_type: "dj" | "business" | "listener";
          display_name: string;
          email: string;
          avatar_url: string;
          settings?: Json | null;
        };
        Update: Partial<{
          user_id: string;
          user_type: "dj" | "business" | "listener";
          display_name: string;
          email: string;
          avatar_url: string;
          settings: Json | null;
        }>;
      };
      app_e255c3cdb5_dj_profiles: {
        Row: {
          user_id: string;
          genres: string[];
          bio: string;
          location: string;
          rating: number;
          reviews_count: number;
          tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          socials: Json | null;
          portfolio_tracks: Json | null;
        };
        Insert: {
          user_id: string;
          genres: string[];
          bio: string;
          location: string;
          rating?: number;
          reviews_count?: number;
          tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          socials?: Json | null;
          portfolio_tracks?: Json | null;
        };
        Update: Partial<{
          user_id: string;
          genres: string[];
          bio: string;
          location: string;
          rating: number;
          reviews_count: number;
          tier: "Bronze" | "Silver" | "Gold Groove" | "Neon Legend";
          socials: Json | null;
          portfolio_tracks: Json | null;
        }>;
      };
      app_e255c3cdb5_business_profiles: {
        Row: {
          user_id: string;
          venue_name: string;
          location: string;
          description: string;
          rating: number;
          reviews_count: number;
          socials: Json | null;
        };
        Insert: {
          user_id: string;
          venue_name: string;
          location: string;
          description: string;
          rating?: number;
          reviews_count?: number;
          socials?: Json | null;
        };
        Update: Partial<{
          user_id: string;
          venue_name: string;
          location: string;
          description: string;
          rating: number;
          reviews_count: number;
          socials: Json | null;
        }>;
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
        Update: Partial<{
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
        }>;
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
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          media_url?: string | null;
          media_type?: 'image' | 'video' | null;
        };
        Update: Partial<{
          id: string;
          user_id: string;
          content: string;
          media_url: string | null;
          media_type: 'image' | 'video' | null;
          likes_count: number;
          comments_count: number;
        }>;
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
        Update: Partial<{
          id: string;
          user_id: string;
          type: string;
          text: string;
          timestamp: string;
          is_read: boolean;
          related_id: string | null;
        }>;
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
        Update: Partial<{
          id: string;
          dj_user_id: string;
          name: string;
          artwork_url: string | null;
          tracks: Json | null;
        }>;
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
        Update: Partial<{
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
        }>;
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
        Update: Partial<{
          id: string;
          gig_id: string;
          dj_user_id: string;
          status: string;
        }>;
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
        Update: Partial<{
          id: string;
          gig_id: string;
          dj_user_id: string;
          business_user_id: string;
          agreed_rate: number;
        }>;
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
        Update: Partial<{
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          gig_id: string | null;
        }>;
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
        Update: Partial<{
          id: string;
          post_id: string;
          user_id: string;
          content: string;
        }>;
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
        Update: Partial<{
          id: string;
          post_id: string;
          user_id: string;
        }>;
      };
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
        Returns: undefined;
      };
      add_track_to_playlist: {
        Args: {
          playlist_id_param: string;
          new_track: Json;
        };
        Returns: undefined;
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