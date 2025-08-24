
import { supabase } from './supabaseClient';
import { 
    DJ, 
    Business, 
    Gig, 
    Track, 
    Playlist, 
    Role, 
    UserProfile,
    DjProfile,
    BusinessProfile,
    Notification, 
    Message, 
    Review, 
    FeedItem as Post,
    Comment as PostComment,
    User,
    EnrichedReview,
    EnrichedComment,
    StreamSession,
    UserSettings,
    EnrichedChat,
    Chat,
    Tier,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Database } from './database.types';

type UserProfileRow = Database['public']['Tables']['app_e255c3cdb5_user_profiles']['Row'];
type DjProfileRow = Database['public']['Tables']['app_e255c3cdb5_dj_profiles']['Row'];
type BusinessProfileRow = Database['public']['Tables']['app_e255c3cdb5_business_profiles']['Row'];


/**
 * A helper function to process user profile data from Supabase.
 * It maps the `user_type` database column to the `role` property
 * expected by the application frontend, and maps snake_case fields
 * to camelCase fields in the User type.
 * @param userProfileData The raw user profile data from the database.
 * @returns A processed user profile object with a `role` property, or null.
 */
function processUserProfile(userProfileData: any): any | null {
    if (!userProfileData) return null;
    return {
        ...userProfileData,
        id: userProfileData.user_id,
        name: userProfileData.display_name,
        avatarUrl: userProfileData.avatar_url,
        role: userProfileData.user_type,
    };
}

