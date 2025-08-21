
import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DJ, Business, Gig, Track, Playlist, Role, Tier, User, FeedItem, Notification, NotificationType, Chat, Message, EnrichedChat, Listener, StreamSession, Review, EnrichedReview, Comment, EnrichedComment, UserSettings } from '../types';
import { DjRow, BusinessRow, TrackRow, PlaylistRow } from './database.types';
import { persistenceService } from './persistenceService';

// --- DATA POPULATION ---
// This data is now primarily for seeding the database.

export const userList: { id: string; name: string; email: string; role: Role; }[] = [
  // DJs (200) - Curated for Cape Town Based Deep House, Techno, Minimal (Excluding Gqom/Amapiano & non-CPT)
  { id: 'dj-1', name: 'K-DOLLA', email: 'k-dolla@test.com', role: Role.DJ },
  { id: 'dj-2', name: 'FKA Mash', email: 'fka@test.com', role: Role.DJ },
  { id: 'dj-3', name: 'Desiree', email: 'desiree@test.com', role: Role.DJ },
  { id: 'dj-4', name: 'Sides', email: 'sides@test.com', role: Role.DJ },
  { id: 'dj-5', name: 'DJ Loyd', email: 'loyd@test.com', role: Role.DJ },
  { id: 'dj-6', name: 'Paradise Citizens', email: 'paradise@test.com', role: Role.DJ },
  { id: 'dj-7', name: 'The Fogshow', email: 'fogshow@test.com', role: Role.DJ },
  { id: 'dj-8', name: 'Vinny Da Vinci', email: 'vinny@test.com', role: Role.DJ },
  { id: 'dj-9', name: 'Lawrence Dix', email: 'lawrence@test.com', role: Role.DJ },
  { id: 'dj-10', name: 'Dwson', email: 'dwson@test.com', role: Role.DJ },
  { id: 'dj-11', name: 'Pierre Johnson', email: 'pierre@test.com', role: Role.DJ },
  { id: 'dj-12', name: 'Leighton Moody', email: 'leighton@test.com', role: Role.DJ },
  { id: 'dj-13', name: 'Jullian Gomes', email: 'jullian@test.com', role: Role.DJ },
  { id: 'dj-14', name: 'Kat La Kat', email: 'kat@test.com', role: Role.DJ },
  { id: 'dj-15', name: 'Sir Vincent', email: 'vincent@test.com', role: Role.DJ },
  { id: 'dj-16', name: 'K-Faith', email: 'kfaith@test.com', role: Role.DJ },
  { id: 'dj-17', name: 'Ryan Hill', email: 'ryanhill@test.com', role: Role.DJ },
  { id: 'dj-18', name: 'The Lazarusman', email: 'lazarusman@test.com', role: Role.DJ },
  { id: 'dj-19', 'name': 'Atmos Blaq', 'email': 'atmos@test.com', 'role': Role.DJ },
  { id: 'dj-20', 'name': 'Kid Fonque', 'email': 'kidfonque@test.com', 'role': Role.DJ },
  { id: 'dj-21', 'name': 'Jazzuelle', 'email': 'jazzuelle@test.com', 'role': Role.DJ },
  { id: 'dj-22', 'name': 'Gina Jeanz', 'email': 'gina@test.com', 'role': Role.DJ },
  { id: 'dj-23', 'name': 'Thibo Tazz', 'email': 'thibo@test.com', 'role': Role.DJ },
  { id: 'dj-24', 'name': 'Ryan Murgatroyd', 'email': 'ryan@test.com', 'role': Role.DJ },
  { id: 'dj-25', 'name': 'Kostakis', 'email': 'kostakis@test.com', 'role': Role.DJ },
  { id: 'dj-26', 'name': 'Enoo Napa', 'email': 'enoo@test.com', 'role': Role.DJ },
  { id: 'dj-27', 'name': 'Lemon & Herb', 'email': 'lemonherb@test.com', 'role': Role.DJ },
  { id: 'dj-29', 'name': 'Culoe De Song', 'email': 'culoe@test.com', 'role': Role.DJ },
  { id: 'dj-30', 'name': 'Sobantwana', 'email': 'sobantwana@test.com', 'role': Role.DJ },
  { id: 'dj-31', 'name': 'DJ Buhle', 'email': 'buhle@test.com', 'role': Role.DJ },
  { id: 'dj-32', 'name': 'Caiiro', 'email': 'caiiro@test.com', 'role': Role.DJ },
  { id: 'dj-33', 'name': 'Chronical Deep', 'email': 'chronical@test.com', 'role': Role.DJ },
  { id: 'dj-34', 'name': 'SGVO', 'email': 'sgvo@test.com', 'role': Role.DJ },
  { id: 'dj-35', 'name': 'Deep Aztec', 'email': 'aztec@test.com', 'role': Role.DJ },
  { id: 'dj-36', 'name': 'Bantwanas', 'email': 'bantwanas@test.com', 'role': Role.DJ },
  { id: 'dj-38', 'name': 'Audiojerk', 'email': 'audiojerk@test.com', 'role': Role.DJ },
  { id: 'dj-39', name: 'Ivan Turanjanin', email: 'ivan@test.com', role: Role.DJ },
  { id: 'dj-40', name: 'Dylan Munro', email: 'dylan@test.com', role: Role.DJ },
  { id: 'dj-41', name: 'KHORD', email: 'khord@test.com', role: Role.DJ },
  { id: 'dj-42', name: 'Native Sound', email: 'native@test.com', role: Role.DJ },
  { id: 'dj-43', name: 'Irshaad Samaai', email: 'irshaad@test.com', role: Role.DJ },
  { id: 'dj-44', name: 'Rose Bonica', email: 'rose@test.com', role: Role.DJ },
  { id: 'dj-45', name: 'Dean FUEL', email: 'dean@test.com', role: Role.DJ },
  { id: 'dj-46', name: 'Double X eL', email: 'doublex@test.com', role: Role.DJ },
  { id: 'dj-47', name: 'Amy Mauritz', email: 'amymauritz@test.com', role: Role.DJ },
  { id: 'dj-48', name: 'Bones', email: 'bones@test.com', role: Role.DJ },
  { id: 'dj-49', name: 'W.N.N.E', email: 'wnne@test.com', role: Role.DJ },
  { id: 'dj-50', name: 'Josh.DLM', email: 'joshdlm@test.com', role: Role.DJ },
  { id: 'dj-51', name: 'Echoic', email: 'echoic@test.com', role: Role.DJ },
  { id: 'dj-52', name: 'Subterranean', email: 'subterranean@test.com', role: Role.DJ },
  { id: 'dj-53', name: 'Lady M', email: 'ladym@test.com', role: Role.DJ },
  { id: 'dj-54', name: 'Dr. Dub', email: 'drdub@test.com', role: Role.DJ },
  { id: 'dj-55', name: 'Static Flow', email: 'staticflow@test.com', role: Role.DJ },
  { id: 'dj-56', name: 'Rhythmic Theory', email: 'rhythmictheory@test.com', role: Role.DJ },
  { id: 'dj-57', name: 'Kaelin Anderson', email: 'kaelin@test.com', role: Role.DJ },
  { id: 'dj-58', name: 'Terra Blake', email: 'terra@test.com', role: Role.DJ },
  { id: 'dj-59', name: 'Aeron X', email: 'aeron@test.com', role: Role.DJ },
  { id: 'dj-60', name: 'B-Side', email: 'bside@test.com', role: Role.DJ },
  // Business users
  { id: 'biz-1', name: 'Modular', email: 'modular@test.com', role: Role.Business },
  // Listener users
  { id: 'listener-1', name: 'A-Muse', email: 'listener@test.com', role: Role.Listener },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const genresList = ['Deep House', 'Techno', 'Minimal', 'Dub-Techno', 'Afro Tech', 'Soulful House'];
const locations = ['Cape Town City Centre', 'Woodstock', 'Observatory', 'Sea Point', 'Camps Bay'];
const tiers = [Tier.Bronze, Tier.Silver, Tier.GoldGroove, Tier.NeonLegend];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export let djs: DJ[] = [];
export let businesses: Business[] = [];
let listeners: Listener[] = [];
export let gigs: Gig[] = [];
let tracks: Track[] = [];
let playlists: Playlist[] = [];
let playlistTracks: { playlist_id: string; track_id: string }[] = [];
let feedItems: FeedItem[] = [];
let notifications: Notification[] = [];
let chats: Chat[] = [];
let messages: Message[] = [];
let reviews: Review[] = [];
let streamSessions: StreamSession[] = [];
let comments: Comment[] = [];
let gigInterests: { gigId: string, djId: string }[] = [];

const createInitialData = () => {
    djs = userList.filter(u => u.role === Role.DJ).map((user, index) => ({
        ...user,
        role: Role.DJ,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`,
        genres: getRandomSubset(genresList, Math.ceil(Math.random() * 3)),
        bio: `Passionate DJ from Cape Town spinning the finest ${getRandom(genresList)}. Lover of all things electronic. Catch me at my next gig!`,
        location: getRandom(locations),
        rating: Math.random() * 1.5 + 3.5,
        reviewsCount: Math.floor(Math.random() * 50) + 5,
        tier: getRandom(tiers),
        followers: Math.floor(Math.random() * 2000),
        following: [],
        tracks: [],
        mixes: [],
        socials: { instagram: user.name.toLowerCase().replace(/\s/g, ''), soundcloud: user.name.toLowerCase().replace(/\s/g, '') },
    }));

    businesses = userList.filter(u => u.role === Role.Business).map(user => ({
        ...user,
        role: Role.Business,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`,
        location: getRandom(locations),
        description: `${user.name} is a premier venue in the heart of ${getRandom(locations)}, known for its incredible sound system and intimate atmosphere.`,
        rating: Math.random() * 1 + 4,
        reviewsCount: Math.floor(Math.random() * 100) + 10,
        followers: Math.floor(Math.random() * 5000),
        following: [],
        socials: { website: `${user.name.toLowerCase().replace(/\s/g, '')}.co.za` },
    }));
    
    listeners = userList.filter(u => u.role === Role.Listener).map(user => ({
        ...user,
        role: Role.Listener,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`,
        followers: Math.floor(Math.random() * 100),
        following: [],
    }));

    tracks = djs.flatMap(dj =>
        Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
            id: `track-${dj.id}-${i}`,
            title: `${getRandom(['Lunar', 'Solar', 'Cosmic', 'Abyssal', 'Rhythmic'])} ${getRandom(['Echoes', 'Pulse', 'Journey', 'Dream', 'Ritual'])}`,
            artistId: dj.id,
            artworkUrl: `https://source.unsplash.com/200x200/?abstract,techno&sig=${dj.id}-${i}`,
            duration: `${Math.floor(Math.random() * 6) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            trackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        }))
    );
    djs.forEach(dj => {
        dj.tracks = tracks.filter(t => t.artistId === dj.id);
    });
    
    playlists = djs.flatMap(dj =>
        Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
            const djTracks = tracks.filter(t => t.artistId === dj.id);
            const playlistTrackIds = getRandomSubset(djTracks, Math.ceil(Math.random() * 10) + 2).map(t => t.id);
            return {
                id: `pl-${dj.id}-${i}`,
                name: `${getRandom(['Late Night', 'Sunset', 'Warehouse', 'Groove'])} Mix #${i + 1}`,
                creatorId: dj.id,
                trackIds: playlistTrackIds,
                artworkUrl: djTracks.find(t => t.id === playlistTrackIds[0])?.artworkUrl || `https://source.unsplash.com/200x200/?dj,music&sig=${dj.id}-${i}`,
            };
        })
    );
    djs.forEach(dj => {
        dj.mixes = playlists.filter(p => p.creatorId === dj.id);
    });

    gigs = businesses.flatMap(biz =>
        Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => {
            const date = randomDate(new Date(), new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000));
            const statusOptions: Gig['status'][] = ['Open', 'Booked', 'Completed'];
            const status = getRandom(statusOptions);
            const bookedDj = status !== 'Open' ? getRandom(djs) : null;
            return {
                id: `gig-${biz.id}-${i}`,
                title: `${getRandom(['Techno', 'House', 'Minimal'])} Night at ${biz.name}`,
                venueId: biz.id,
                date: date.toISOString().split('T')[0],
                time: `${getRandom(['20', '21', '22'])}:00`,
                budget: (Math.floor(Math.random() * 20) + 5) * 500,
                description: `An unforgettable night of music at ${biz.name}. Get ready to dance!`,
                genres: getRandomSubset(genresList, 2),
                status: date < new Date() ? 'Completed' : status,
                bookedDjId: date < new Date() || status === 'Booked' ? bookedDj?.id : undefined,
                interestCount: Math.floor(Math.random() * 15),
                 flyerUrl: `https://source.unsplash.com/400x300/?party,nightclub&sig=${biz.id}-${i}`,
            }
        })
    );
    
    feedItems = [
        ...djs.slice(0, 5).map(dj => ({
            id: `feed-track-${dj.id}`,
            type: 'new_track' as const,
            userId: dj.id,
            title: 'New Track Out Now!',
            description: `Check out my latest track: ${dj.tracks[0]?.title}`,
            mediaUrl: dj.tracks[0]?.artworkUrl,
            mediaType: 'image' as const,
            timestamp: '2 days ago',
            likes: Math.floor(Math.random() * 200),
            likedBy: [],
            comments: Math.floor(Math.random() * 20),
            reposts: Math.floor(Math.random() * 10),
            relatedId: dj.tracks[0]?.id,
        })),
        ...businesses.slice(0,2).map(biz => ({
            id: `feed-gig-${biz.id}`,
            type: 'gig_announcement' as const,
            userId: biz.id,
            title: gigs.find(g => g.venueId === biz.id)!.title,
            description: `Join us on ${gigs.find(g => g.venueId === biz.id)!.date}`,
            mediaUrl: gigs.find(g => g.venueId === biz.id)!.flyerUrl,
            mediaType: 'image' as const,
            timestamp: '5 days ago',
            likes: Math.floor(Math.random() * 300),
            likedBy: [],
            comments: Math.floor(Math.random() * 30),
            reposts: Math.floor(Math.random() * 15),
            relatedId: gigs.find(g => g.venueId === biz.id)!.id,
        })),
    ].sort(() => 0.5 - Math.random());

    notifications = djs.slice(0, 1).flatMap(dj => [
        { id: `notif-${dj.id}-1`, userId: dj.id, type: NotificationType.NewFollower, text: 'K-DOLLA started following you.', timestamp: '1 hour ago', read: false, relatedId: 'dj-1' },
        { id: `notif-${dj.id}-2`, userId: dj.id, type: NotificationType.BookingConfirmed, text: 'Your booking for Modular is confirmed!', timestamp: '3 hours ago', read: false, relatedId: gigs[0].id },
        { id: `notif-${dj.id}-3`, userId: dj.id, type: NotificationType.NewComment, text: 'A-Muse commented on your post.', timestamp: '1 day ago', read: true, relatedId: feedItems[0].id },
    ]);
};

