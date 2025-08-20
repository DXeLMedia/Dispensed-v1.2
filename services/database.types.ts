
export type Json = any;

// Inlined from ../types to avoid potential type resolution issues with Supabase.
export type UserSettings = {
  theme: 'electric_blue' | 'magenta_pulse' | 'emerald_haze' | 'cyber_glow';
};

// These are the types for the database rows.
// They should not include any client-side computed fields.

export interface DjRow {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: UserSettings;
  following: string[];
  followers: number;
  role: 'dj';
  genres: string[];
  bio: string;
  location: string;
  rating: number;
  reviewsCount: number;
  tier: string;
  socials?: {
    instagram?: string;
    soundcloud?: string;
    facebook?: string;
    website?: string;
  };
};

export interface BusinessRow {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: UserSettings;
  following: string[];
  followers: number;
  role: 'business';
  location:string;
  description: string;
  rating: number;
  reviewsCount: number;
  socials?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
};

export interface TrackRow {
  id: string;
  title: string;
  artistId: string;
  artworkUrl: string;
  duration: string;
  trackUrl?: string;
};

export interface PlaylistRow {
  id: string;
  name: string;
  creatorId: string;
  artworkUrl: string;
};

export interface Database {
  public: {
    Tables: {
      djs: {
        Row: DjRow;
        Insert: DjRow;
        Update: Partial<DjRow>;
      };
      businesses: {
        Row: BusinessRow;
        Insert: BusinessRow;
        Update: Partial<BusinessRow>;
      };
      tracks: {
        Row: TrackRow;
        Insert: TrackRow;
        Update: Partial<TrackRow>;
      };
      playlists: {
        Row: PlaylistRow;
        Insert: PlaylistRow;
        Update: Partial<PlaylistRow>;
      };
      playlist_tracks: {
        Row: { playlist_id: string; track_id: string };
        Insert: { playlist_id: string; track_id: string };
        Update: Partial<{ playlist_id: string; track_id: string }>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}