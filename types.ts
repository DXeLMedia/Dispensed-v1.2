// types.ts

// Base user from auth.users
export interface AuthUser {
  id: string; // Corresponds to auth.users.id
  email?: string;
  // other auth fields
}

// Corresponds to app_e255c3cdb5_user_profiles
export interface UserProfile {
  id: string; // a uuid, pk
  user_id: string; // uuid, fk to auth.users.id
  user_type: 'dj' | 'business';
  display_name: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
  website_url?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Corresponds to app_e255c3cdb5_dj_profiles
export interface DjProfile {
  id: string;
  user_id: string;
  genres?: string[];
  experience_years?: number;
  equipment_owned?: any[];
  hourly_rate?: number;
  travel_radius?: number;
  availability_schedule?: any;
  portfolio_tracks?: any[];
}

// Corresponds to app_e255c3cdb5_business_profiles
export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  address?: string;
  capacity?: number;
  typical_event_types?: string[];
}

// Combined types for application use
export type DJ = UserProfile & { djProfile: DjProfile };
export type Business = UserProfile & { businessProfile: BusinessProfile };
export type User = UserProfile; // General user type

// Corresponds to app_e255c3cdb5_gigs
export interface Gig {
  id: string;
  business_user_id: string;
  title: string;
  description?: string;
  event_date: string;
  duration_hours?: number;
  location: string;
  budget_min?: number;
  budget_max?: number;
  required_genres?: string[];
  required_equipment?: any[];
  status: 'open' | 'booked' | 'completed' | 'cancelled';
}

// Corresponds to app_e255c3cdb5_gig_applications
export interface GigApplication {
  id: string;
  gig_id: string;
  dj_user_id: string;
  message?: string;
  proposed_rate?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

// Corresponds to app_e255c3cdb5_bookings
export interface Booking {
    id: string;
    gig_id: string;
    dj_user_id: string;
    business_user_id: string;
    agreed_rate: number;
    booking_status: 'confirmed' | 'completed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'refunded';
    special_requests?: string;
}

// Assuming the structure of the jsonb `tracks` column in playlists
export interface Track {
  id: string;
  title: string;
  artist: string; // Assuming artist name is stored
  url: string;
  artworkUrl?: string;
  duration?: number; // in seconds
}

// Corresponds to app_e255c3cdb5_playlists
export interface Playlist {
  id: string;
  dj_user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  tracks: Track[]; // from jsonb column
  genre?: string;
  mood?: string;
}

// Corresponds to app_e255c3cdb5_posts
export interface Post {
    id: string;
    user_id: string;
    content: string;
    post_type: 'text' | 'image' | 'video' | 'playlist' | 'event';
    media_url?: string;
    metadata?: any;
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
}

// Corresponds to app_e255c3cdb5_post_comments
export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

// Corresponds to app_e255c3cdb5_post_likes
export interface PostLike {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
}

// Corresponds to app_e255c3cdb5_reviews
export interface Review {
    id: string;
    reviewer_id: string;
    reviewee_id: string;
    booking_id?: string;
    rating: number;
    comment?: string;
    review_type: 'dj_review' | 'business_review';
    created_at: string;
}

// Corresponds to app_e255c3cdb5_messages
export interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    message_type: 'text' | 'image' | 'audio' | 'file';
    attachment_url?: string;
    is_read: boolean;
    created_at: string;
}

// Corresponds to app_e255c3cdb5_notifications
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    notification_type: string;
    related_id?: string;
    is_read: boolean;
    created_at: string;
}

// --- Enums and other types that might be useful ---

export enum Role {
  DJ = 'dj',
  Business = 'business',
}