createInitialData();

// --- API Functions ---

const getAllUsers = (): User[] => [...djs, ...businesses, ...listeners];

export const authenticate = async (email: string, _: string): Promise<User | DJ | Business | Listener | null> => {
    await delay(500);
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
}

export const getUserById = async (id: string): Promise<User | null> => {
    return getAllUsers().find(u => u.id === id) || null;
}
export const getDJById = async (id: string): Promise<DJ | null> => djs.find(d => d.id === id) || null;
export const getBusinessById = async (id: string): Promise<Business | null> => businesses.find(b => b.id === id) || null;
export const getDJs = async (): Promise<DJ[]> => djs;
export const getTopDJs = async (): Promise<DJ[]> => [...djs].sort((a, b) => b.rating - a.rating).slice(0, 10);
export const getTopVenues = async (): Promise<Business[]> => [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 10);

export const searchUsers = async (query: string): Promise<User[]> => {
    const lowerQuery = query.toLowerCase();
    return getAllUsers().filter(u => u.name.toLowerCase().includes(lowerQuery));
}

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
    persistenceService.markDirty();
    const user = getAllUsers().find(u => u.id === userId);
    if(user) {
        user.settings = { ...user.settings, ...settings } as UserSettings;
    }
}

export const updateUserProfile = async (userId: string, updates: Partial<DJ> | Partial<Business>): Promise<void> => {
    persistenceService.markDirty();
    let user = djs.find(d => d.id === userId) as DJ | undefined;
    if (user) {
        Object.assign(user, updates);
    } else {
        let business = businesses.find(b => b.id === userId) as Business | undefined;
        if(business) {
            Object.assign(business, updates);
        }
    }
}