export const getDJById = async (userId: string): Promise<DJ | undefined> => {
    const { data: userProfileData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (userError || !userProfileData) {
        if (userError && !userError.message.includes('rows returned')) {
            console.error("Error fetching user profile for DJ:", userError);
        }
        return undefined;
    }
    
    const userProfile = processUserProfile(userProfileData);

    if (userProfile.role !== 'dj') {
        return undefined; // Not a DJ
    }

    const { data, error: djError } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    const djProfile = data as DjProfileRow | null;

    if (djError || !djProfile) {
        console.error("Error fetching DJ profile:", djError);
        return undefined;
    }

    const result: DJ = {
        ...(userProfile as User),
        role: Role.DJ,
        genres: djProfile.genres,
        bio: djProfile.bio,
        location: djProfile.location,
        rating: djProfile.rating,
        reviewsCount: djProfile.reviews_count,
        tier: djProfile.tier as Tier,
        socials: djProfile.socials as any,
        // Mocked properties not in DB
        following: [],
        followers: Math.floor(Math.random() * 2000),
        tracks: [],
        mixes: [],
    };

    return result;
};

export const getDJs = async (): Promise<DJ[]> => {
    const { data, error: djError } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('*');

    const djProfiles = data as DjProfileRow[];

    if (djError) {
        console.error("Error fetching DJ profiles:", djError);
        return [];
    }
    if (!djProfiles) return [];

    const userIds = djProfiles.map(p => p.user_id);
    if (userIds.length === 0) return [];

    const { data: userProfilesData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', userIds);
    
    const userProfiles = userProfilesData as UserProfileRow[];

    if (userError) {
        console.error("Error fetching user profiles for DJs:", userError);
        return [];
    }
    if (!userProfiles) return [];

    const djsData = djProfiles.map(djProfile => {
        const userProfileData = userProfiles.find(up => up.user_id === djProfile.user_id);
        if (!userProfileData) return null;
        const userProfile = processUserProfile(userProfileData);
        return { 
            ...(userProfile as User), 
            role: Role.DJ,
            genres: djProfile.genres,
            bio: djProfile.bio,
            location: djProfile.location,
            rating: djProfile.rating,
            tier: djProfile.tier as Tier,
            socials: djProfile.socials as any,
            // Mocked properties
            following: [],
            followers: Math.floor(Math.random() * 2000),
            tracks: [],
            mixes: [],
            reviewsCount: djProfile.reviews_count,
        } as DJ;
    }).filter((dj): dj is DJ => Boolean(dj));

    return djsData;
};


export const getBusinesses = async (): Promise<Business[]> => {
    const { data, error: bizError } = await supabase
        .from('app_e255c3cdb5_business_profiles')
        .select('*');

    const businessProfiles = data as BusinessProfileRow[];

    if (bizError) {
        console.error("Error fetching business profiles:", bizError);
        return [];
    }
    if (!businessProfiles) return [];

    const userIds = businessProfiles.map(p => p.user_id);
    if (userIds.length === 0) return [];

    const { data: userProfilesData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', userIds);
        
    const userProfiles = userProfilesData as UserProfileRow[];

    if (userError) {
        console.error("Error fetching user profiles for businesses:", userError);
        return [];
    }
    if (!userProfiles) return [];

    const businessesData = businessProfiles.map(businessProfile => {
        const userProfileData = userProfiles.find(up => up.user_id === businessProfile.user_id);
        if (!userProfileData) return null;
        const userProfile = processUserProfile(userProfileData);
        return { 
            ...(userProfile as User), 
            role: Role.Business,
            name: businessProfile.venue_name,
            location: businessProfile.location,
            description: businessProfile.description,
            rating: businessProfile.rating,
            reviewsCount: businessProfile.reviews_count,
            socials: businessProfile.socials as any,
             // Mocked properties
            following: [],
            followers: Math.floor(Math.random() * 5000),
        } as Business;
    }).filter((biz): biz is Business => Boolean(biz));

    return businessesData;
};

export const getBusinessById = async (userId: string): Promise<Business | undefined> => {
    const { data: userProfileData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (userError || !userProfileData) {
        if (userError && !userError.message.includes('rows returned')) {
            console.error("Error fetching user profile for business:", userError);
        }
        return undefined;
    }
    
    const userProfile = processUserProfile(userProfileData);

    if (userProfile.role !== 'business') {
        return undefined; // Not a business
    }

    const { data, error: bizError } = await supabase
        .from('app_e255c3cdb5_business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
    const businessProfile = data as BusinessProfileRow;

    if (bizError || !businessProfile) {
        console.error("Error fetching business profile:", bizError);
        return undefined;
    }

    const result: Business = {
        ...(userProfile as User),
        role: Role.Business,
        name: businessProfile.venue_name,
        location: businessProfile.location,
        description: businessProfile.description,
        rating: businessProfile.rating,
        reviewsCount: businessProfile.reviews_count,
        socials: businessProfile.socials as any,
        // Mocked properties
        following: [],
        followers: Math.floor(Math.random() * 5000),
    };

    return result;
}

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    const { data: userProfile, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (!error.message.includes('rows returned')) {
            console.error('Error fetching user profile:', error);
        }
        return undefined;
    }
    return processUserProfile(userProfile) || undefined;
};


export const getGigById = async (id: string): Promise<Gig | undefined> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_gigs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (!error.message.includes('rows returned')) {
            console.error('Error fetching gig by id:', error);
        }
        return undefined;
    }
    return data as Gig || undefined;
};

export const getGigs = async (): Promise<Gig[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_gigs')
        .select('*');

    if (error) {
        console.error('Error fetching gigs:', error);
        return [];
    }
    return (data || []) as Gig[];
};
export const getGigsForVenue = async (businessUserId: string): Promise<Gig[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_gigs')
        .select('*')
        .eq('business_user_id', businessUserId);

    if (error) {
        console.error('Error fetching gigs for venue:', error);
        return [];
    }
    return (data || []) as Gig[];
};

export const getVenueByGig = async (gigId: string): Promise<Business | undefined> => {
    const gig = await getGigById(gigId);
    if (!gig) return undefined;
    
    return getBusinessById(gig.business_user_id);
};

export const getPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return (data as any[]) || [];
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (!error.message.includes('rows returned')) {
            console.error('Error fetching post by id:', error);
        }
        return undefined;
    }
    return (data as any) || undefined;
};

