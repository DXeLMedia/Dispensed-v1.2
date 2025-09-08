import { DJ, Business, Gig, Track, Playlist, Role, UserProfile, Notification, Message, Review, FeedItem, Comment as PostComment, User, EnrichedReview, EnrichedComment, StreamSession, UserSettings, EnrichedChat, Chat, Tier, Listener, NotificationType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// =================================================================
// SECTION: In-Memory Demo Database
// =================================================================

let USERS: UserProfile[] = [
    {
        id: 'dj-1', name: 'DJ Helix', role: Role.DJ, avatarUrl: 'https://source.unsplash.com/random/200x200/?dj,male,techno',
        genres: ['Techno', 'Minimal', 'Dub-Techno'],
        bio: 'Cape Town based Techno DJ, producer, and label owner. I bring high-energy, hypnotic grooves to the dance floor. With over 10 years of experience, my sets are a journey through the deeper sounds of electronic music.',
        location: 'City Bowl', rating: 4.9, reviewsCount: 88, tier: Tier.GoldGroove,
        tracks: [], mixes: [], following: ['dj-2', 'business-1'], followers: 1250,
        experienceYears: 10, equipmentOwned: ['Pioneer CDJ-3000', 'Technics SL-1200', 'Allen & Heath Xone:96'], hourlyRate: 2500, travelRadius: 50,
        availabilitySchedule: 'Weekends after 9 PM. Available for corporate events on request.',
        socials: { instagram: 'djhelix', soundcloud: 'djhelix' }
    } as DJ,
    {
        id: 'dj-2', name: 'Amelia Air', role: Role.DJ, avatarUrl: 'https://source.unsplash.com/random/200x200/?dj,female,house',
        genres: ['Deep House', 'Afro Tech', 'Soulful House'],
        bio: 'Selector of all things deep and soulful. My passion is creating a vibe where people can connect and lose themselves in the music. Based in Cape Town, ready to play your sunset sessions and intimate parties.',
        location: 'Camps Bay', rating: 4.7, reviewsCount: 34, tier: Tier.Silver,
        tracks: [], mixes: [], following: ['business-2'], followers: 620,
        experienceYears: 4, hourlyRate: 1200, travelRadius: 30,
        socials: { instagram: 'amelia_air' }
    } as DJ,
    {
        id: 'business-1', name: 'The Void', role: Role.Business, avatarUrl: 'https://source.unsplash.com/random/200x200/?nightclub,dark',
        location: 'City Bowl', description: 'Dark rooms, big sound. The home of underground techno in Cape Town. We host local and international artists every weekend.',
        rating: 4.8, reviewsCount: 152, following: ['dj-1'], followers: 2300,
        socials: { instagram: 'thevoidcpt' }
    } as Business,
     {
        id: 'business-2', name: 'Sunset Terrace', role: Role.Business, avatarUrl: 'https://source.unsplash.com/random/200x200/?beach,bar',
        location: 'Camps Bay', description: 'Cocktails, sunsets, and the finest deep house. The ultimate summer vibe located on the Camps Bay strip.',
        rating: 4.6, reviewsCount: 98, following: ['dj-2'], followers: 1800,
        socials: { instagram: 'sunsetterrace_za' }
    } as Business,
    {
        id: 'listener-1', name: 'RaveRaccoon', role: Role.Listener, avatarUrl: 'https://source.unsplash.com/random/200x200/?raccoon,party',
        following: ['dj-1', 'dj-2', 'business-1'], followers: 42,
        rating: 0,
        reviewsCount: 0,
    } as Listener
];

let TRACKS: Track[] = [
    { id: 'track-1', title: 'Quantum Entanglement', artistId: 'dj-1', artworkUrl: 'https://source.unsplash.com/random/200x200/?abstract,space', duration: '6:32', trackUrl: 'https://storage.googleapis.com/media.clinic/Clinics-911-Techno-Therapy-119.mp3' },
    { id: 'track-2', title: 'Signal to Noise', artistId: 'dj-1', artworkUrl: 'https://source.unsplash.com/random/200x200/?abstract,glitch', duration: '7:15', trackUrl: 'https://storage.googleapis.com/media.clinic/Clinics-911-Techno-Therapy-119.mp3' },
    { id: 'track-3', title: 'Ocean Drive', artistId: 'dj-2', artworkUrl: 'https://source.unsplash.com/random/200x200/?ocean,sunset', duration: '5:45', trackUrl: 'https://storage.googleapis.com/media.clinic/Clinics-911-Techno-Therapy-119.mp3' },
];

let PLAYLISTS: Playlist[] = [
    { id: 'pl-1', name: 'Hypnotic Journey', creatorId: 'dj-1', trackIds: ['track-1', 'track-2'], artworkUrl: 'https://source.unsplash.com/random/200x200/?tunnel,light' }
];

// Assign tracks to DJs
const djUser1 = USERS.find(u => u.id === 'dj-1');
if (djUser1?.role === Role.DJ) {
    djUser1.tracks = TRACKS.filter(t => t.artistId === 'dj-1');
    djUser1.mixes = PLAYLISTS;
}
const djUser2 = USERS.find(u => u.id === 'dj-2');
if (djUser2?.role === Role.DJ) {
    djUser2.tracks = TRACKS.filter(t => t.artistId === 'dj-2');
}


let GIGS: Gig[] = [
    { id: 'gig-1', title: 'Techno Temple ft. DJ Helix', business_user_id: 'business-1', date: '2024-09-20', time: '22:00', budget: 5000, description: 'Prepare for a night of relentless techno as resident DJ Helix takes over the main room.', genres: ['Techno', 'Minimal'], status: 'Booked', bookedDjId: 'dj-1', interestCount: 1, flyerUrl: 'https://source.unsplash.com/random/400x300/?techno,poster' },
    { id: 'gig-2', title: 'Sunset Sessions', business_user_id: 'business-2', date: '2024-09-22', time: '17:00', budget: 2000, description: 'We need a DJ to spin some deep and soulful house for our Sunday sunset session.', genres: ['Deep House', 'Soulful House'], status: 'Open', interestCount: 1, flyerUrl: 'https://source.unsplash.com/random/400x300/?sunset,cocktail' },
     { id: 'gig-3', title: 'Past Event: Warehouse Rave', business_user_id: 'business-1', date: '2024-07-15', time: '23:00', budget: 4000, description: 'Past gig.', genres: ['Techno'], status: 'Completed', bookedDjId: 'dj-1', interestCount: 10, flyerUrl: 'https://source.unsplash.com/random/400x300/?warehouse,party' },
     { id: 'gig-4', title: 'Friday Night Grooves', business_user_id: 'business-1', date: '2024-09-27', time: '21:00', budget: 3000, description: 'Looking for a DJ who can spin some energetic deep house and afro tech.', genres: ['Deep House', 'Afro Tech'], status: 'Open', interestCount: 1, flyerUrl: 'https://source.unsplash.com/random/400x300/?dj,party' },
];

let GIG_APPLICATIONS: {gig_id: string, dj_user_id: string}[] = [
    { gig_id: 'gig-2', dj_user_id: 'dj-2' },
    { gig_id: 'gig-4', dj_user_id: 'dj-2' },
];

let FEED_ITEMS: FeedItem[] = [
    { id: 'feed-1', type: 'new_mix', userId: 'dj-1', title: 'New Mix: Hypnotic Journey', description: 'My latest mix is up! A deep dive into hypnotic techno.', mediaUrl: PLAYLISTS[0].artworkUrl, timestamp: '2 hours ago', likes: 128, comments: 12, reposts: 22, relatedId: 'pl-1', likedBy: [] },
    { id: 'feed-2', type: 'gig_announcement', userId: 'business-1', title: 'Techno Temple ft. DJ Helix', description: 'This Friday at The Void!', mediaUrl: GIGS[0].flyerUrl, timestamp: '8 hours ago', likes: 256, comments: 23, reposts: 45, relatedId: 'gig-1', likedBy: [] },
    { id: 'feed-3', type: 'user_post', userId: 'dj-2', title: '', description: 'Such an amazing vibe playing at Sunset Terrace last night! Thanks to everyone who came out to dance. 🙏', mediaUrl: 'https://source.unsplash.com/random/400x300/?dj,crowd', mediaType: 'image', timestamp: '1 day ago', likes: 98, comments: 8, reposts: 5, likedBy: [] },
];

let COMMENTS: EnrichedComment[] = [
    { id: 'comment-1', postId: 'feed-1', authorId: 'listener-1', text: 'This mix is fire! 🔥', timestamp: '1 hour ago', author: USERS.find(u => u.id === 'listener-1')! },
];

let MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'business-1', recipientId: 'dj-1', text: "Hey Helix, great set last weekend. Are you free for the 20th?", timestamp: "3 days ago" },
    { id: 'msg-2', senderId: 'dj-1', recipientId: 'business-1', text: "Thanks! Yeah I'm available. Let's do it.", timestamp: "3 days ago" },
];

