
import { supabase } from './supabaseClient';
import { 
    DJ, 
    Business, 
    Gig, 
    Track, 
    Playlist, 
    Role, 
    UserProfile,
    Notification, 
    Message, 
    Review, 
    FeedItem,
    Comment as PostComment,
    User,
    EnrichedReview,
    EnrichedComment,
    StreamSession,
    UserSettings,
    EnrichedChat,
    Chat,
    Tier,
    Listener,
    NotificationType,
    DjProfile,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Database, Json } from './database.types';
import { persistenceService } from './persistenceService';
import { userAppUpdatesService } from './userAppUpdatesService';

// =================================================================
// SECTION: Type Aliases & Constants
// =================================================================

type UserProfileRow = Database['public']['Tables']['app_e255c3cdb5_user_profiles']['Row'];
type DjProfileRow = Database['public']['Tables']['app_e255c3cdb5_dj_profiles']['Row'];
type BusinessProfileRow = Database['public']['Tables']['app_e255c3cdb5_business_profiles']['Row'];
type PostRow = Database['public']['Tables']['app_e255c3cdb5_posts']['Row'];
type CommentRow = Database['public']['Tables']['app_e255c3cdb5_post_comments']['Row'];
type ReviewRow = Database['public']['Tables']['app_e255c3cdb5_reviews']['Row'];
type NotificationRow = Database['public']['Tables']['app_e255c3cdb5_notifications']['Row'];
type GigRow = Database['public']['Tables']['app_e255c3cdb5_gigs']['Row'];

/**
 * Common select string for user profiles to ensure consistent data fetching.
 * Joins the user_profiles table with dj_profiles and business_profiles.
 */
// FIX: Removed !inner to use left joins. This allows profiles for all roles (DJ, Business, Listener)
// to be fetched correctly, as listeners do not have entries in the other tables.
const PROFILE_QUERY_STRING = '*, dj_profiles:app_e255c3cdb5_dj_profiles(*), business_profiles:app_e255c3cdb5_business_profiles(*)';

// =================================================================
// SECTION: Data Mapping & Utilities
// =================================================================

/**
 * Maps a joined row from Supabase to the application's user types.
 * This is a base mapper; follower/following data is added by the calling functions.
 * @param data The raw data object from the Supabase query with joined profiles.
 * @returns A processed and typed user profile object (DJ, Business, or Listener).
 */
function mapJoinedDataToUserProfile(data: UserProfileRow & { dj_profiles: DjProfileRow | DjProfileRow[] | null, business_profiles: BusinessProfileRow | BusinessProfileRow[] | null }): UserProfile {
    const role = data.user_type as Role;

    const baseUser = {
        id: data.user_id,
        name: data.display_name,
        avatarUrl: data.avatar_url,
        role,
        settings: data.settings as unknown as UserSettings,
        // These are placeholders; they will be populated by the functions calling this mapper.
        following: [],
        followers: 0,
    };
    
    if (role === Role.DJ && data.dj_profiles) {
        const djProfile = Array.isArray(data.dj_profiles) ? data.dj_profiles[0] : data.dj_profiles;
        return {
            ...baseUser,
            role: Role.DJ,
            genres: djProfile?.genres || [],
            // FIX: Map the 'description' column from the DB to the app's 'bio' property.
            bio: djProfile?.description || '',
            location: djProfile?.location || '',
            rating: djProfile?.rating || 0,
            reviewsCount: djProfile?.reviews_count || 0,
            tier: (djProfile?.tier as Tier) || Tier.Bronze,
            // socials and tracks are now populated by the calling function (e.g., getUserById)
            socials: {},
            tracks: [],
            mixes: [], // Populated by getPlaylistsForDj
            experienceYears: djProfile?.experience_years ?? undefined,
            equipmentOwned: djProfile?.equipment_owned || [],
            hourlyRate: djProfile?.hourly_rate ?? undefined,
            travelRadius: djProfile?.travel_radius ?? undefined,
            availabilitySchedule: (djProfile?.availability_schedule as string) || undefined,
        };
    } else if (role === Role.Business && data.business_profiles) {
        const businessProfile = Array.isArray(data.business_profiles) ? data.business_profiles[0] : data.business_profiles;
        return {
            ...baseUser,
            role: Role.Business,
            name: businessProfile?.venue_name || data.display_name,
            location: businessProfile?.location || '',
            description: businessProfile?.description || '',
            rating: businessProfile?.rating || 0,
            reviewsCount: businessProfile?.reviews_count || 0,
            // socials is now populated by the calling function (e.g., getUserById)
            socials: {},
        };
    } else {
        return {
            ...baseUser,
            role: Role.Listener,
        };
    }
}

/** Maps a post row from Supabase to a FeedItem. */
const mapPostToFeedItem = (post: PostRow, repostsCount: number = 0): FeedItem => ({
    id: post.id,
    userId: post.user_id,
    title: '', // Title is not a direct column, usually derived contextually
    description: post.content,
    mediaUrl: post.media_url || undefined,
    mediaType: post.media_type || undefined,
    timestamp: post.created_at,
    likes: post.likes_count,
    comments: post.comments_count,
    reposts: repostsCount,
    relatedId: undefined, // Needs specific logic per type
    type: (post.type as FeedItem['type']) || 'user_post',
    repostOf: post.original_post_id || undefined,
});