export const addPost = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'timestamp' | 'likes' | 'likedBy' | 'comments' | 'reposts'>): Promise<Post | null> => {
    const newPost: Database['public']['Tables']['app_e255c3cdb5_posts']['Insert'] = {
        user_id: postData.userId,
        content: postData.description,
        media_url: postData.mediaUrl,
        media_type: postData.mediaType
    };
    
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_posts') as any)
        .insert([newPost])
        .select()
        .single();

    if (error) {
        console.error('Error adding post:', error);
        return null;
    }
    return data as any;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
    return (data as any[] || []).map(n => ({...n, read: n.is_read, relatedId: n.related_id, userId: n.user_id}));
};

export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_playlists')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching playlist:', error);
        return null;
    }
    return data as any as Playlist | null;
};

export const markAllAsRead = async (userId: string): Promise<boolean> => {
    const { error } = await (supabase
        .from('app_e255c3cdb5_notifications') as any)
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (error) {
        console.error('Error marking notifications as read:', error);
        return false;
    }
    return true;
};

export const getEnrichedChatsForUser = async (userId: string): Promise<EnrichedChat[]> => { // TODO: Define EnrichedChat type
    const { data, error } = await supabase
        .from('app_e255c3cdb5_messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: true });

    const messages = data as Database['public']['Tables']['app_e255c3cdb5_messages']['Row'][];
    
    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    if (!messages) return [];

    const otherUserIds = [...new Set(messages.map(m => m.sender_id === userId ? m.recipient_id : m.sender_id))];
    
    const { data: profilesData, error: profileError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', otherUserIds);

    const profiles = profilesData as UserProfileRow[];

    if (profileError) {
        console.error('Error fetching participant profiles:', profileError);
        return [];
    }
    if (!profiles) return [];

    const chatsMap = new Map<string, any>();
    profiles.forEach(p => {
        const processedP = processUserProfile(p);
        chatsMap.set(p.user_id, {
            id: p.user_id, // using other user id as chat id for simplicity
            participants: [userId, p.user_id],
            messages: [],
            otherParticipant: processedP,
        });
    });

    messages.forEach(message => {
        const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        if (chatsMap.has(otherUserId)) {
            const chatMsg: Message = { id: message.id, senderId: message.sender_id, text: message.content, timestamp: message.created_at };
            chatsMap.get(otherUserId).messages.push(chatMsg);
        }
    });

    return Array.from(chatsMap.values());
};

export const sendMessage = async (senderId: string, recipientId: string, content: string): Promise<Message | null> => {
    const message: Database['public']['Tables']['app_e255c3cdb5_messages']['Insert'] = { 
        sender_id: senderId, 
        recipient_id: recipientId, 
        content: content 
    };

    const { data, error } = await (supabase
        .from('app_e255c3cdb5_messages') as any)
        .insert([message])
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }
    const result = data as Database['public']['Tables']['app_e255c3cdb5_messages']['Row'];
    return { id: result.id, senderId: result.sender_id, text: result.content, timestamp: result.created_at };
};

export const signUpWithEmail = async (email: string, password: string, name: string, role: Role) => {
    // The `data` option passes metadata that can be used in a database trigger
    // to create the corresponding user profile upon signup.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name,
                user_type: role,
                avatar_url: `https://source.unsplash.com/random/200x200/?abstract,${role}`
            },
        },
    });
    // A trigger on the auth.users table should handle creating the public profile.
    return { user: data.user, error };
};

export const signInWithGoogle = async (role?: Role) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            data: role ? { user_type: role } : undefined,
        } as any,
    });
    return { error };
};