let REVIEWS: EnrichedReview[] = [
    { id: 'rev-1', authorId: 'listener-1', targetId: 'dj-1', rating: 5, comment: 'DJ Helix never disappoints. Best techno DJ in town!', timestamp: '1 week ago', gigId: 'gig-3', author: USERS.find(u => u.id === 'listener-1')! }
];

export let NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'dj-1', type: NotificationType.NewFollower, title: 'New Follower', message: 'RaveRaccoon started following you.', timestamp: '1 day ago', read: false, relatedId: 'listener-1' },
    { id: 'notif-2', userId: 'dj-2', type: NotificationType.BookingRequest, title: 'New Gig Opportunity', message: 'Sunset Terrace has a new gig available that matches your profile.', timestamp: '2 days ago', read: true, relatedId: 'gig-2' },
    { id: 'notif-3', userId: 'business-1', type: NotificationType.BookingRequest, title: 'New Gig Interest', message: 'Amelia Air is interested in your gig: "Friday Night Grooves".', timestamp: '4 hours ago', read: false, relatedId: 'gig-4' },
    { id: 'notif-4', userId: 'business-1', type: NotificationType.NewFollower, title: 'New Follower', message: 'RaveRaccoon started following you.', timestamp: '2 days ago', read: true, relatedId: 'listener-1' },
];

