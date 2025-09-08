




export enum Role {
  DJ = 'dj',
  Business = 'business',
  Listener = 'listener',
}

export enum Tier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  GoldGroove = 'Gold Groove',
  NeonLegend = 'Neon Legend',
}

export interface UserSettings {
  theme: 'electric_blue' | 'magenta_pulse' | 'emerald_haze' | 'cyber_glow';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  avatarUrl: string;
  settings?: UserSettings;
}

export interface Followable {
    following: string[]; // array of user IDs
    followers: number;
}

export interface DJ extends User, Followable {
  role: Role.DJ;
  genres: string[];
  bio: string;
  location: string;
  rating: number;
  reviewsCount: number;
  tier: Tier;
  tracks: Track[];
  mixes: Playlist[];
  experienceYears?: number | null;
  equipmentOwned?: string[];
  hourlyRate?: number | null;
  travelRadius?: number | null; // in km
  availabilitySchedule?: string;
  socials?: {
    instagram?: string;
    soundcloud?: string;
    facebook?: string;
    website?: string;
  };
}

export interface Business extends User, Followable {
  role: Role.Business;
  location: string;
  description: string;
  rating: number;
  reviewsCount: number;
  socials?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface Listener extends User, Followable {
    role: Role.Listener;
    rating: number;
    reviewsCount: number;
}


export interface Gig {
  id: string;
  title: string;
  business_user_id: string;
  date: string;
  time: string;
  budget: number;
  description:string;
  genres: string[];
  status: 'Open' | 'Booked' | 'Completed' | 'Cancelled';
  bookedDjId?: string;
  interestCount?: number;
  flyerUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artworkUrl: string;
  duration: string; // e.g., "3:45"
  trackUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  creatorId: string;
  trackIds: string[];
  artworkUrl: string;
}

export interface Message {
  id: string;
  senderId: string;
  // FIX: Added recipientId to align with the database schema and application logic.
  recipientId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
    id:string;
    participants: [string, string];
    messages: Message[];
}

// Enriched chat for displaying in inbox list
export interface EnrichedChat extends Chat {
    otherParticipant: UserProfile;
}


export enum NotificationType {
    Message = 'message',
    BookingRequest = 'booking_request',
    EventUpdate = 'event_update',
    NewFollower = 'new_follower',
    BookingConfirmed = 'booking_confirmed',
    GigFilled = 'gig_filled',
    NewReview = 'new_review',
    NewComment = 'new_comment',
    Repost = 'repost',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string; // e.g., messageId, gigId, postId
}

export interface FeedItem {
    id: string;
    type: 'new_track' | 'new_mix' | 'gig_announcement' | 'live_now' | 'new_connection' | 'new_review' | 'user_post';
    userId: string;
    title: string;
    description: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    timestamp: string;
    likes: number;
    likedBy?: string[];
    comments: number;
    reposts: number;
    relatedId?: string; // e.g., playlistId, streamSessionId
    rating?: number; // For new_review type
    repostOf?: string;
}

export interface StreamSession {
  id: string;
  djId: string;
  title: string;
  isLive: boolean;
  listenerCount: number;
}

export interface Review {
  id: string;
  authorId: string;
  targetId: string; // The ID of the user being reviewed
  rating: number; // 1-5
  comment?: string;
  timestamp: string;
  gigId?: string; // Optional gig ID this review is associated with
}

// For displaying reviews with author info
export interface EnrichedReview extends Review {
    author: User;
}

export interface Comment {
  id: string;
  authorId: string;
  postId: string;
  text: string;
  timestamp: string;
}

export interface EnrichedComment extends Comment {
  author: User;
}

// Type Aliases for compatibility
export type UserProfile = DJ | Business | Listener;
export type Post = FeedItem;
export type PostComment = Comment;

export interface DjProfile {
    genres?: string[];
    bio?: string;
    location?: string;
    rating?: number;
    reviewsCount?: number;
    tier?: Tier;
    experienceYears?: number | null;
    equipmentOwned?: string[];
    hourlyRate?: number | null;
    travelRadius?: number | null;
    availabilitySchedule?: string;
    socials?: {
        instagram?: string;
        soundcloud?: string;
        facebook?: string;
        website?: string;
    };
}

export interface BusinessProfile {
    location?: string;
    description?: string;
    rating?: number;
    reviewsCount?: number;
    socials?: {
        instagram?: string;
        facebook?: string;
        website?: string;
    };
}