export const authenticate = async (email: string, password: string): Promise<UserProfile | undefined> => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error.message);
        throw error;
    }

    if (!user) {
        return undefined;
    }
    
    // After login, fetch the full profile to get role-specific data
    let profile: UserProfile | DJ | Business | undefined = await getUserById(user.id);
    if (!profile) {
        console.error("User logged in but profile not found:", user.id);
        throw new Error("User profile not found after login.");
    }
    
    if (profile.role === Role.DJ) {
        profile = await getDJById(user.id);
    }
    if (profile.role === Role.Business) {
        profile = await getBusinessById(user.id);
    }
    
    if (profile) {
        profile.email = user.email!;
    }
    
    return profile;
};

export const addGig = async (gigData: Omit<Gig, 'id' | 'status'>): Promise<Gig | null> => {
     const newGig: Omit<Database['public']['Tables']['app_e255c3cdb5_gigs']['Insert'], 'id'> = {
        ...gigData,
        status: 'Open'
    };
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_gigs') as any)
        .insert([newGig])
        .select()
        .single();

    if (error) {
        console.error('Error adding gig:', error);
        return null;
    }
    return data as any;
};

export const updateGig = async (gigId: string, updatedData: Partial<Gig>): Promise<Gig | null> => {
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_gigs') as any)
        .update(updatedData)
        .eq('id', gigId)
        .select()
        .single();

    if (error) {
        console.error('Error updating gig:', error);
        return null;
    }
    return data as any;
};

export const expressInterestInGig = async (gigId: string, djUserId: string): Promise<boolean> => {
    const application: Database['public']['Tables']['app_e255c3cdb5_gig_applications']['Insert'] = { 
        gig_id: gigId, 
        dj_user_id: djUserId, 
        status: 'pending' 
    };
    const { error } = await (supabase
        .from('app_e255c3cdb5_gig_applications') as any)
        .insert([application]);

    if (error) {
        console.error('Error expressing interest in gig:', error);
        return false;
    }
    return true;
};

export const getInterestedDJsForGig = async (gigId: string): Promise<DJ[]> => {
    const { data: applications, error } = await supabase
        .from('app_e255c3cdb5_gig_applications')
        .select('dj_user_id')
        .eq('gig_id', gigId);

    if (error) {
        console.error('Error fetching interested DJs:', error);
        return [];
    }
    if (!applications) return [];

    const djUserIds = (applications as any[]).map(app => app.dj_user_id);
    if (djUserIds.length === 0) return [];

    const allDjs = await getDJs();
    return allDjs.filter(dj => djUserIds.includes(dj.id));
};

export const bookDJForGig = async (gigId: string, djUserId: string, agreedRate: number): Promise<boolean> => {
    const { error: gigError } = await (supabase
        .from('app_e255c3cdb5_gigs') as any)
        .update({ status: 'Booked', booked_dj_id: djUserId })
        .eq('id', gigId);

    if (gigError) {
        console.error('Error updating gig status:', gigError);
        return false;
    }

    const gig = await getGigById(gigId);
    if (!gig) return false;

    const booking: Database['public']['Tables']['app_e255c3cdb5_bookings']['Insert'] = { 
        gig_id: gigId, 
        dj_user_id: djUserId, 
        business_user_id: gig.business_user_id, 
        agreed_rate: agreedRate 
    };
    const { error: bookingError } = await (supabase
        .from('app_e255c3cdb5_bookings') as any)
        .insert([booking]);

    if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return false;
    }
    
    return true;
};