// =================================================================
// SECTION: API Function Implementations
// =================================================================

const getNotificationTitle = (type: NotificationType): string => {
    switch (type) {
        case NotificationType.Message: return "New Message";
        case NotificationType.BookingRequest: return "New Gig Interest";
        case NotificationType.EventUpdate: return "Event Updated";
        case NotificationType.NewFollower: return "New Follower";
        case NotificationType.BookingConfirmed: return "Booking Confirmed";
        case NotificationType.GigFilled: return "Gig Filled";
        case NotificationType.NewReview: return "New Review";
        case NotificationType.NewComment: return "New Comment on Your Post";
        case NotificationType.Repost: return "Your Post was Reposted";
        default: return "New Notification";
    }
}

export const createNotification = async (
    userId: string,
    type: NotificationType,
    message: string,
    relatedId?: string
): Promise<void> => {
    NOTIFICATIONS.unshift({
        id: uuidv4(),
        userId,
        type,
        title: getNotificationTitle(type),
        message,
        relatedId,
        timestamp: new Date().toISOString(),
        read: false,
    });
    return Promise.resolve();
};

export const getDemoUserByRole = async (role: Role): Promise<UserProfile | null> => {
    return Promise.resolve(USERS.find(u => u.role === role) || null);
}

export const uploadFile = async (folder: string, file: File): Promise<string> => {
    return Promise.resolve(`https://source.unsplash.com/random/400x300/?${folder}`);
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    return Promise.resolve(USERS.find(u => u.id === userId));
};
export const getDJById = async (userId: string): Promise<DJ | undefined> => {
    const user = USERS.find(u => u.id === userId);
    return Promise.resolve(user?.role === Role.DJ ? user as DJ : undefined);
}
export const getDJs = async (): Promise<DJ[]> => {
    return Promise.resolve(USERS.filter(u => u.role === Role.DJ) as DJ[]);
}
export const getBusinesses = async (): Promise<Business[]> => {
    return Promise.resolve(USERS.filter(u => u.role === Role.Business) as Business[]);
}
export const getBusinessById = async (userId: string): Promise<Business | undefined> => {
    const user = USERS.find(u => u.id === userId);
    return Promise.resolve(user?.role === Role.Business ? user as Business : undefined);
}