/** Maps a gig row from Supabase to a Gig. */
const mapRowToGig = (gig: GigRow): Gig => ({
    id: gig.id,
    title: gig.title,
    business_user_id: gig.business_user_id,
    date: gig.date,
    time: gig.time,
    budget: gig.budget,
    description: gig.description,
    genres: gig.genres,
    status: gig.status,
    bookedDjId: gig.booked_dj_id || undefined,
    interestCount: gig.interest_count || undefined,
    flyerUrl: gig.flyer_url || undefined,
});


// =================================================================
// SECTION: User & Profile Management
// =================================================================

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_id', userId)
        // FIX: Use .maybeSingle() to prevent crashing when no user is found.
        // This allows the self-healing profile creation logic to proceed.
        .maybeSingle();
    
    if (error || !data) {
        if (error) console.error('Error fetching user profile:', error.message);
        return undefined;
    }

    // Fetch followers, following, social links, and tracks in parallel
    const [
        followersResult,
        followingResult,
        socialsResult,
        tracksResult
    ] = await Promise.all([
        supabase.from('app_e255c3cdb5_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('app_e255c3cdb5_follows').select('following_id').eq('follower_id', userId),
        supabase.from('app_e255c3cdb5_social_links').select('platform, url').eq('user_id', userId),
        // Only fetch tracks if the user is a DJ
        data.user_type === 'dj'
            ? supabase.from('app_e255c3cdb5_tracks').select('*').eq('artist_id', userId)
            : Promise.resolve({ data: [], error: null })
    ]);

    const user = mapJoinedDataToUserProfile(data as any);
    user.followers = followersResult.count ?? 0;
    user.following = (followingResult.data || []).map((f) => f.following_id);

    // Attach social links and tracks to the user profile
    if (socialsResult.data) {
        user.socials = socialsResult.data.reduce((acc, link) => {
            acc[link.platform] = link.url;
            return acc;
        }, {} as { [key: string]: string });
    }

    if (user.role === Role.DJ && tracksResult.data) {
        (user as DJ).tracks = tracksResult.data.map(t => ({
            id: t.id,
            artistId: t.artist_id,
            title: t.title,
            artworkUrl: t.artwork_url || '',
            duration: t.duration || '0:00',
            trackUrl: t.track_url || undefined,
        }));
    }

    return user;
};

export const getDJById = async (userId: string): Promise<DJ | undefined> => {
    const profile = await getUserById(userId);
    return profile?.role === Role.DJ ? (profile as DJ) : undefined;
};

export const getDJs = async (): Promise<DJ[]> => {
    const { data: profiles, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_type', 'dj');

    if (error || !profiles) {
        console.error("Error fetching DJs:", error?.message);
        return [];
    }
    
    return (profiles as any[]).map((p) => mapJoinedDataToUserProfile(p)).filter((p) => p.role === Role.DJ) as DJ[];
};

export const getBusinesses = async (): Promise<Business[]> => {
    const { data: profiles, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_type', 'business');

    if (error || !profiles) {
        console.error("Error fetching businesses:", error?.message);
        return [];
    }

    return (profiles as any[]).map((p) => mapJoinedDataToUserProfile(p)).filter((p) => p.role === Role.Business) as Business[];
};

export const getBusinessById = async (userId: string): Promise<Business | undefined> => {
    const profile = await getUserById(userId);
    return profile?.role === Role.Business ? profile as Business : undefined;
}

export const getTopDJs = async (): Promise<DJ[]> => {
    const { data: djProfiles, error } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('*')
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false })
        .limit(50);
        
    if (error || !djProfiles) {
        console.error("Error fetching top DJs:", error?.message);
        return [];
    }

    // Now, enrich with follower/following data
    const djs = await Promise.all(djProfiles.map(async (djProfile) => {
        const user = await getUserById(djProfile.user_id);
        return user as DJ;
    }));
    
    // Final client-side sort with follower data
    return djs.filter(Boolean).sort((a, b) => (b.rating * 10 + b.followers) - (a.rating * 10 + a.followers));
};