export const getTopDJs = async (): Promise<DJ[]> => {
    const { data, error: djError } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('*')
        .limit(50);
    const djProfiles = data as DjProfileRow[];
    
    if (djError) { console.error(djError); return []; }
    if (!djProfiles) return [];

    const userIds = djProfiles.map(p => p.user_id);
    const { data: userProfilesData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', userIds);
    const userProfiles = userProfilesData as UserProfileRow[];

    if (userError) { console.error(userError); return []; }
    if (!userProfiles) return [];

    const djs = djProfiles.map(djProfile => {
        const userProfileData = userProfiles.find(up => up.user_id === djProfile.user_id);
        if (!userProfileData) return null;
        const userProfile = processUserProfile(userProfileData);
        return { 
            ...(userProfile as User), 
            role: Role.DJ,
            genres: djProfile.genres,
            bio: djProfile.bio,
            location: djProfile.location,
            rating: djProfile.rating,
            tier: djProfile.tier as Tier,
            socials: djProfile.socials as any,
            reviewsCount: djProfile.reviews_count,
            following: [],
            followers: 0,
            tracks: [],
            mixes: [],
         } as DJ;
    }).filter((dj): dj is DJ => Boolean(dj));

    return djs;
};

export const getTopVenues = async (): Promise<Business[]> => {
    const { data, error: bizError } = await supabase
        .from('app_e255c3cdb5_business_profiles')
        .select('*')
        .limit(50);
    const businessProfiles = data as BusinessProfileRow[];
    
    if (bizError) { console.error(bizError); return []; }
    if (!businessProfiles) return [];

    const userIds = businessProfiles.map(p => p.user_id);
    const { data: userProfilesData, error: userError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', userIds);
    const userProfiles = userProfilesData as UserProfileRow[];

    if (userError) { console.error(userError); return []; }
    if (!userProfiles) return [];

    const businesses = businessProfiles.map(businessProfile => {
        const userProfileData = userProfiles.find(up => up.user_id === businessProfile.user_id);
        if (!userProfileData) return null;
        const userProfile = processUserProfile(userProfileData);
        return { 
            ...(userProfile as User), 
            role: Role.Business,
            name: businessProfile.venue_name,
            location: businessProfile.location,
            description: businessProfile.description,
            rating: businessProfile.rating,
            socials: businessProfile.socials as any,
            reviewsCount: businessProfile.reviews_count,
            following: [],
            followers: 0,
         } as Business;
    }).filter((biz): biz is Business => Boolean(biz));

    return businesses;
};

export const followUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    console.warn("Follow functionality is not supported by the current database schema.");
    return true;
}

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    console.warn("Unfollow functionality is not supported by the current database schema.");
    return true;
}

export const getFollowersForUser = async (userId: string): Promise<UserProfile[]> => {
    console.warn("Get followers functionality is not supported by the current database schema.");
    return [];
}

export const getFollowingForUser = async (userId: string): Promise<UserProfile[]> => {
    console.warn("Get following functionality is not supported by the current database schema.");
    return [];
}

export const getTracksForDj = async (djUserId: string): Promise<Track[]> => {
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_dj_profiles') as any)
        .select('portfolio_tracks')
        .eq('user_id', djUserId)
        .single();

    if (error) {
        console.error('Error fetching tracks for DJ:', error);
        return [];
    }
    return data ? (data.portfolio_tracks as Track[] | null) || [] : [];
};

export const getPlaylistsForDj = async (djUserId: string): Promise<Playlist[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_playlists')
        .select('*')
        .eq('dj_user_id', djUserId);

    if (error) {
        console.error('Error fetching playlists for DJ:', error);
        return [];
    }
    return (data as any[] || []).map(p => ({...p, creatorId: p.dj_user_id, trackIds: p.tracks?.map((t:any) => t.id) || [] }));
};

export const addTrackToPortfolio = async (djUserId: string, track: Track): Promise<boolean> => {
    const { error } = await (supabase as any).rpc('add_track_to_portfolio', {
        dj_user_id_param: djUserId,
        new_track: track
    });

    if (error) {
        console.error('Error adding track to portfolio:', error);
        return false;
    }
    return true;
};

export const createPlaylist = async (playlistData: Omit<Playlist, 'id' | 'tracks'>): Promise<Playlist | null> => {
    const newPlaylist: Database['public']['Tables']['app_e255c3cdb5_playlists']['Insert'] = { 
        dj_user_id: playlistData.creatorId, 
        name: playlistData.name, 
        artwork_url: playlistData.artworkUrl, 
        tracks: [] 
    };
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_playlists') as any)
        .insert([newPlaylist])
        .select()
        .single();

    if (error) {
        console.error('Error creating playlist:', error);
        return null;
    }
    return data as any;
};