export const getTopDJs = async (): Promise<DJ[]> => {
    const djs = USERS.filter(u => u.role === Role.DJ) as DJ[];
    return Promise.resolve(djs.sort((a,b) => b.rating - a.rating));
}

export const getTopVenues = async (): Promise<Business[]> => {
    const venues = USERS.filter(u => u.role === Role.Business) as Business[];
    return Promise.resolve(venues.sort((a,b) => b.rating - a.rating));
}

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const existingUser = USERS[userIndex];
        switch (existingUser.role) {
            case Role.DJ:
                USERS[userIndex] = { ...existingUser, ...(data as Partial<DJ>) };
                break;
            case Role.Business:
                USERS[userIndex] = { ...existingUser, ...(data as Partial<Business>) };
                break;
            case Role.Listener:
                 USERS[userIndex] = { ...existingUser, ...(data as Partial<Listener>) };
                break;
        }
    }
    return Promise.resolve(true);
};

export const updateUserSettings = async(userId: string, settings: Partial<UserSettings>): Promise<boolean> => {
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        USERS[userIndex].settings = { ...USERS[userIndex].settings, ...settings };
    }
    return Promise.resolve(true);
}

// Follows
export const followUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    const currentUser = USERS.find(u => u.id === currentUserId) as (DJ | Business | Listener);
    const targetUser = USERS.find(u => u.id === targetUserId) as (DJ | Business | Listener);
    if (currentUser && targetUser && !currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        targetUser.followers += 1;
    }
    return Promise.resolve(true);
}
export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
     const currentUser = USERS.find(u => u.id === currentUserId) as (DJ | Business | Listener);
    const targetUser = USERS.find(u => u.id === targetUserId) as (DJ | Business | Listener);
    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers -= 1;
    }
    return Promise.resolve(true);
}

export const getFollowersForUser = async (userId: string): Promise<UserProfile[]> => {
    const followers = USERS.filter(user => user.following.includes(userId));
    return Promise.resolve(followers);
};


export const getFollowingForUser = async (userId: string): Promise<UserProfile[]> => {
    const user = USERS.find(u => u.id === userId);
    if (!user) {
        return Promise.resolve([]);
    }
    
    // It is safe to access `following` as all UserProfile types implement Followable
    const followingIds = user.following;
    const followingUsers = USERS.filter(potentialFollow => followingIds.includes(potentialFollow.id));
    return Promise.resolve(followingUsers);
};