export const followUser = async (followerId: string, followingId: string): Promise<void> => {
    persistenceService.markDirty();
    const follower = getAllUsers().find(u => u.id === followerId) as (DJ | Business | Listener) & { following: string[] };
    const following = getAllUsers().find(u => u.id === followingId) as (DJ | Business | Listener) & { followers: number };
    if (follower && following) {
        if (!follower.following.includes(followingId)) {
            follower.following.push(followingId);
            following.followers++;
        }
    }
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<void> => {
    persistenceService.markDirty();
    const follower = getAllUsers().find(u => u.id === followerId) as (DJ | Business | Listener) & { following: string[] };
    const following = getAllUsers().find(u => u.id === followingId) as (DJ | Business | Listener) & { followers: number };
    if (follower && following) {
        follower.following = follower.following.filter(id => id !== followingId);
        following.followers--;
    }
};

export const getFollowersForUser = async (userId: string): Promise<User[]> => {
    // This is a mock, so we'll just return some random users
    return getRandomSubset(getAllUsers().filter(u => u.id !== userId), 10);
};

export const getFollowingForUser = async (userId: string): Promise<User[]> => {
    const user = getAllUsers().find(u => u.id === userId) as (DJ | Business | Listener) & { following: string[] };
    if (!user) return [];
    return getAllUsers().filter(u => user.following.includes(u.id));
};


export const getGigs = async (): Promise<Gig[]> => gigs;
export const getGigById = async (id: string): Promise<Gig | null> => gigs.find(g => g.id === id) || null;
export const getGigsForVenue = async (venueId: string): Promise<(Gig & { bookedDjName?: string })[]> => {
    const venueGigs = gigs.filter(g => g.venueId === venueId);
    return venueGigs.map(g => ({
        ...g,
        bookedDjName: djs.find(d => d.id === g.bookedDjId)?.name
    }));
}

export const addGig = async (gigData: Omit<Gig, 'id' | 'status'>): Promise<Gig> => {
    persistenceService.markDirty();
    const newGig: Gig = {
        ...gigData,
        id: `gig-new-${Date.now()}`,
        status: 'Open',
        interestCount: 0,
    };
    gigs.unshift(newGig);
    return newGig;
}

export const updateGig = async (gigId: string, venueId: string, updates: Partial<Gig>): Promise<void> => {
    persistenceService.markDirty();
    const gigIndex = gigs.findIndex(g => g.id === gigId && g.venueId === venueId);
    if (gigIndex !== -1) {
        gigs[gigIndex] = { ...gigs[gigIndex], ...updates };
    }
};

export const getBookedGigsForDj = async (djId: string): Promise<Gig[]> => gigs.filter(g => g.bookedDjId === djId && g.status === 'Booked');
export const getCompletedGigsForDj = async (djId: string): Promise<Gig[]> => gigs.filter(g => g.bookedDjId === djId && g.status === 'Completed');
export const getInterestedGigsForDj = async (djId: string): Promise<Gig[]> => {
    const interestedGigIds = gigInterests.filter(i => i.djId === djId).map(i => i.gigId);
    return gigs.filter(g => interestedGigIds.includes(g.id));
};

export const expressInterestInGig = async (gigId: string, djId: string): Promise<boolean> => {
    persistenceService.markDirty();
    const gig = gigs.find(g => g.id === gigId);
    if (gig && !gigInterests.some(i => i.gigId === gigId && i.djId === djId)) {
        gigInterests.push({ gigId, djId });
        gig.interestCount = (gig.interestCount || 0) + 1;
        return true;
    }
    return false;
}

export const getInterestedDJsForGig = async (gigId: string): Promise<DJ[]> => {
    const interestedDjIds = gigInterests.filter(i => i.gigId === gigId).map(i => i.djId);
    return djs.filter(dj => interestedDjIds.includes(dj.id));
};

export const bookDJForGig = async (gigId: string, djId: string): Promise<boolean> => {
    persistenceService.markDirty();
    const gig = gigs.find(g => g.id === gigId);
    if (gig && gig.status === 'Open') {
        gig.status = 'Booked';
        gig.bookedDjId = djId;
        return true;
    }
    return false;
}

export const getTracksForDj = async (djId: string): Promise<Track[]> => tracks.filter(t => t.artistId === djId);
export const getPlaylistsForDj = async (djId: string): Promise<Playlist[]> => playlists.filter(p => p.creatorId === djId);
export const getTracksByIds = async (ids: string[]): Promise<Track[]> => tracks.filter(t => ids.includes(t.id));
export const getPlaylistById = async (id: string): Promise<Playlist | null> => playlists.find(p => p.id === id) || null;
export const getTrackById = async (id: string): Promise<Track | null> => tracks.find(t => t.id === id) || null;

export const addTrack = async (artistId: string, title: string, artworkUrl: string, trackUrl: string): Promise<Track> => {
    persistenceService.markDirty();
    const newTrack: Track = {
        id: `track-new-${Date.now()}`,
        artistId,
        title,
        artworkUrl,
        trackUrl,
        duration: '5:00', // Mock duration
    };
    tracks.unshift(newTrack);
    return newTrack;
};

export const createPlaylist = async (creatorId: string, name: string, artworkUrl: string): Promise<Playlist> => {
    persistenceService.markDirty();
    const newPlaylist: Playlist = {
        id: `pl-new-${Date.now()}`,
        creatorId,
        name,
        artworkUrl: artworkUrl || `https://source.unsplash.com/200x200/?music,abstract&sig=${Date.now()}`,
        trackIds: [],
    };
    playlists.unshift(newPlaylist);
    return newPlaylist;
};

export const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>): Promise<void> => {
    persistenceService.markDirty();
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
        Object.assign(playlist, updates);
    }
};