export const updatePlaylist = async (playlistId: string, playlistData: Partial<Omit<Playlist, 'id' | 'dj_user_id' | 'tracks'>>): Promise<Playlist | null> => {
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_playlists') as any)
        .update({ name: playlistData.name, artwork_url: playlistData.artworkUrl })
        .eq('id', playlistId)
        .select()
        .single();

    if (error) {
        console.error('Error updating playlist:', error);
        return null;
    }
    return data as any;
};

export const addTrackToPlaylist = async (playlistId: string, track: Track): Promise<boolean> => {
    const { error } = await (supabase as any).rpc('add_track_to_playlist', {
        playlist_id_param: playlistId,
        new_track: track
    });

    if (error) {
        console.error('Error adding track to playlist:', error);
        return false;
    }
    return true;
};

export const getReviewsForUser = async (revieweeId: string): Promise<EnrichedReview[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_reviews')
        .select('*')
        .eq('reviewee_id', revieweeId);
    
    const reviews = data as Database['public']['Tables']['app_e255c3cdb5_reviews']['Row'][];

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    if(!reviews) return [];

    const authorIds = [...new Set(reviews.map(r => r.reviewer_id))];
    if (authorIds.length === 0) return reviews.map(review => ({
        id: review.id,
        authorId: review.reviewer_id,
        targetId: review.reviewee_id,
        rating: review.rating,
        comment: review.comment,
        timestamp: review.created_at,
        gigId: review.gig_id,
        author: null as any, // Should not happen if authorIds logic is correct
    }));

    const { data: authorsData, error: authorError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', authorIds);
    
    const authors = authorsData as UserProfileRow[];

    if (authorError) {
        console.error('Error fetching review authors:', authorError);
        return []; // Or return reviews without authors
    }

    const authorMap = new Map(authors?.map(a => [a.user_id, processUserProfile(a)]));

    return reviews.map(review => ({
        id: review.id,
        authorId: review.reviewer_id,
        targetId: review.reviewee_id,
        rating: review.rating,
        comment: review.comment,
        timestamp: review.created_at,
        gigId: review.gig_id,
        author: authorMap.get(review.reviewer_id)!,
    }));
};

export const submitReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'timestamp'>): Promise<Review | null> => {
    const dbReview: Database['public']['Tables']['app_e255c3cdb5_reviews']['Insert'] = {
        reviewer_id: reviewData.authorId,
        reviewee_id: reviewData.targetId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        gig_id: reviewData.gigId
    };
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_reviews') as any)
        .insert([dbReview])
        .select()
        .single();

    if (error) {
        console.error('Error submitting review:', error);
        return null;
    }
    return data as any;
};