// Gigs
export const getGigById = async (id: string): Promise<Gig | undefined> => Promise.resolve(GIGS.find(g => g.id === id));
export const getGigs = async (): Promise<Gig[]> => Promise.resolve(GIGS);
export const getGigsForVenue = async (businessUserId: string): Promise<Gig[]> => Promise.resolve(GIGS.filter(g => g.business_user_id === businessUserId));
export const addGig = async (gigData: Omit<Gig, 'id' | 'status'>): Promise<Gig | null> => {
    const newGig: Gig = { ...gigData, id: uuidv4(), status: 'Open', interestCount: 0 };
    GIGS.unshift(newGig);
    
    // Post to feed
    const venue = await getBusinessById(newGig.business_user_id);
    if (venue) {
        await addFeedItem({
            type: 'gig_announcement',
            userId: newGig.business_user_id,
            title: newGig.title,
            description: `Now hiring DJs at ${venue.name}!`,
            mediaUrl: newGig.flyerUrl,
            mediaType: 'image',
            relatedId: newGig.id
        });
    }
    
    return Promise.resolve(newGig);
}
export const updateGig = async (gigId: string, updatedData: Partial<Gig>): Promise<Gig | null> => {
    const gigIndex = GIGS.findIndex(g => g.id === gigId);
    if (gigIndex > -1) {
        GIGS[gigIndex] = { ...GIGS[gigIndex], ...updatedData };
        return Promise.resolve(GIGS[gigIndex]);
    }
    return Promise.resolve(null);
}
export const expressInterestInGig = async (gigId: string, djUserId: string): Promise<boolean> => {
    GIG_APPLICATIONS.push({ gig_id: gigId, dj_user_id: djUserId });
    const gig = GIGS.find(g => g.id === gigId);
    if (gig) gig.interestCount = (gig.interestCount || 0) + 1;
    return Promise.resolve(true);
}
export const getInterestedDJsForGig = async (gigId: string): Promise<DJ[]> => {
    const djIds = GIG_APPLICATIONS.filter(app => app.gig_id === gigId).map(app => app.dj_user_id);
    const djs = USERS.filter(u => djIds.includes(u.id) && u.role === Role.DJ) as DJ[];
    return Promise.resolve(djs);
}
export const bookDJForGig = async (gigId: string, djUserId: string, agreedRate: number): Promise<boolean> => {
    const gig = GIGS.find(g => g.id === gigId);
    if(gig) {
        gig.status = 'Booked';
        gig.bookedDjId = djUserId;
    }
    return Promise.resolve(true);
}
export const getInterestedGigsForDj = async (djId: string): Promise<Gig[]> => {
     const gigIds = GIG_APPLICATIONS.filter(app => app.dj_user_id === djId).map(app => app.gig_id);
     return Promise.resolve(GIGS.filter(g => gigIds.includes(g.id)));
}
export const getBookedGigsForDj = async (djId: string): Promise<Gig[]> => Promise.resolve(GIGS.filter(g => g.bookedDjId === djId && g.status === 'Booked'));
export const getCompletedGigsForDj = async (djId: string): Promise<Gig[]> => Promise.resolve(GIGS.filter(g => g.bookedDjId === djId && g.status === 'Completed'));

// Feed
export const getFeedItems = async (): Promise<FeedItem[]> => Promise.resolve([...FEED_ITEMS].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
export const getFeedItemById = async (id: string): Promise<FeedItem | undefined> => Promise.resolve(FEED_ITEMS.find(f => f.id === id));
export const addFeedItem = async (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>): Promise<FeedItem | null> => {
    const newPost: FeedItem = { ...item, id: uuidv4(), timestamp: new Date().toISOString(), likes: 0, comments: 0, reposts: 0, likedBy: [] };
    FEED_ITEMS.unshift(newPost);
    return Promise.resolve(newPost);
}
export const repost = async (originalPostId: string, userId: string): Promise<FeedItem | null> => {
    const originalPost = FEED_ITEMS.find(p => p.id === originalPostId);
    if (!originalPost || originalPost.repostOf) { // Cannot repost a repost
        console.warn("Cannot repost a repost.");
        return Promise.resolve(null);
    }
    const repost: FeedItem = {
        id: uuidv4(), userId, type: 'user_post', title: '', description: '', repostOf: originalPostId,
        timestamp: new Date().toISOString(), likes: 0, comments: 0, reposts: 0, likedBy: []
    };
    originalPost.reposts++;
    FEED_ITEMS.unshift(repost);
    return Promise.resolve(repost);
};
export const getCommentsForPost = async (postId: string): Promise<EnrichedComment[]> => Promise.resolve(COMMENTS.filter(c => c.postId === postId));
export const addCommentToPost = async (postId: string, userId: string, content: string): Promise<EnrichedComment | null> => {
    const author = await getUserById(userId);
    if (!author) return null;
    const newComment: EnrichedComment = { id: uuidv4(), postId, authorId: userId, text: content, timestamp: new Date().toISOString(), author };
    COMMENTS.push(newComment);
    const post = FEED_ITEMS.find(p => p.id === postId);
    if (post) post.comments++;
    return Promise.resolve(newComment);
};
export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
    const post = FEED_ITEMS.find(p => p.id === postId);
    if (post) {
        const likedIndex = (post.likedBy || []).indexOf(userId);
        if (likedIndex > -1) {
            post.likes--;
            post.likedBy!.splice(likedIndex, 1);
        } else {
            post.likes++;
            if (!post.likedBy) post.likedBy = [];
            post.likedBy.push(userId);
        }
    }
    return Promise.resolve(true);
}