export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
    persistenceService.markDirty();
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.trackIds.includes(trackId)) {
        playlist.trackIds.push(trackId);
    }
};

export const getFeedItems = async (): Promise<FeedItem[]> => feedItems;
export const getFeedItemById = async (id: string): Promise<FeedItem | null> => feedItems.find(f => f.id === id) || null;

export const addFeedItem = async (itemData: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>): Promise<FeedItem> => {
    persistenceService.markDirty();
    const newFeedItem: FeedItem = {
        ...itemData,
        id: `feed-new-${Date.now()}`,
        timestamp: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        reposts: 0,
    };
    feedItems.unshift(newFeedItem);
    return newFeedItem;
};

export const toggleLikePost = async (postId: string, userId: string): Promise<void> => {
    persistenceService.markDirty();
    const post = feedItems.find(p => p.id === postId);
    if (post) {
        if (post.likedBy?.includes(userId)) {
            post.likedBy = post.likedBy.filter(id => id !== userId);
            post.likes--;
        } else {
            post.likedBy = [...(post.likedBy || []), userId];
            post.likes++;
        }
    }
};

export const repost = async (originalPostId: string, userId: string): Promise<FeedItem | null> => {
    persistenceService.markDirty();
    const originalPost = feedItems.find(p => p.id === originalPostId);
    if (!originalPost || originalPost.repostOf) return null; // Cannot repost a repost

    originalPost.reposts++;

    const newRepost: FeedItem = {
        id: `repost-${userId}-${originalPostId}-${Date.now()}`,
        type: originalPost.type,
        userId: userId,
        title: '',
        description: '',
        timestamp: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        reposts: 0,
        repostOf: originalPostId,
    };
    feedItems.unshift(newRepost);
    return newRepost;
};