export const getCommentsForPost = async (postId: string): Promise<EnrichedComment[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    
    const comments = data as Database['public']['Tables']['app_e255c3cdb5_post_comments']['Row'][];

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    if(!comments) return [];
    
    const authorIds = [...new Set(comments.map(c => c.user_id))];
    if (authorIds.length === 0) return [];
    const { data: authorsData, error: authorError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .in('user_id', authorIds);
    
    const authors = authorsData as UserProfileRow[];
    if(authorError) return [];
    
    const authorMap = new Map(authors?.map(a => [a.user_id, processUserProfile(a)]));

    return comments.map(comment => ({
        id: comment.id,
        authorId: comment.user_id,
        postId: comment.post_id,
        text: comment.content,
        timestamp: comment.created_at,
        author: authorMap.get(comment.user_id)!,
    }));
};

export const addCommentToPost = async (postId: string, userId: string, content: string): Promise<EnrichedComment | null> => {
    const newComment: Database['public']['Tables']['app_e255c3cdb5_post_comments']['Insert'] = { 
        post_id: postId, 
        user_id: userId, 
        content: content 
    };
    const { data, error } = await (supabase
        .from('app_e255c3cdb5_post_comments') as any)
        .insert([newComment])
        .select()
        .single();

    if (error) {
        console.error('Error adding comment:', error);
        return null;
    }
    const author = await getUserById(userId);
    if (!author) return null;

    const result = data as Database['public']['Tables']['app_e255c3cdb5_post_comments']['Row'];

    return {
        id: result.id,
        postId,
        authorId: userId,
        text: result.content,
        timestamp: result.created_at,
        author,
    };
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile & { djProfile?: Partial<DjProfile>, businessProfile?: Partial<BusinessProfile> }>): Promise<boolean> => {
    const { djProfile, businessProfile, ...userProfileData } = data;
    const { name, avatarUrl, ...restUser } = userProfileData;
    
    const dbUserProfile: Database['public']['Tables']['app_e255c3cdb5_user_profiles']['Update'] = {};
    if (name) dbUserProfile.display_name = name;
    if (avatarUrl) dbUserProfile.avatar_url = avatarUrl;
    

    if (Object.keys(dbUserProfile).length > 0) {
        const { error } = await (supabase
            .from('app_e255c3cdb5_user_profiles') as any)
            .update(dbUserProfile)
            .eq('user_id', userId);
        if (error) {
            console.error('Error updating user profile:', error);
            return false;
        }
    }

    if (djProfile && Object.keys(djProfile).length > 0) {
        const { error } = await (supabase
            .from('app_e255c3cdb5_dj_profiles') as any)
            .update(djProfile)
            .eq('user_id', userId);
        if (error) {
            console.error('Error updating DJ profile:', error);
            return false;
        }
    }

    if (businessProfile && Object.keys(businessProfile).length > 0) {
        const {name: venue_name, description, ...rest} = businessProfile as any;
        const dbBusinessProfile = {venue_name, description, ...rest};
        const { error } = await (supabase
            .from('app_e255c3cdb5_business_profiles') as any)
            .update(dbBusinessProfile)
            .eq('user_id', userId);
        if (error) {
            console.error('Error updating business profile:', error);
            return false;
        }
    }

    return true;
};

export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
    const { data: like, error: selectError } = await supabase
        .from('app_e255c3cdb5_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

    if (selectError && !selectError.message.includes('rows returned')) {
        console.error('Error checking for like:', selectError);
        return false;
    }

    if (like) {
        const { error: deleteError } = await supabase
            .from('app_e255c3cdb5_post_likes')
            .delete()
            .eq('id', (like as any).id);
        
        if (deleteError) {
            console.error('Error unliking post:', deleteError);
            return false;
        }
    } else {
        const newLike: Database['public']['Tables']['app_e255c3cdb5_post_likes']['Insert'] = { 
            post_id: postId, 
            user_id: userId 
        };
        const { error: insertError } = await (supabase
            .from('app_e255c3cdb5_post_likes') as any)
            .insert([newLike]);

        if (insertError) {
            console.error('Error liking post:', insertError);
            return false;
        }
    }

    return true;
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
    if (!query) return [];
    const lowercasedQuery = query.toLowerCase();
    const { data, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select('*')
        .ilike('display_name', `%${lowercasedQuery}%`)
        .limit(10);
    
    if (error) {
        console.error('Error searching users:', error);
        return [];
    }
    return (data || []).map(processUserProfile) as UserProfile[];
}

// --- MOCK IMPLEMENTATIONS FOR MISSING FUNCTIONS ---

export const getFeedItems = async (): Promise<Post[]> => getPosts();
export const getFeedItemById = async (id: string): Promise<Post | undefined> => getPostById(id);
export const repost = async (originalPostId: string, userId: string): Promise<Post | null> => {
  console.warn("repost mock not implemented");
  return null;
};

export const getTrackById = async (id: string): Promise<Track | null> => {
  // This would require a tracks table. For now, returning mock data.
  return { id, title: "Mock Track", artistId: "1", artworkUrl: "https://source.unsplash.com/random/200x200?music", duration: "3:30", trackUrl: "mock_url" };
};
export const getTracksByIds = async (ids: string[]): Promise<Track[]> => {
  return ids.map(id => ({ id, title: "Mock Track", artistId: "1", artworkUrl: `https://source.unsplash.com/random/200x200?music&sig=${id}`, duration: "3:30", trackUrl: "mock_url" }));
}

export const findChatByParticipants = async (userId1: string, userId2: string): Promise<Chat | null> => {
  // Not a scalable way to do this, but works for mock
  const { data, error } = await supabase.from('app_e255c3cdb5_messages').select('*').or(`(sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1})`).limit(1);
  if (error || !data || data.length === 0) return null;
  return { id: userId2, participants: [userId1, userId2], messages: [] }; // Mocked chat
};

export const createChat = async (userId1: string, userId2: string): Promise<Chat | null> => {
  // In a real app, you'd create a chat room. Here we just return a mock object.
  return { id: userId2, participants: [userId1, userId2], messages: [] };
};

export const getInterestedGigsForDj = async (djId: string): Promise<Gig[]> => {
  const { data, error } = await supabase.from('app_e255c3cdb5_gig_applications').select('gig_id').eq('dj_user_id', djId);
  if (error || !data) return [];
  const gigIds = (data as any[]).map(d => d.gig_id);
  const { data: gigs, error: gigError } = await supabase.from('app_e255c3cdb5_gigs').select('*').in('id', gigIds);
  return (gigs as Gig[]) || [];
}

export const getBookedGigsForDj = async (djId: string): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_bookings').select('gig_id').eq('dj_user_id', djId);
    if(error || !data) return [];
    const gigIds = (data as any[]).map(d => d.gig_id);
    const { data: gigs, error: gigError } = await supabase.from('app_e255c3cdb5_gigs').select('*').in('id', gigIds).eq('status', 'Booked');
    return (gigs as Gig[]) || [];
}

export const getCompletedGigsForDj = async (djId: string): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_bookings').select('gig_id').eq('dj_user_id', djId);
    if(error || !data) return [];
    const gigIds = (data as any[]).map(d => d.gig_id);
    const { data: gigs, error: gigError } = await supabase.from('app_e255c3cdb5_gigs').select('*').in('id', gigIds).eq('status', 'Completed');
    return (gigs as Gig[]) || [];
}