export const getTopVenues = async (): Promise<Business[]> => {
    const { data: businessProfiles, error } = await supabase
        .from('app_e255c3cdb5_business_profiles')
        .select('*')
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false })
        .limit(50);

    if (error || !businessProfiles) {
        console.error("Error fetching top Venues:", error?.message);
        return [];
    }
    const venues = await Promise.all(businessProfiles.map(async (businessProfile) => {
        const user = await getUserById(businessProfile.user_id);
        return user as Business;
    }));

    return venues.filter(Boolean);
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
    userAppUpdatesService.logAction('UPDATE_USER_PROFILE', { userId, data });
    const { name, avatarUrl, socials, ...rest } = data;
    
    const userProfileData: Database['public']['Tables']['app_e255c3cdb5_user_profiles']['Update'] = {};
    if (name !== undefined) userProfileData.display_name = name;
    if (avatarUrl !== undefined) userProfileData.avatar_url = avatarUrl;
    
    let success = true;

    if (Object.keys(userProfileData).length > 0) {
        const { error } = await supabase.from('app_e255c3cdb5_user_profiles').update(userProfileData).eq('user_id', userId);
        if (error) {
            console.error('Error updating user profile:', error.message);
            success = false;
        }
    }

    // Handle socials update using a "delete-then-insert" strategy for simplicity.
    if (socials) {
        // Delete existing social links for the user
        const { error: deleteError } = await supabase.from('app_e255c3cdb5_social_links').delete().eq('user_id', userId);
        if (deleteError) {
            console.error('Error deleting old social links:', deleteError.message);
            success = false;
        } else {
            // Insert new social links
            const newLinks = Object.entries(socials).map(([platform, url]) => ({
                user_id: userId,
                platform,
                url
            }));
            if (newLinks.length > 0) {
                const { error: insertError } = await supabase.from('app_e255c3cdb5_social_links').insert(newLinks);
                if (insertError) {
                    console.error('Error inserting new social links:', insertError.message);
                    success = false;
                }
            }
        }
    }

    if (data.role === Role.DJ) {
        const djData = rest as Partial<DJ>;
        const djProfileUpdate: Database['public']['Tables']['app_e255c3cdb5_dj_profiles']['Update'] = {};
        
        if (djData.bio !== undefined) djProfileUpdate.description = djData.bio;
        if (djData.genres !== undefined) djProfileUpdate.genres = djData.genres;
        if (djData.location !== undefined) djProfileUpdate.location = djData.location;
        if (djData.experienceYears !== undefined) djProfileUpdate.experience_years = djData.experienceYears;
        if (djData.hourlyRate !== undefined) djProfileUpdate.hourly_rate = djData.hourlyRate;
        if (djData.travelRadius !== undefined) djProfileUpdate.travel_radius = djData.travelRadius;
        if (djData.equipmentOwned !== undefined) djProfileUpdate.equipment_owned = djData.equipmentOwned;
        if (djData.availabilitySchedule !== undefined) djProfileUpdate.availability_schedule = djData.availabilitySchedule as Json;
        
        if (Object.keys(djProfileUpdate).length > 0) {
            const { error } = await supabase.from('app_e255c3cdb5_dj_profiles').update(djProfileUpdate).eq('user_id', userId);
            if (error) {
                console.error('Error updating DJ profile:', error.message);
                success = false;
            }
        }
    }

    if (data.role === Role.Business) {
        const businessData = rest as Partial<Business>;
        const businessProfileUpdate: Database['public']['Tables']['app_e255c3cdb5_business_profiles']['Update'] = {};
        if (businessData.name !== undefined) businessProfileUpdate.venue_name = businessData.name;
        if (businessData.description !== undefined) businessProfileUpdate.description = businessData.description;
        if (businessData.location !== undefined) businessProfileUpdate.location = businessData.location;

        if (Object.keys(businessProfileUpdate).length > 0) {
            const { error } = await supabase.from('app_e255c3cdb5_business_profiles').update(businessProfileUpdate).eq('user_id', userId);
            if (error) {
                console.error('Error updating business profile:', error.message);
                success = false;
            }
        }
    }

    if(success) persistenceService.markDirty();
    return success;
};


export const updateUserSettings = async(userId: string, settings: Partial<UserSettings>): Promise<boolean> => {
    userAppUpdatesService.logAction('UPDATE_USER_SETTINGS', { userId, settings });
    const { error } = await supabase.from('app_e255c3cdb5_user_profiles').update({ settings: settings as Json }).eq('user_id', userId);
    if (!error) persistenceService.markDirty();
    return !error;
}


// =================================================================
// SECTION: Follow Management
// =================================================================

export const followUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('FOLLOW_USER', { currentUserId, targetUserId });
    const { error } = await supabase.from('app_e255c3cdb5_follows').insert({ follower_id: currentUserId, following_id: targetUserId });
    if (error) {
        console.error("Error following user:", error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
}

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('UNFOLLOW_USER', { currentUserId, targetUserId });
    const { error } = await supabase.from('app_e255c3cdb5_follows').delete().match({ follower_id: currentUserId, following_id: targetUserId });
     if (error) {
        console.error("Error unfollowing user:", error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
}

export const getFollowersForUser = async (userId: string): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_follows').select('follower_id').eq('following_id', userId);
    if (error || !data) return [];
    
    const followerIds = data.map((f) => f.follower_id);
    if(followerIds.length === 0) return [];

    const { data: profiles, error: profileError } = await supabase.from('app_e255c3cdb5_user_profiles').select(PROFILE_QUERY_STRING).in('user_id', followerIds);
    return profileError ? [] : (profiles || []).map((p) => mapJoinedDataToUserProfile(p as any));
}

export const getFollowingForUser = async (userId: string): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_follows').select('following_id').eq('follower_id', userId);
    if (error || !data) return [];
    
    const followingIds = data.map((f) => f.following_id);
    if(followingIds.length === 0) return [];
    
    const { data: profiles, error: profileError } = await supabase.from('app_e255c3cdb5_user_profiles').select(PROFILE_QUERY_STRING).in('user_id', followingIds);
    return profileError ? [] : (profiles || []).map((p) => mapJoinedDataToUserProfile(p as any));
}

// =================================================================
// SECTION: Gig & Booking Management
// =================================================================
export const getGigById = async (id: string): Promise<Gig | undefined> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && !error.message.includes('0 rows')) console.error('Error fetching gig by id:', error.message);
        return undefined;
    }
    return mapRowToGig(data);
};

export const getGigs = async (): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*');
    if (error) console.error('Error fetching gigs:', error.message);
    return (data || []).map(mapRowToGig);
};

export const getGigsForVenue = async (businessUserId: string): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('business_user_id', businessUserId);
    if (error) console.error('Error fetching gigs for venue:', error.message);
    return (data || []).map(mapRowToGig);
};

