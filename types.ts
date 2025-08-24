

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
  theme: 'electric_blue' | 'magenta_pulse' | 'emerald_haze';
}

export interface User {
  id: string;
  name: string;
  email: string;
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
}

export interface Business extends User, Followable {
  role: Role.Business;
  venueName: string;
  location: string;
  description: string;
  rating: number;
  reviewsCount: number;
}

export interface Listener extends User, Followable {
    role: Role.Listener;
}


export interface Gig {
  id: string;
  title: string;
  venueId: string;
  date: string;
  time: string;
  budget: number;
  description:string;
  genres: string[];
  status: 'Open' | 'Booked' | 'Completed' | 'Cancelled';
  bookedDjId?: string;
  interestCount?: number;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artworkUrl: string;
  duration: string; // e.g., "3:45"
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
    otherParticipant: User;
}


export enum NotificationType {
    Message = 'message',
    BookingRequest = 'booking_request',
    EventUpdate = 'event_update',
    NewFollower = 'new_follower',
    BookingConfirmed = 'booking_confirmed',
    GigFilled = 'gig_filled',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  text: string;
  timestamp: string;
  read: boolean;
  relatedId?: string; // e.g., messageId, gigId
}

export interface FeedItem {
    id: string;
    type: 'new_track' | 'new_mix' | 'gig_announcement' | 'live_now' | 'new_connection' | 'new_review';
    userId: string;
    title: string;
    description: string;
    imageUrl: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    relatedId?: string; // e.g., playlistId, streamSessionId
}

export interface StreamSession {
  id: string;
  djId: string;
  title: string;
  isLive: boolean;
  listenerCount: number;
}