// Chat
export const getEnrichedChatsForUser = async (userId: string): Promise<EnrichedChat[]> => {
    const chatsMap = new Map<string, EnrichedChat>();
    MESSAGES.forEach(msg => {
        if (msg.senderId === userId || msg.recipientId === userId) {
            const otherId = msg.senderId === userId ? msg.recipientId : msg.senderId;
            if (!chatsMap.has(otherId)) {
                const otherParticipantProfile = USERS.find(u => u.id === otherId);
                if (otherParticipantProfile) {
                    chatsMap.set(otherId, { id: otherId, participants: [userId, otherId], messages: [], otherParticipant: otherParticipantProfile });
                }
            }
            const chat = chatsMap.get(otherId);
            if (chat) {
                chat.messages.push(msg);
            }
        }
    });
    return Promise.resolve(Array.from(chatsMap.values()));
}
export const sendMessage = async (senderId: string, recipientId: string, content: string): Promise<Message | null> => {
    const newMessage: Message = { id: uuidv4(), senderId, recipientId, text: content, timestamp: new Date().toISOString() };
    MESSAGES.push(newMessage);
    return Promise.resolve(newMessage);
}
export const findChatByParticipants = async (userId1: string, userId2: string): Promise<Chat | null> => {
    const existing = MESSAGES.some(m => (m.senderId === userId1 && m.recipientId === userId2) || (m.senderId === userId2 && m.recipientId === userId1));
    return existing ? Promise.resolve({ id: userId2, participants: [userId1, userId2], messages: [] }) : Promise.resolve(null);
}
export const createChat = async (userId1: string, userId2: string): Promise<Chat | null> => {
    return Promise.resolve({ id: userId2, participants: [userId1, userId2], messages: [] });
}
export const getChatById = async (chatId: string): Promise<Chat | null> => {
    // chatId is other participant's ID in this mocked setup
    return Promise.resolve({ id: chatId, participants: ["a", "b"], messages: [] });
}


// Media
export const getTracksForDj = async (djUserId: string): Promise<Track[]> => Promise.resolve(TRACKS.filter(t => t.artistId === djUserId));
export const getPlaylistsForDj = async (djUserId: string): Promise<Playlist[]> => Promise.resolve(PLAYLISTS.filter(p => p.creatorId === djUserId));
export const getPlaylistById = async (id: string): Promise<Playlist | null> => Promise.resolve(PLAYLISTS.find(p => p.id === id) || null);
export const getTrackById = async (id: string): Promise<Track | null> => Promise.resolve(TRACKS.find(t => t.id === id) || null);
export const getTracksByIds = async (ids: string[]): Promise<Track[]> => Promise.resolve(TRACKS.filter(t => ids.includes(t.id)));
export const addTrack = async (userId: string, title: string, artworkUrl: string, trackUrl: string): Promise<boolean> => {
    const newTrack: Track = { id: uuidv4(), artistId: userId, title, artworkUrl, trackUrl, duration: `${Math.floor(Math.random()*5)+2}:${Math.floor(Math.random()*60).toString().padStart(2, '0')}`};
    TRACKS.push(newTrack);
    const djUser = USERS.find(u => u.id === userId);
    if (djUser && djUser.role === Role.DJ) {
        const dj = djUser as DJ;
        dj.tracks.push(newTrack);

        // Post to feed
        await addFeedItem({
            type: 'new_track',
            userId: userId,
            title: `${dj.name} just dropped a new track!`,
            description: title,
            mediaUrl: artworkUrl,
            mediaType: 'image',
            relatedId: newTrack.id,
        });
    }
    return Promise.resolve(true);
}
export const createPlaylist = async (playlistData: Omit<Playlist, 'id'>): Promise<Playlist | null> => {
    const newPlaylist: Playlist = { ...playlistData, id: uuidv4() };
    PLAYLISTS.push(newPlaylist);
    return Promise.resolve(newPlaylist);
}
export const updatePlaylist = async (playlistId: string, playlistData: Partial<Playlist>): Promise<Playlist | null> => {
     const playlistIndex = PLAYLISTS.findIndex(p => p.id === playlistId);
    if (playlistIndex > -1) {
        PLAYLISTS[playlistIndex] = { ...PLAYLISTS[playlistIndex], ...playlistData };
        return Promise.resolve(PLAYLISTS[playlistIndex]);
    }
    return Promise.resolve(null);
}
export const addTrackToPlaylist = async (playlistId: string, track: Track): Promise<boolean> => {
    const playlist = PLAYLISTS.find(p => p.id === playlistId);
    if (playlist && !playlist.trackIds.includes(track.id)) {
        playlist.trackIds.push(track.id);
    }
    return Promise.resolve(true);
}