export const addGig = async (gigData: Omit<Gig, 'id' | 'status'>): Promise<Gig | null> => {
    userAppUpdatesService.logAction('ADD_GIG', { gigData });
     const newGig: Database['public']['Tables']['app_e255c3cdb5_gigs']['Insert'] = { 
        title: gigData.title,
        business_user_id: gigData.business_user_id,
        date: gigData.date,
        time: gigData.time,
        budget: gigData.budget,
        description: gigData.description,
        genres: gigData.genres,
        flyer_url: gigData.flyerUrl,
        status: 'Open' 
    };
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').insert(newGig).select().single();

    if (error || !data) {
        console.error('Error adding gig:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    return mapRowToGig(data);
};

export const updateGig = async (gigId: string, updatedData: Partial<Gig>): Promise<Gig | null> => {
    userAppUpdatesService.logAction('UPDATE_GIG', { gigId, updatedData });
    const dbData: Database['public']['Tables']['app_e255c3cdb5_gigs']['Update'] = {};
    if (updatedData.title) dbData.title = updatedData.title;
    if (updatedData.date) dbData.date = updatedData.date;
    if (updatedData.time) dbData.time = updatedData.time;
    if (updatedData.budget) dbData.budget = updatedData.budget;
    if (updatedData.description) dbData.description = updatedData.description;
    if (updatedData.genres) dbData.genres = updatedData.genres;
    if (updatedData.status) dbData.status = updatedData.status;
    if (updatedData.bookedDjId) dbData.booked_dj_id = updatedData.bookedDjId;
    if (updatedData.flyerUrl) dbData.flyer_url = updatedData.flyerUrl;
    
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').update(dbData).eq('id', gigId).select().single();
    if (error || !data) {
        console.error('Error updating gig:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    return mapRowToGig(data);
};

export const expressInterestInGig = async (gigId: string, djUserId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('EXPRESS_INTEREST_IN_GIG', { gigId, djUserId });
    const { error } = await supabase.from('app_e255c3cdb5_gig_applications').insert({ gig_id: gigId, dj_user_id: djUserId, status: 'pending' });
    if (error) {
        console.error('Error expressing interest in gig:', error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

export const getInterestedDJsForGig = async (gigId: string): Promise<DJ[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gig_applications').select('dj_user_id').eq('gig_id', gigId);
    if (error || !data) return [];

    const djUserIds = data.map((app) => app.dj_user_id);
    if (djUserIds.length === 0) return [];
    
    const { data: profiles, error: profileError } = await supabase.from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .in('user_id', djUserIds)
        .eq('user_type', 'dj');

    if (profileError) return [];
    return (profiles || []).map((p) => mapJoinedDataToUserProfile(p as any)) as DJ[];
};

export const bookDJForGig = async (gigId: string, djUserId: string, agreedRate: number): Promise<boolean> => {
    userAppUpdatesService.logAction('BOOK_DJ_FOR_GIG', { gigId, djUserId, agreedRate });
    const { error: gigError } = await supabase.from('app_e255c3cdb5_gigs').update({ status: 'Booked', booked_dj_id: djUserId }).eq('id', gigId);
    if (gigError) {
        console.error('Error updating gig status:', gigError.message);
        return false;
    }

    const gig = await getGigById(gigId);
    if (!gig) return false;

    const { error: bookingError } = await supabase.from('app_e255c3cdb5_bookings').insert({ gig_id: gigId, dj_user_id: djUserId, business_user_id: gig.business_user_id, agreed_rate: agreedRate });
    if (bookingError) {
        console.error('Error creating booking:', bookingError.message);
        return false;
    }
    
    persistenceService.markDirty();
    return true;
};

export const getInterestedGigsForDj = async (djId: string): Promise<Gig[]> => {
  const { data, error } = await supabase.from('app_e255c3cdb5_gig_applications').select('gig_id').eq('dj_user_id', djId);
  if (error || !data) return [];
  const gigIds = data.map((d) => d.gig_id);
  const { data: gigs, error: gigError } = await supabase.from('app_e255c3cdb5_gigs').select('*').in('id', gigIds);
  return gigError ? [] : (gigs || []).map(mapRowToGig);
}

export const getBookedGigsForDj = async (djId: string): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('booked_dj_id', djId).eq('status', 'Booked');
    if(error) return [];
    return (data || []).map(mapRowToGig);
}

export const getCompletedGigsForDj = async (djId: string): Promise<Gig[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('booked_dj_id', djId).eq('status', 'Completed');
    if(error) return [];
    return (data || []).map(mapRowToGig);
}

// =================================================================
// SECTION: Feed, Posts, Comments, Likes
// =================================================================

export const getFeedItems = async (): Promise<FeedItem[]> => {
    const { data: posts, error } = await supabase.from('app_e255c3cdb5_posts').select('*').order('created_at', { ascending: false });
    if (error || !posts) {
        console.error('Error fetching posts:', error?.message);
        return [];
    }
    
    // Efficiently get repost counts
    const postIds = posts.map((p) => p.id).filter(Boolean);
    if (postIds.length === 0) {
        return posts.map((p) => mapPostToFeedItem(p, 0));
    }

    const { data: reposts, error: repostError } = await supabase.from('app_e255c3cdb5_posts').select('original_post_id').in('original_post_id', postIds);
    if (repostError) console.error('Error fetching repost counts:', repostError.message);
    
    const repostCounts = (reposts || []).reduce((acc: Record<string, number>, { original_post_id }) => {
        if (original_post_id) acc[original_post_id] = (acc[original_post_id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return posts.map((p) => mapPostToFeedItem(p, repostCounts[p.id]));
};

export const getFeedItemById = async (id: string): Promise<FeedItem | undefined> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_posts').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && !error.message.includes('0 rows')) console.error('Error fetching post by id:', error.message);
        return undefined;
    }
    return mapPostToFeedItem(data);
};

export const addFeedItem = async (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>): Promise<FeedItem | null> => {
    userAppUpdatesService.logAction('ADD_FEED_ITEM', { item });
    const newPost: Database['public']['Tables']['app_e255c3cdb5_posts']['Insert'] = {
        user_id: item.userId,
        content: item.description,
        media_url: item.mediaUrl,
        media_type: item.mediaType,
        original_post_id: item.repostOf,
        type: item.type
    };
    
    const { data, error } = await supabase.from('app_e255c3cdb5_posts').insert(newPost).select().single();

    if (error || !data) {
        console.error('Error adding post:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    return mapPostToFeedItem(data);
};

export const repost = async (originalPostId: string, userId: string): Promise<FeedItem | null> => {
    const originalPost = await getFeedItemById(originalPostId);
    if (!originalPost || originalPost.repostOf) {
        console.warn("Cannot repost a repost.");
        return null;
    }

    return addFeedItem({
        userId,
        type: 'user_post',
        title: '',
        description: '',
        repostOf: originalPostId,
    });
};

export const getCommentsForPost = async (postId: string): Promise<EnrichedComment[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_post_comments')
        .select('*, author:app_e255c3cdb5_user_profiles!user_id(user_id, display_name, avatar_url, user_type)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error || !data) return [];
    
    return data.map((comment) => {
// FIX: Changed unsafe type assertion to `as unknown as UserProfileRow` to handle cases where Supabase type inference for joins is incorrect, preventing a TypeScript error.
        const author = comment.author as unknown as UserProfileRow;
        if (!author) return null;
        return {
            id: comment.id,
            authorId: comment.user_id,
            postId: comment.post_id,
            text: comment.content,
            timestamp: comment.created_at,
            author: {
                id: author.user_id,
                name: author.display_name,
                avatarUrl: author.avatar_url,
                role: author.user_type as Role,
            },
        };
    }).filter((c): c is EnrichedComment => !!c);
};

export const addCommentToPost = async (postId: string, userId: string, content: string): Promise<EnrichedComment | null> => {
    userAppUpdatesService.logAction('ADD_COMMENT_TO_POST', { postId, userId, content });
    const { data, error } = await supabase.from('app_e255c3cdb5_post_comments').insert({ post_id: postId, user_id: userId, content }).select().single();
    if (error || !data) {
        if(error) console.error('Error adding comment:', error.message);
        return null;
    }
    const author = await getUserById(userId);
    if (!author) return null;
    
    persistenceService.markDirty();
    return { id: data.id, postId, authorId: userId, text: data.content, timestamp: data.created_at, author };
};

export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
    // This could be a single RPC call for atomicity, but this is simpler.
    const { data: like, error: selectError } = await supabase.from('app_e255c3cdb5_post_likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle();

    if (selectError) {
        console.error('Error checking for like:', selectError.message);
        return false;
    }

    let finalError = null;
    if (like) {
        userAppUpdatesService.logAction('UNLIKE_POST', { postId, userId });
        const { error } = await supabase.from('app_e255c3cdb5_post_likes').delete().eq('id', like.id);
        finalError = error;
    } else {
        userAppUpdatesService.logAction('LIKE_POST', { postId, userId });
        const { error } = await supabase.from('app_e255c3cdb5_post_likes').insert({ post_id: postId, user_id: userId });
        finalError = error;
    }

    if(finalError) {
        console.error('Error toggling like:', finalError.message);
        return false;
    }
    
    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Chat & Messages
// =================================================================
export const getEnrichedChatsForUser = async (userId: string): Promise<EnrichedChat[]> => {
    // Note: This implementation can be slow with many messages. A better schema would have a `chats` table.
    const { data: messages, error } = await supabase.from('app_e255c3cdb5_messages').select('*').or(`sender_id.eq.${userId},recipient_id.eq.${userId}`).order('created_at', { ascending: true });
    if (error || !messages) return [];

    const otherUserIds = [...new Set(messages.map((m) => m.sender_id === userId ? m.recipient_id : m.sender_id))];
    if (otherUserIds.length === 0) return [];
    
    const { data: profiles, error: profileError } = await supabase.from('app_e255c3cdb5_user_profiles').select('user_id, display_name, avatar_url, user_type').in('user_id', otherUserIds);
    if (profileError || !profiles) return [];

    const chatsMap = new Map<string, EnrichedChat>();
    profiles.forEach((p) => {
        chatsMap.set(p.user_id, {
            id: p.user_id, // Using other user's ID as chat ID
            participants: [userId, p.user_id],
            messages: [],
            otherParticipant: { id: p.user_id, name: p.display_name, avatarUrl: p.avatar_url, role: p.user_type as Role },
        });
    });

    messages.forEach((message) => {
        const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        const chat = chatsMap.get(otherUserId);
        if (chat) {
            chat.messages.push({ id: message.id, senderId: message.sender_id, text: message.content, timestamp: message.created_at });
        }
    });

    return Array.from(chatsMap.values());
};

export const sendMessage = async (senderId: string, recipientId: string, content: string): Promise<Message | null> => {
    userAppUpdatesService.logAction('SEND_MESSAGE', { senderId, recipientId, content });
    const { data, error } = await supabase.from('app_e255c3cdb5_messages').insert({ sender_id: senderId, recipient_id: recipientId, content }).select().single();
    if (error || !data) {
        if(error) console.error('Error sending message:', error.message);
        return null;
    }
    persistenceService.markDirty();
    return { id: data.id, senderId: data.sender_id, text: data.content, timestamp: data.created_at };
};

export const findChatByParticipants = async (userId1: string, userId2: string): Promise<Chat | null> => {
  // This is a "virtual" chat find. A real implementation would have a chats table.
  const { data, error } = await supabase.from('app_e255c3cdb5_messages').select('*').or(`(sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1})`).limit(1);
  if (error || !data || data.length === 0) return null;
  return { id: userId2, participants: [userId1, userId2], messages: [] };
};

export const createChat = async (userId1: string, userId2: string): Promise<Chat | null> => {
  userAppUpdatesService.logAction('CREATE_CHAT', { participants: [userId1, userId2] });
  persistenceService.markDirty();
  return { id: userId2, participants: [userId1, userId2], messages: [] };
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
    // This is a mock implementation based on the current schema. `chatId` is the other participant's ID.
    // This method is not truly fetching a chat "by its own ID".
    return { id: chatId, participants: ["a", "b"], messages: [] };
}

// =================================================================
// SECTION: Media (Tracks & Playlists)
// =================================================================
export const getTracksForDj = async (djUserId: string): Promise<Track[]> => {
    const { data, error } = await supabase
        .from('app_e255c3cdb5_tracks')
        .select('*')
        .eq('artist_id', djUserId);

    if (error || !data) {
        if(error) console.error('Error fetching tracks for DJ:', error.message);
        return [];
    }
    return data.map(t => ({
        id: t.id,
        artistId: t.artist_id,
        title: t.title,
        artworkUrl: t.artwork_url || '',
        duration: t.duration || '0:00',
        trackUrl: t.track_url || undefined,
    }));
};

export const getPlaylistsForDj = async (djUserId: string): Promise<Playlist[]> => {
    const { data: playlistsData, error: playlistsError } = await supabase
        .from('app_e255c3cdb5_playlists')
        .select('*')
        .eq('dj_user_id', djUserId);

    if (playlistsError) {
        console.error('Error fetching playlists for DJ:', playlistsError.message);
        return [];
    }
    if (!playlistsData) return [];

    const playlistIds = playlistsData.map(p => p.id);
    if (playlistIds.length === 0) {
        return playlistsData.map(p => ({
            id: p.id,
            name: p.name,
            creatorId: p.dj_user_id,
            trackIds: [],
            artworkUrl: p.artwork_url || '',
        }));
    }

    const { data: playlistTracksData, error: playlistTracksError } = await supabase
        .from('app_e255c3cdb5_playlist_tracks')
        .select('playlist_id, track_id')
        .in('playlist_id', playlistIds)
        .order('position', { ascending: true });

    if (playlistTracksError) {
        console.error('Error fetching playlist tracks:', playlistTracksError.message);
        // Return playlists with empty tracks array as a fallback
        return playlistsData.map(p => ({
            id: p.id,
            name: p.name,
            creatorId: p.dj_user_id,
            trackIds: [],
            artworkUrl: p.artwork_url || '',
        }));
    }

    const tracksByPlaylist = (playlistTracksData || []).reduce((acc, item) => {
        if (!acc[item.playlist_id]) {
            acc[item.playlist_id] = [];
        }
        acc[item.playlist_id].push(item.track_id);
        return acc;
    }, {} as Record<string, string[]>);

    return playlistsData.map((p) => ({
        id: p.id,
        name: p.name,
        creatorId: p.dj_user_id,
        trackIds: tracksByPlaylist[p.id] || [],
        artworkUrl: p.artwork_url || '',
    }));
};

export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
    const { data: playlistData, error: playlistError } = await supabase.from('app_e255c3cdb5_playlists').select('*').eq('id', id).single();
    if (playlistError || !playlistData) return null;

    const { data: playlistTracksData, error: playlistTracksError } = await supabase
        .from('app_e255c3cdb5_playlist_tracks')
        .select('track_id')
        .eq('playlist_id', id)
        .order('position', { ascending: true });

    if (playlistTracksError) {
        console.error(`Error fetching tracks for playlist ${id}:`, playlistTracksError.message);
        // Return playlist without tracks as a fallback
    }

    const trackIds = playlistTracksData ? playlistTracksData.map(t => t.track_id) : [];

    return {
        id: playlistData.id,
        name: playlistData.name,
        creatorId: playlistData.dj_user_id,
        trackIds: trackIds,
        artworkUrl: playlistData.artwork_url || ''
    };
};

export const getTrackById = async (id: string): Promise<Track | null> => {
    // WARNING: Inefficient. See getTracksByIds for details.
    const tracks = await getTracksByIds([id]);
    return tracks[0] || null;
};

export const getTracksByIds = async (ids: string[]): Promise<Track[]> => {
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase
        .from('app_e255c3cdb5_tracks')
        .select('*')
        .in('id', ids);

    if (error) {
        console.error('Error fetching tracks by IDs:', error.message);
        return [];
    }
    return data.map(t => ({
        id: t.id,
        artistId: t.artist_id,
        title: t.title,
        artworkUrl: t.artwork_url || '',
        duration: t.duration || '0:00',
        trackUrl: t.track_url || undefined,
    }));
};

export const addTrack = async (userId: string, title: string, artworkUrl: string, trackUrl: string): Promise<boolean> => {
    userAppUpdatesService.logAction('ADD_TRACK', { userId, title });

    const { error } = await supabase.from('app_e255c3cdb5_tracks').insert({
        artist_id: userId,
        title: title,
        artwork_url: artworkUrl,
        track_url: trackUrl,
        duration: '3:30' // Mock duration, consistent with old implementation
    });

    if (error) {
        console.error('Error adding track:', error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

export const createPlaylist = async (playlistData: Omit<Playlist, 'id'>): Promise<Playlist | null> => {
    userAppUpdatesService.logAction('CREATE_PLAYLIST', { playlistData });
    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').insert({ dj_user_id: playlistData.creatorId, name: playlistData.name, artwork_url: playlistData.artworkUrl }).select().single();
    if (error || !data) {
        console.error('Error creating playlist:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    return getPlaylistById(data.id);
};

export const updatePlaylist = async (playlistId: string, playlistData: Partial<Playlist>): Promise<Playlist | null> => {
    userAppUpdatesService.logAction('UPDATE_PLAYLIST', { playlistId, playlistData });
    const dbUpdate: Database['public']['Tables']['app_e255c3cdb5_playlists']['Update'] = {};
    if (playlistData.name) dbUpdate.name = playlistData.name;
    if (playlistData.artworkUrl) dbUpdate.artwork_url = playlistData.artworkUrl;

    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').update(dbUpdate).eq('id', playlistId).select().single();
    if (error || !data) {
        console.error('Error updating playlist:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    return getPlaylistById(data.id);
};

export const addTrackToPlaylist = async (playlistId: string, track: Track): Promise<boolean> => {
    userAppUpdatesService.logAction('ADD_TRACK_TO_PLAYLIST', { playlistId, trackId: track.id });

    // Get the current number of tracks to determine the new position
    const { count, error: countError } = await supabase
        .from('app_e255c3cdb5_playlist_tracks')
        .select('*', { count: 'exact', head: true })
        .eq('playlist_id', playlistId);

    if (countError) {
        console.error('Error getting track count for playlist:', countError.message);
        return false;
    }

    const position = count ?? 0;

    const { error } = await supabase.from('app_e255c3cdb5_playlist_tracks').insert({
        playlist_id: playlistId,
        track_id: track.id,
        position: position
    });

    if (error) {
        console.error('Error adding track to playlist:', error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Reviews
// =================================================================
export const getReviewsForUser = async (revieweeId: string): Promise<EnrichedReview[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_reviews')
        .select('*, author:app_e255c3cdb5_user_profiles!app_e255c3cdb5_reviews_reviewer_id_fkey(user_id, display_name, avatar_url, user_type)')
        .eq('reviewee_id', revieweeId);
        
    if (error || !data) return [];
    
// FIX: Added an explicit return type to the map function to guide TypeScript's inference and resolve a type predicate error in the subsequent filter.
    return data.map((review): EnrichedReview | null => {
// FIX: Changed unsafe type assertion to `as unknown as UserProfileRow` to handle cases where Supabase type inference for joins is incorrect, preventing a TypeScript error.
        const author = review.author as unknown as UserProfileRow;
        if (!author) return null;
        return {
            id: review.id,
            authorId: review.reviewer_id,
            targetId: review.reviewee_id,
            rating: review.rating,
            comment: review.comment || undefined,
            timestamp: review.created_at,
            gigId: review.gig_id || undefined,
            author: {
                id: author.user_id,
                name: author.display_name,
                avatarUrl: author.avatar_url,
                role: author.user_type as Role,
            },
        };
    }).filter((r): r is EnrichedReview => !!r);
};

export const submitReview = async (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review | null> => {
    userAppUpdatesService.logAction('SUBMIT_REVIEW', { reviewData });
    const dbReview: Database['public']['Tables']['app_e255c3cdb5_reviews']['Insert'] = { reviewer_id: reviewData.authorId, reviewee_id: reviewData.targetId, rating: reviewData.rating, comment: reviewData.comment, gig_id: reviewData.gigId };
    const { data, error } = await supabase.from('app_e255c3cdb5_reviews').insert(dbReview).select().single();
    if (error || !data) {
        console.error('Error submitting review:', error?.message);
        return null;
    }
    persistenceService.markDirty();
    const { reviewer_id, reviewee_id, created_at, gig_id, ...rest } = data;
    return {
        ...rest,
        authorId: reviewer_id,
        targetId: reviewee_id,
        timestamp: created_at,
        gigId: gig_id || undefined,
    };
};

// =================================================================
// SECTION: Live Streams
// =================================================================
export const createStreamSession = async (djId: string, title: string): Promise<StreamSession> => {
    userAppUpdatesService.logAction('CREATE_STREAM_SESSION', { djId, title });
    const { data, error } = await supabase.from('app_e255c3cdb5_stream_sessions').insert({ dj_user_id: djId, title, is_live: true }).select().single();
    if (error || !data) {
        console.error("Error creating stream session:", error?.message);
        throw new Error("Could not create stream session.");
    }
    persistenceService.markDirty();
    return { id: data.id, djId: data.dj_user_id, title: data.title, isLive: data.is_live, listenerCount: data.listener_count };
};

export const getStreamSessionById = async (sessionId: string): Promise<StreamSession | null> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_stream_sessions').select('*').eq('id', sessionId).single();
    if (error || !data) return null;
    return { id: data.id, djId: data.dj_user_id, title: data.title, isLive: data.is_live, listenerCount: data.listener_count };
}

export const endStreamSession = async (sessionId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('END_STREAM_SESSION', { sessionId });
    const { error } = await supabase.from('app_e255c3cdb5_stream_sessions').update({ is_live: false }).eq('id', sessionId);
    if (error) {
        console.error("Error ending stream session:", error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
}

// =================================================================
// SECTION: Notifications
// =================================================================

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase.from('app_e255c3cdb5_notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) console.error('Error fetching notifications:', error.message);
    return ((data || []) as NotificationRow[]).map(n => ({
        id: n.id,
        userId: n.user_id,
        type: n.type as NotificationType,
        text: n.text,
        timestamp: n.timestamp,
        read: n.is_read,
        relatedId: n.related_id || undefined,
    }));
};

export const markAllAsRead = async (userId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('MARK_ALL_NOTIFICATIONS_AS_READ', { userId });
    const { error } = await supabase.from('app_e255c3cdb5_notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    if (error) {
        console.error('Error marking notifications as read:', error.message);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Search
// =================================================================

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
    if (!query) return [];
    const { data, error } = await supabase.from('app_e255c3cdb5_user_profiles').select(PROFILE_QUERY_STRING).ilike('display_name', `%${query.toLowerCase()}%`).limit(10);
    if (error) console.error('Error searching users:', error.message);
    return (data || []).map((p) => mapJoinedDataToUserProfile(p as any));
}

// =================================================================
// SECTION: Auth & Profile Creation
// =================================================================
export const createDjProfile = async (userId: string): Promise<boolean> => {
    userAppUpdatesService.logAction('CREATE_DJ_PROFILE', { userId });
    // FIX: Changed 'bio' to 'description' to match the actual database schema.
    const { error } = await supabase.from('app_e255c3cdb5_dj_profiles').upsert({ user_id: userId, genres: ['Electronic'], description: 'Newly joined DJ! Please update your bio.', location: 'Cape Town', tier: Tier.Bronze }, { onConflict: 'user_id' });
    if (error) console.error("Error self-healing DJ profile:", error.message);
    else persistenceService.markDirty();
    return !error;
};

export const createBusinessProfile = async (userId: string, displayName: string): Promise<boolean> => {
    userAppUpdatesService.logAction('CREATE_BUSINESS_PROFILE', { userId, displayName });
    const { error } = await supabase.from('app_e255c3cdb5_business_profiles').upsert({ user_id: userId, venue_name: displayName, location: 'Cape Town', description: 'A great place for music! Please update your description.' }, { onConflict: 'user_id' });
    if (error) console.error("Error self-healing business profile:", error.message);
    else persistenceService.markDirty();
    return !error;
};

export const createUserProfile = async (user: any): Promise<UserProfile | null> => {
    userAppUpdatesService.logAction('CREATE_USER_PROFILE', { userId: user.id, metadata: user.user_metadata });
    const userType = user.user_metadata?.user_type as Role;
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name;
    const avatarUrl = user.user_metadata?.avatar_url;

    if (!userType || !displayName) {
        console.error("Cannot create/update profile, missing metadata", {userType, displayName});
        return null;
    }

    const { data, error: userProfileError } = await supabase.from('app_e255c3cdb5_user_profiles').upsert({ user_id: user.id, user_type: userType, display_name: displayName, avatar_url: avatarUrl || `https://source.unsplash.com/random/200x200/?abstract` }, { onConflict: 'user_id' }).select().single();
    
    if (userProfileError || !data) {
        if(userProfileError) console.error("Error upserting base user profile:", userProfileError.message);
        return null;
    }

    if (userType === Role.DJ) {
        await createDjProfile(user.id);
    } else if (userType === Role.Business) {
        await createBusinessProfile(user.id, displayName);
    }

    persistenceService.markDirty();
    return getUserById(data.user_id);
};

export const signUpWithEmail = async (email: string, password: string, name: string, role: Role) => {
    userAppUpdatesService.logAction('SIGN_UP_WITH_EMAIL', { email, name, role });
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name, user_type: role, avatar_url: `https://source.unsplash.com/random/200x200/?abstract,${role}` } } });
    if (!error) persistenceService.markDirty();
    return { user: data.user, error };
};

// =================================================================
// SECTION: Developer & Utility
// =================================================================
export const seedDatabase = async (): Promise<any> => {
    console.warn("seedDatabase is a developer tool and should not be used in production.");
    // This is a placeholder for a real seeding mechanism. A real implementation would likely
    // be a server-side function (RPC in Supabase) to avoid exposing table modification logic to the client.
    // For this app, we will simply mark the persistence service as "seeded" to disable warnings.
    persistenceService.markSeeded();
    // Return empty data as the component expects something to download.
    return { djs: [], businesses: [], gigs: [], tracks: [], playlists: [] };
};