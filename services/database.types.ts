
import { Role, Tier, UserSettings } from '../types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// These are the types for the database rows.
// They should not include any client-side computed fields.

type DjRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: UserSettings;
  following: string[];
  followers: number;
  role: Role.DJ;
  genres: string[];
  bio: string;
  location: string;
  rating: number;
  reviewsCount: number;
  tier: Tier;
  socials?: {
    instagram?: string;
    soundcloud?: string;
    facebook?: string;
    website?: string;
  };
};

type BusinessRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: UserSettings;
  following: string[];
  followers: number;
  role: Role.Business;
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

type TrackRow = {
  id: string;
  title: string;
  artistId: string;
  artworkUrl: string;
  duration: string;
  trackUrl?: string;
};

type PlaylistRow = {
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