export const deletePlaylist = async (playlistId: string, userId: string): Promise<boolean> => {
    const initialLength = PLAYLISTS.length;
    PLAYLISTS = PLAYLISTS.filter(p => !(p.id === playlistId && p.creatorId === userId));
    return Promise.resolve(PLAYLISTS.length < initialLength);
};

export const deleteTrack = async (userId: string, trackId: string): Promise<boolean> => {
    // Remove from global TRACKS array
    TRACKS = TRACKS.filter(t => t.id !== trackId);

    // Remove from the DJ's profile
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1 && USERS[userIndex].role === Role.DJ) {
        const dj = USERS[userIndex] as DJ;
        dj.tracks = dj.tracks.filter(t => t.id !== trackId);
    }
    
    // Remove from any playlists
    PLAYLISTS.forEach(p => {
        if (p.creatorId === userId) {
            p.trackIds = p.trackIds.filter(id => id !== trackId);
        }
    });

    return Promise.resolve(true);
};

// Reviews
export const getReviewsForUser = async (revieweeId: string): Promise<EnrichedReview[]> => Promise.resolve(REVIEWS.filter(r => r.targetId === revieweeId));
export const submitReview = async (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review | null> => {
    const author = await getUserById(reviewData.authorId);
    const target = await getUserById(reviewData.targetId);

    if (!author || !target) return null;

    const newReview: EnrichedReview = { ...reviewData, id: uuidv4(), timestamp: new Date().toISOString(), author };
    REVIEWS.push(newReview);
    
    // Recalculate rating and review count from scratch to ensure accuracy
    const allUserReviews = REVIEWS.filter(r => r.targetId === target.id);
    const newReviewsCount = allUserReviews.length;
    const newRating = newReviewsCount > 0
        ? allUserReviews.reduce((sum, review) => sum + review.rating, 0) / newReviewsCount
        : 0;
        
    if ('reviewsCount' in target && 'rating' in target) {
        target.reviewsCount = newReviewsCount;
        target.rating = newRating;
    }
    
    // Create feed item
    await addFeedItem({
        type: 'new_review',
        userId: target.id,
        title: `${author.name} left a new review for ${target.name}`,
        description: reviewData.comment || `Rated ${reviewData.rating} out of 5 stars.`,
        rating: reviewData.rating,
        relatedId: newReview.id,
    });

    return Promise.resolve(newReview);
};


// Streams
export const createStreamSession = async (djId: string, title: string): Promise<StreamSession> => Promise.resolve({id: uuidv4(), djId, title, isLive: true, listenerCount: 0});
export const getStreamSessionById = async (sessionId: string): Promise<StreamSession | null> => Promise.resolve({id: sessionId, djId: 'dj-1', title: 'Live Techno Set', isLive: true, listenerCount: Math.floor(Math.random()*100)+50});
export const endStreamSession = async (sessionId: string): Promise<boolean> => Promise.resolve(true);

// Notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => Promise.resolve(NOTIFICATIONS.filter(n => n.userId === userId));
export const markAllAsRead = async (userId: string): Promise<boolean> => {
    NOTIFICATIONS.forEach(n => { if (n.userId === userId) n.read = true });
    return Promise.resolve(true);
}

// Search
export const searchUsers = async (query: string): Promise<UserProfile[]> => Promise.resolve(USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase())));

// Auth
export const signUpWithEmail = async (email: string, password: string, name: string, role: Role) => {
    return Promise.resolve({ user: { id: uuidv4(), email, user_metadata: { display_name: name, user_type: role } }, error: null });
}

// Dev
export const seedDatabase = async (): Promise<any> => Promise.resolve({djs: [], businesses: [], gigs: [], tracks: [], playlists: []});