export const getStreamSessionById = async (sessionId: string): Promise<StreamSession | null> => {
    console.warn("getStreamSessionById mock not implemented");
    return { id: sessionId, djId: 'dj-1', title: 'Live Session', isLive: true, listenerCount: 123 };
}
export const endStreamSession = async (sessionId: string): Promise<boolean> => {
    console.warn("endStreamSession mock not implemented");
    return true;
}
export const createStreamSession = async (djId: string, title: string): Promise<StreamSession> => {
    console.warn("createStreamSession mock not implemented");
    const id = uuidv4();
    return { id, djId, title, isLive: true, listenerCount: 0 };
}

export const addFeedItem = async (item: any): Promise<Post | null> => {
    return addPost(item);
}

export const addTrack = async (userId: string, title: string, artworkUrl: string, trackUrl: string): Promise<boolean> => {
    const newTrack: Track = { id: uuidv4(), artistId: userId, title, artworkUrl, trackUrl, duration: '3:30' };
    return addTrackToPortfolio(userId, newTrack);
}

export const seedDatabase = async (): Promise<any> => {
    console.warn("seedDatabase mock not implemented");
    return { djs: [], businesses: [], gigs: [], tracks: [], playlists: [] };
};
export const getChatById = async (chatId: string): Promise<Chat | null> => {
    return { id: chatId, participants: ["a", "b"], messages: [] };
}

export const updateUserSettings = async(userId: string, settings: Partial<UserSettings>): Promise<boolean> => {
    const { error } = await (supabase.from('app_e255c3cdb5_user_profiles') as any).update({ settings: settings }).eq('user_id', userId);
    return !error;
}