export const getCommentsForPost = async (postId: string): Promise<EnrichedComment[]> => {
    const postComments = comments.filter(c => c.postId === postId);
    return Promise.all(postComments.map(async c => ({
        ...c,
        author: (await getUserById(c.authorId))!,
    })));
};

export const addCommentToPost = async (postId: string, authorId: string, text: string): Promise<EnrichedComment | null> => {
    persistenceService.markDirty();
    const post = feedItems.find(f => f.id === postId);
    if (!post) return null;
    post.comments++;
    const newComment: Comment = {
        id: `comment-${postId}-${Date.now()}`,
        postId,
        authorId,
        text,
        timestamp: 'Just now',
    };
    comments.push(newComment);
    return {
        ...newComment,
        author: (await getUserById(authorId))!,
    };
};

export const getReviewsForUser = async (userId: string): Promise<EnrichedReview[]> => {
    const userReviews = reviews.filter(r => r.targetId === userId);
    return Promise.all(userReviews.map(async r => ({
        ...r,
        author: (await getUserById(r.authorId))!,
    })));
};

export const submitReview = async (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review> => {
    persistenceService.markDirty();
    const newReview: Review = {
        ...reviewData,
        id: `review-${reviewData.targetId}-${Date.now()}`,
        timestamp: 'Just now',
    };
    reviews.push(newReview);
    const target = getAllUsers().find(u => u.id === reviewData.targetId) as (DJ | Business);
    if (target) {
        const targetReviews = reviews.filter(r => r.targetId === target.id);
        target.rating = targetReviews.reduce((sum, r) => sum + r.rating, 0) / targetReviews.length;
        target.reviewsCount = targetReviews.length;
    }
    return newReview;
};

export const getEnrichedChatsForUser = async (userId: string): Promise<EnrichedChat[]> => {
    const userChats = chats.filter(c => c.participants.includes(userId));
    return Promise.all(userChats.map(async c => {
        const otherId = c.participants.find(p => p !== userId)!;
        return {
            ...c,
            otherParticipant: (await getUserById(otherId))!,
        };
    }));
};

export const findChatByParticipants = async (userId1: string, userId2: string): Promise<Chat | null> => {
    return chats.find(c => c.participants.includes(userId1) && c.participants.includes(userId2)) || null;
}

export const createChat = async (userId1: string, userId2: string): Promise<Chat> => {
    persistenceService.markDirty();
    const newChat: Chat = {
        id: `chat-${userId1}-${userId2}`,
        participants: [userId1, userId2],
        messages: [],
    };
    chats.push(newChat);
    return newChat;
};

export const getChatById = async (chatId: string): Promise<Chat | null> => chats.find(c => c.id === chatId) || null;

export const sendMessage = async (chatId: string, senderId: string, text: string): Promise<Message | null> => {
    persistenceService.markDirty();
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return null;
    const newMessage: Message = {
        id: `msg-${chatId}-${Date.now()}`,
        senderId,
        text,
        timestamp: 'Just now',
    };
    chat.messages.push(newMessage);
    return newMessage;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => notifications.filter(n => n.userId === userId);

export const markAllAsRead = async (userId: string): Promise<void> => {
    persistenceService.markDirty();
    notifications.forEach(n => {
        if (n.userId === userId) {
            n.read = true;
        }
    });
};

export const createStreamSession = async (djId: string, title: string): Promise<StreamSession> => {
    persistenceService.markDirty();
    const newSession: StreamSession = {
        id: `stream-${djId}-${Date.now()}`,
        djId,
        title,
        isLive: true,
        listenerCount: Math.floor(Math.random() * 50) + 10,
    };
    streamSessions.push(newSession);
    return newSession;
};

export const getStreamSessionById = async (sessionId: string): Promise<StreamSession | null> => streamSessions.find(s => s.id === sessionId) || null;

export const endStreamSession = async (sessionId: string): Promise<void> => {
    persistenceService.markDirty();
    const session = streamSessions.find(s => s.id === sessionId);
    if (session) {
        session.isLive = false;
    }
};

export const seedDatabase = async (): Promise<{djs: DJ[], businesses: Business[], gigs: Gig[], tracks: Track[], playlists: Playlist[]}> => {
    // This is a mock, so we just re-initialize the data.
    // In a real app, this would make Supabase calls.
    createInitialData();
    persistenceService.markSeeded();
    await delay(1000);
    return { djs, businesses, gigs, tracks, playlists };
};