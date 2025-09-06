
import { supabase } from './supabaseClient';
import * as demoApi from './mockApiDemo';
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
import { v4 as uuidvv4 } from 'uuid';
import { Database, Json } from './supabase';
import { persistenceService } from './persistenceService';
import { userAppUpdatesService } from './userAppUpdatesService';

// =================================================================
// SECTION: Demo Mode Router
// =================================================================

const isDemoModeEnabled = () => localStorage.getItem('isDemoMode') === 'true';

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
const PROFILE_QUERY_STRING = '*, dj_profiles:app_e255c3cdb5_dj_profiles(*), business_profiles:app_e255c3cdb5_business_profiles(*)';

// =================================================================
// SECTION: Notification Service
// =================================================================

const createNotification = async (
    userId: string,
    type: NotificationType,
    text: string,
    relatedId?: string
): Promise<void> => {
    if (isDemoModeEnabled()) {
        await demoApi.createNotification(userId, type, text, relatedId);
        return;
    }
    
    const { error } = await supabase.from('app_e255c3cdb5_notifications').insert({
        user_id: userId,
        type: type,
        text: text,
        related_id: relatedId,
        timestamp: new Date().toISOString(),
    });
    if (error) {
        console.error('Error creating notification:', error);
    }
};


// =================================================================
// SECTION: Storage Service
// =================================================================

export const uploadFile = async (folder: string, file: File): Promise<string> => {
    if (isDemoModeEnabled()) return demoApi.uploadFile(folder, file);
    const bucket = 'DDJ';
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidvv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    try {
        const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return publicUrl;
        
    } catch (uploadError: any) {
        console.error('Error uploading file with Supabase client:', uploadError);
        if (uploadError.message && (uploadError.message.includes('permission denied') || uploadError.message.includes('security policy'))) {
            throw new Error('Upload failed due to security policy. Please check storage permissions.');
        }
        throw uploadError;
    }
};


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
    
    if (role === Role.DJ) {
        const djProfile = Array.isArray(data.dj_profiles) ? data.dj_profiles[0] : data.dj_profiles;
        return {
            ...baseUser,
            role: Role.DJ,
            genres: djProfile?.genres || [],
            bio: djProfile?.description || '',
            location: djProfile?.location || '',
            rating: djProfile?.rating || 0,
            reviewsCount: djProfile?.reviews_count || 0,
            tier: (djProfile?.tier as Tier) || Tier.Bronze,
            socials: (djProfile?.socials as any) || {},
            tracks: (djProfile?.portfolio_tracks as unknown as Track[]) || [],
            mixes: [], // Populated by getPlaylistsForDj
            experienceYears: djProfile?.experience_years ?? undefined,
            equipmentOwned: djProfile?.equipment_owned || [],
            hourlyRate: djProfile?.hourly_rate ?? undefined,
            travelRadius: djProfile?.travel_radius ?? undefined,
            availabilitySchedule: (djProfile?.availability_schedule as string) || undefined,
        };
    } else if (role === Role.Business) {
        const businessProfile = Array.isArray(data.business_profiles) ? data.business_profiles[0] : data.business_profiles;
        return {
            ...baseUser,
            role: Role.Business,
            name: businessProfile?.venue_name || data.display_name,
            location: businessProfile?.location || '',
            description: businessProfile?.description || '',
            rating: businessProfile?.rating || 0,
            reviewsCount: businessProfile?.reviews_count || 0,
            socials: (businessProfile?.socials as any) || {},
        };
    } else {
        return {
            ...baseUser,
            role: Role.Listener,
            rating: 0,
            reviewsCount: 0,
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

export const getDemoUserByRole = async (role: Role): Promise<UserProfile | null> => {
    if (isDemoModeEnabled()) return demoApi.getDemoUserByRole(role);
    return null; // This function is only for demo mode
}

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    if (isDemoModeEnabled()) return demoApi.getUserById(userId);

    const { data, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_id', userId)
        .maybeSingle();
    
    if (error || !data) {
        if (error) console.error('Error fetching user profile:', error);
        return undefined;
    }

    const [followersResult, followingResult] = await Promise.all([
        supabase.from('app_e255c3cdb5_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('app_e255c3cdb5_follows').select('following_id').eq('follower_id', userId),
    ]);

    const user = mapJoinedDataToUserProfile(data as any);
    user.followers = followersResult.count ?? 0;
    user.following = (followingResult.data || []).map((f) => f.following_id);

    if (user.role === Role.DJ || user.role === Role.Business || user.role === Role.Listener) {
        const reviews = await getReviewsForUser(userId);
        const reviewsCount = reviews.length;
        const rating = reviewsCount > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount : 0;
        
        user.reviewsCount = reviewsCount;
        user.rating = rating;
    }

    return user;
};

export const getDJById = async (userId: string): Promise<DJ | undefined> => {
    if (isDemoModeEnabled()) return demoApi.getDJById(userId);
    const profile = await getUserById(userId);
    return profile?.role === Role.DJ ? (profile as DJ) : undefined;
};

export const getDJs = async (): Promise<DJ[]> => {
    if (isDemoModeEnabled()) return demoApi.getDJs();
    const { data: profiles, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_type', 'dj');

    if (error || !profiles) {
        console.error("Error fetching DJs:", error);
        return [];
    }
    
    return (profiles as any[]).map((p) => mapJoinedDataToUserProfile(p)).filter((p) => p.role === Role.DJ) as DJ[];
};

export const getBusinesses = async (): Promise<Business[]> => {
    if (isDemoModeEnabled()) return demoApi.getBusinesses();
    const { data: profiles, error } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .select(PROFILE_QUERY_STRING)
        .eq('user_type', 'business');

    if (error || !profiles) {
        console.error("Error fetching businesses:", error);
        return [];
    }

    return (profiles as any[]).map((p) => mapJoinedDataToUserProfile(p)).filter((p) => p.role === Role.Business) as Business[];
};

export const getBusinessById = async (userId: string): Promise<Business | undefined> => {
    if (isDemoModeEnabled()) return demoApi.getBusinessById(userId);
    const profile = await getUserById(userId);
    return profile?.role === Role.Business ? profile as Business : undefined;
}

export const getTopDJs = async (): Promise<DJ[]> => {
    if (isDemoModeEnabled()) return demoApi.getTopDJs();
    const { data: djProfiles, error } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('*')
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false })
        .limit(50);
        
    if (error || !djProfiles) {
        console.error("Error fetching top DJs:", error);
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
    if (isDemoModeEnabled()) return demoApi.getTopVenues();
    const { data: businessProfiles, error } = await supabase
        .from('app_e255c3cdb5_business_profiles')
        .select('*')
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false })
        .limit(50);

    if (error || !businessProfiles) {
        console.error("Error fetching top Venues:", error);
        return [];
    }
    const venues = await Promise.all(businessProfiles.map(async (businessProfile) => {
        const user = await getUserById(businessProfile.user_id);
        return user as Business;
    }));

    return venues.filter(Boolean);
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.updateUserProfile(userId, data);
    userAppUpdatesService.logAction('UPDATE_USER_PROFILE', { userId, data });

    const userProfileUpdate: Database['public']['Tables']['app_e255c3cdb5_user_profiles']['Update'] = {};
    if (data.name !== undefined) userProfileUpdate.display_name = data.name;
    if (data.avatarUrl !== undefined) userProfileUpdate.avatar_url = data.avatarUrl;

    // Use a PostgrestBuilder array to handle multiple potential updates
    const updatePromises: any[] = [];

    if (Object.keys(userProfileUpdate).length > 0) {
        updatePromises.push(supabase.from('app_e255c3cdb5_user_profiles').update(userProfileUpdate).eq('user_id', userId));
    }

    if (data.role === Role.DJ) {
        const djData = data as Partial<DJ>;
        const djProfileUpdate: Database['public']['Tables']['app_e255c3cdb5_dj_profiles']['Update'] = {};
        
        if (djData.bio !== undefined) djProfileUpdate.description = djData.bio;
        if (djData.genres !== undefined) djProfileUpdate.genres = djData.genres;
        if (djData.location !== undefined) djProfileUpdate.location = djData.location;
        if (djData.socials !== undefined) djProfileUpdate.socials = djData.socials as Json;
        if (djData.experienceYears !== undefined) djProfileUpdate.experience_years = djData.experienceYears;
        if (djData.hourlyRate !== undefined) djProfileUpdate.hourly_rate = djData.hourlyRate;
        if (djData.travelRadius !== undefined) djProfileUpdate.travel_radius = djData.travelRadius;
        if (djData.equipmentOwned !== undefined) djProfileUpdate.equipment_owned = djData.equipmentOwned;
        if (djData.availabilitySchedule !== undefined) djProfileUpdate.availability_schedule = djData.availabilitySchedule;

        if (Object.keys(djProfileUpdate).length > 0) {
            updatePromises.push(supabase.from('app_e255c3cdb5_dj_profiles').update(djProfileUpdate).eq('user_id', userId));
        }
    }

    if (data.role === Role.Business) {
        const businessData = data as Partial<Business>;
        const businessProfileUpdate: Database['public']['Tables']['app_e255c3cdb5_business_profiles']['Update'] = {};
        if (businessData.name !== undefined) businessProfileUpdate.venue_name = businessData.name;
        if (businessData.description !== undefined) businessProfileUpdate.description = businessData.description;
        if (businessData.location !== undefined) businessProfileUpdate.location = businessData.location;
        if (businessData.socials !== undefined) businessProfileUpdate.socials = businessData.socials as Json;

        if (Object.keys(businessProfileUpdate).length > 0) {
            updatePromises.push(supabase.from('app_e255c3cdb5_business_profiles').update(businessProfileUpdate).eq('user_id', userId));
        }
    }

    const results = await Promise.all(updatePromises);
    const hasError = results.some(result => result.error);

    if (hasError) {
        results.forEach((result, index) => {
            if (result.error) console.error(`Error in update operation #${index}:`, result.error);
        });
        return false;
    }

    persistenceService.markDirty();
    return true;
};

export const updateUserSettings = async(userId: string, settings: Partial<UserSettings>): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.updateUserSettings(userId, settings);
    userAppUpdatesService.logAction('UPDATE_USER_SETTINGS', { userId, settings });
    const { error } = await supabase.from('app_e255c3cdb5_user_profiles').update({ settings: settings as Json }).eq('user_id', userId);
    if (!error) persistenceService.markDirty();
    return !error;
}


// =================================================================
// SECTION: Follow Management
// =================================================================

export const followUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.followUser(currentUserId, targetUserId);
    userAppUpdatesService.logAction('FOLLOW_USER', { currentUserId, targetUserId });
    const { error } = await supabase.from('app_e255c3cdb5_follows').insert({ follower_id: currentUserId, following_id: targetUserId });
    if (error) {
        console.error("Error following user:", error);
        return false;
    }
    persistenceService.markDirty();

    // Create notification
    const follower = await getUserById(currentUserId);
    if (follower) {
        await createNotification(
            targetUserId,
            NotificationType.NewFollower,
            `${follower.name} started following you.`,
            currentUserId
        );
    }
    return true;
}

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.unfollowUser(currentUserId, targetUserId);
    userAppUpdatesService.logAction('UNFOLLOW_USER', { currentUserId, targetUserId });
    const { error } = await supabase.from('app_e255c3cdb5_follows').delete().match({ follower_id: currentUserId, following_id: targetUserId });
     if (error) {
        console.error("Error unfollowing user:", error);
        return false;
    }
    persistenceService.markDirty();
    return true;
}

export const getFollowersForUser = async (userId: string): Promise<UserProfile[]> => {
    if (isDemoModeEnabled()) return demoApi.getFollowersForUser(userId);
    const { data, error } = await supabase.from('app_e255c3cdb5_follows').select('follower_id').eq('following_id', userId);
    if (error || !data) return [];
    
    const followerIds = data.map((f) => f.follower_id);
    if(followerIds.length === 0) return [];

    const { data: profiles, error: profileError } = await supabase.from('app_e255c3cdb5_user_profiles').select(PROFILE_QUERY_STRING).in('user_id', followerIds);
    return profileError ? [] : (profiles || []).map((p) => mapJoinedDataToUserProfile(p as any));
}

export const getFollowingForUser = async (userId: string): Promise<UserProfile[]> => {
    if (isDemoModeEnabled()) return demoApi.getFollowingForUser(userId);
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
    if (isDemoModeEnabled()) return demoApi.getGigById(id);
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && !error.message.includes('0 rows')) console.error('Error fetching gig by id:', error);
        return undefined;
    }
    return mapRowToGig(data);
};

export const getGigs = async (): Promise<Gig[]> => {
    if (isDemoModeEnabled()) return demoApi.getGigs();
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*');
    if (error) console.error('Error fetching gigs:', error);
    return (data || []).map(mapRowToGig);
};

export const getGigsForVenue = async (businessUserId: string): Promise<Gig[]> => {
    if (isDemoModeEnabled()) return demoApi.getGigsForVenue(businessUserId);
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('business_user_id', businessUserId);
    if (error) console.error('Error fetching gigs for venue:', error);
    return (data || []).map(mapRowToGig);
};

export const addGig = async (gigData: Omit<Gig, 'id' | 'status'>): Promise<Gig | null> => {
    if (isDemoModeEnabled()) return demoApi.addGig(gigData);
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
        status: 'Open',
        interest_count: 0,
    };
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').insert(newGig).select().single();

    if (error || !data) {
        console.error('Error adding gig:', error);
        return null;
    }
    persistenceService.markDirty();
    return mapRowToGig(data);
};

export const updateGig = async (gigId: string, updatedData: Partial<Gig>): Promise<Gig | null> => {
    if (isDemoModeEnabled()) return demoApi.updateGig(gigId, updatedData);
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
        console.error('Error updating gig:', error);
        return null;
    }
    persistenceService.markDirty();
    return mapRowToGig(data);
};

export const expressInterestInGig = async (gigId: string, djUserId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.expressInterestInGig(gigId, djUserId);
    userAppUpdatesService.logAction('EXPRESS_INTEREST_IN_GIG', { gigId, djUserId });
    const { error } = await supabase.from('app_e255c3cdb5_gig_applications').insert({ gig_id: gigId, dj_user_id: djUserId, status: 'pending' });
    if (error) {
        console.error('Error expressing interest in gig:', error);
        return false;
    }
    persistenceService.markDirty();

    // Create notification
    const dj = await getDJById(djUserId);
    const gig = await getGigById(gigId);
    if (dj && gig) {
        await createNotification(
            gig.business_user_id,
            NotificationType.BookingRequest,
            `${dj.name} is interested in your gig: "${gig.title}".`,
            gigId
        );
    }
    return true;
};

export const getInterestedDJsForGig = async (gigId: string): Promise<DJ[]> => {
    if (isDemoModeEnabled()) return demoApi.getInterestedDJsForGig(gigId);
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
    if (isDemoModeEnabled()) return demoApi.bookDJForGig(gigId, djUserId, agreedRate);
    userAppUpdatesService.logAction('BOOK_DJ_FOR_GIG', { gigId, djUserId, agreedRate });
    const { error: gigError } = await supabase.from('app_e255c3cdb5_gigs').update({ status: 'Booked', booked_dj_id: djUserId }).eq('id', gigId);
    if (gigError) {
        console.error('Error updating gig status:', gigError);
        return false;
    }

    const gig = await getGigById(gigId);
    if (!gig) return false;

    const { error: bookingError } = await supabase.from('app_e255c3cdb5_bookings').insert({ gig_id: gigId, dj_user_id: djUserId, business_user_id: gig.business_user_id, agreed_rate: agreedRate });
    if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return false;
    }
    
    persistenceService.markDirty();

    // Create notifications
    const business = await getBusinessById(gig.business_user_id);
    if (business) {
        // For the booked DJ
        await createNotification(
            djUserId,
            NotificationType.BookingConfirmed,
            `You've been booked for "${gig.title}" by ${business.name}!`,
            gigId
        );
        // For unsuccessful applicants
        const interestedDJs = await getInterestedDJsForGig(gigId);
        for (const dj of interestedDJs) {
            if (dj.id !== djUserId) {
                 await createNotification(
                    dj.id,
                    NotificationType.GigFilled,
                    `The gig "${gig.title}" has been filled. Better luck next time!`,
                    gigId
                );
            }
        }
    }
    return true;
};

export const getInterestedGigsForDj = async (djId: string): Promise<Gig[]> => {
    if (isDemoModeEnabled()) return demoApi.getInterestedGigsForDj(djId);
    const { data, error } = await supabase.from('app_e255c3cdb5_gig_applications').select('gig_id').eq('dj_user_id', djId);
    if (error || !data) return [];
    const gigIds = data.map((d) => d.gig_id);
    const { data: gigs, error: gigError } = await supabase.from('app_e255c3cdb5_gigs').select('*').in('id', gigIds);
    return gigError ? [] : (gigs || []).map(mapRowToGig);
}

export const getBookedGigsForDj = async (djId: string): Promise<Gig[]> => {
    if (isDemoModeEnabled()) return demoApi.getBookedGigsForDj(djId);
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('booked_dj_id', djId).eq('status', 'Booked');
    if(error) return [];
    return (data || []).map(mapRowToGig);
}

export const getCompletedGigsForDj = async (djId: string): Promise<Gig[]> => {
    if (isDemoModeEnabled()) return demoApi.getCompletedGigsForDj(djId);
    const { data, error } = await supabase.from('app_e255c3cdb5_gigs').select('*').eq('booked_dj_id', djId).eq('status', 'Completed');
    if(error) return [];
    return (data || []).map(mapRowToGig);
}

// =================================================================
// SECTION: Feed, Posts, Comments, Likes
// =================================================================

/**
 * Maps the application's abstract FeedItem type to a database-compliant type.
 * @param item The application-level FeedItem data.
 * @returns A valid string for the `type` column in the posts table.
 */
const mapAppTypeToDb = (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>): 'text' | 'image' | 'video' | 'playlist' | 'event' | 'review' => {
    switch (item.type) {
        case 'user_post':
            if (item.mediaType === 'image') return 'image';
            if (item.mediaType === 'video') return 'video';
            return 'text';
        case 'new_track':
        case 'new_mix':
            return 'playlist';
        case 'gig_announcement':
        case 'live_now':
            return 'event';
        case 'new_review':
            return 'review';
        case 'new_connection':
        default:
            return 'text';
    }
};

export const getFeedItems = async (): Promise<FeedItem[]> => {
    if (isDemoModeEnabled()) return demoApi.getFeedItems();
    const { data: posts, error } = await supabase.from('app_e255c3cdb5_posts').select('*').order('created_at', { ascending: false });
    if (error || !posts) {
        console.error('Error fetching posts:', error);
        return [];
    }
    
    if (posts.length === 0) {
        return [];
    }
    
    const postIds = posts.map((p) => p.id);

    // Concurrently fetch all likes, comments, and reposts for the loaded posts.
    // This is more efficient than a separate query for each post (N+1 problem).
    const [likesResult, commentsResult, repostsResult] = await Promise.all([
        supabase.from('app_e255c3cdb5_post_likes').select('post_id').in('post_id', postIds),
        supabase.from('app_e255c3cdb5_post_comments').select('post_id').in('post_id', postIds),
        // This query finds all posts that are reposts of the posts we fetched.
        supabase.from('app_e255c3cdb5_posts').select('original_post_id').in('original_post_id', postIds).not('original_post_id', 'is', null)
    ]);
    
    // Tally the counts from the results.
    const likesCounts = (likesResult.data || []).reduce((acc: Record<string, number>, { post_id }) => {
        if(post_id) acc[post_id] = (acc[post_id] || 0) + 1;
        return acc;
    }, {});

    const commentsCounts = (commentsResult.data || []).reduce((acc: Record<string, number>, { post_id }) => {
        if(post_id) acc[post_id] = (acc[post_id] || 0) + 1;
        return acc;
    }, {});
    
    const repostCounts = (repostsResult.data || []).reduce((acc: Record<string, number>, { original_post_id }) => {
        if (original_post_id) {
            acc[original_post_id] = (acc[original_post_id] || 0) + 1;
        }
        return acc;
    }, {});
    
    // Map over the original posts, enriching them with the live counts we just calculated.
    return posts.map((p) => {
        // We create a temporary PostRow with the fresh counts. This ensures the UI displays
        // up-to-date numbers, bypassing potentially stale data in the `likes_count` and
        // `comments_count` columns.
        const postWithFreshCounts: PostRow = {
            ...p,
            likes_count: likesCounts[p.id] || 0,
            comments_count: commentsCounts[p.id] || 0,
        };
        return mapPostToFeedItem(postWithFreshCounts, repostCounts[p.id] || 0);
    });
};


export const getFeedItemById = async (id: string): Promise<FeedItem | undefined> => {
    if (isDemoModeEnabled()) return demoApi.getFeedItemById(id);
    const { data, error } = await supabase.from('app_e255c3cdb5_posts').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && !error.message.includes('0 rows')) console.error('Error fetching post by id:', error);
        return undefined;
    }
    return mapPostToFeedItem(data);
};

export const addFeedItem = async (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>): Promise<FeedItem | null> => {
    if (isDemoModeEnabled()) return demoApi.addFeedItem(item);
    userAppUpdatesService.logAction('ADD_FEED_ITEM', { item });

    // The content for a review post is the review title itself, the description is the comment.
    const content = item.type === 'new_review' ? item.title : item.description;

    const newPost: Database['public']['Tables']['app_e255c3cdb5_posts']['Insert'] = {
        user_id: item.userId,
        content: content,
        media_url: item.mediaUrl,
        media_type: item.mediaType,
        original_post_id: item.repostOf,
        type: mapAppTypeToDb(item),
    };

    // If it's a review, we add the review-specific data to the payload.
    // This assumes the `posts` table has a JSONB column named `metadata` or similar.
    // For this implementation, we'll send it as part of the main `content` or rely on the `type` column.
    // A more robust solution would be a `metadata` JSONB column.
    // For now, we will add rating and comment to the content.
    if (item.type === 'new_review') {
        newPost.content = JSON.stringify({
            title: item.title,
            comment: item.description,
            rating: item.rating,
            relatedId: item.relatedId,
        });
    }
    
    const { data, error } = await supabase.from('app_e255c3cdb5_posts').insert(newPost).select().single();

    if (error || !data) {
        console.error('Error adding post:', error);
        return null;
    }
    persistenceService.markDirty();
    return mapPostToFeedItem(data);
};

export const repost = async (originalPostId: string, userId: string): Promise<FeedItem | null> => {
    if (isDemoModeEnabled()) return demoApi.repost(originalPostId, userId);
    const originalPost = await getFeedItemById(originalPostId);
    if (!originalPost || originalPost.repostOf) {
        console.warn("Cannot repost a repost.");
        return null;
    }

    const newPost = await addFeedItem({
        userId,
        type: 'user_post',
        title: '',
        description: '',
        repostOf: originalPostId,
    });

    // Create notification
    if (newPost) {
        const reposter = await getUserById(userId);
        if (reposter && originalPost.userId !== userId) {
            await createNotification(
                originalPost.userId,
                NotificationType.Repost,
                `${reposter.name} reposted your post.`,
                originalPostId
            );
        }
    }
    return newPost;
};

export const getCommentsForPost = async (postId: string): Promise<EnrichedComment[]> => {
    if (isDemoModeEnabled()) return demoApi.getCommentsForPost(postId);
    const { data, error } = await supabase.from('app_e255c3cdb5_post_comments')
        .select('*, author:app_e255c3cdb5_user_profiles!user_id(user_id, display_name, avatar_url, user_type)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error || !data) return [];
    
    return (data as any[]).map((comment) => {
        const author: any = comment.author;
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
    if (isDemoModeEnabled()) return demoApi.addCommentToPost(postId, userId, content);
    userAppUpdatesService.logAction('ADD_COMMENT_TO_POST', { postId, userId, content });
    const { data, error } = await supabase.from('app_e255c3cdb5_post_comments').insert({ post_id: postId, user_id: userId, content }).select().single();
    if (error || !data) {
        if(error) console.error('Error adding comment:', error);
        return null;
    }
    const author = await getUserById(userId);
    if (!author) return null;
    
    persistenceService.markDirty();

    // Create notification
    const post = await getFeedItemById(postId);
    if (post && post.userId !== userId) { // Don't notify on self-comment
        await createNotification(
            post.userId,
            NotificationType.NewComment,
            `${author.name} commented on your post.`,
            postId
        );
    }

    return { id: data.id, postId, authorId: userId, text: data.content, timestamp: data.created_at, author };
};

export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.toggleLikePost(postId, userId);
    // This could be a single RPC call for atomicity, but this is simpler.
    const { data: like, error: selectError } = await supabase.from('app_e255c3cdb5_post_likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle();

    if (selectError) {
        console.error('Error checking for like:', selectError);
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
        console.error('Error toggling like:', finalError);
        return false;
    }
    
    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Chat & Messages
// =================================================================
export const getEnrichedChatsForUser = async (userId: string): Promise<EnrichedChat[]> => {
    if (isDemoModeEnabled()) return demoApi.getEnrichedChatsForUser(userId);
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
            chat.messages.push({ id: message.id, senderId: message.sender_id, recipientId: message.recipient_id, text: message.content, timestamp: message.created_at });
        }
    });

    return Array.from(chatsMap.values());
};

export const sendMessage = async (senderId: string, recipientId: string, content: string): Promise<Message | null> => {
    if (isDemoModeEnabled()) return demoApi.sendMessage(senderId, recipientId, content);
    userAppUpdatesService.logAction('SEND_MESSAGE', { senderId, recipientId, content });
    const { data, error } = await supabase.from('app_e255c3cdb5_messages').insert({ sender_id: senderId, recipient_id: recipientId, content }).select().single();
    if (error || !data) {
        if(error) console.error('Error sending message:', error);
        return null;
    }
    persistenceService.markDirty();

    // Create notification
    const sender = await getUserById(senderId);
    if (sender) {
        await createNotification(
            recipientId,
            NotificationType.Message,
            `${sender.name} sent you a message.`,
            senderId // The "chatId" in this app is the other user's ID
        );
    }

    return { id: data.id, senderId: data.sender_id, recipientId: data.recipient_id, text: data.content, timestamp: data.created_at };
};

export const findChatByParticipants = async (userId1: string, userId2: string): Promise<Chat | null> => {
  if (isDemoModeEnabled()) return demoApi.findChatByParticipants(userId1, userId2);
  // This is a "virtual" chat find. A real implementation would have a chats table.
  const { data, error } = await supabase.from('app_e255c3cdb5_messages').select('*').or(`(sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1})`).limit(1);
  if (error || !data || data.length === 0) return null;
  return { id: userId2, participants: [userId1, userId2], messages: [] };
};

export const createChat = async (userId1: string, userId2: string): Promise<Chat | null> => {
  if (isDemoModeEnabled()) return demoApi.createChat(userId1, userId2);
  userAppUpdatesService.logAction('CREATE_CHAT', { participants: [userId1, userId2] });
  persistenceService.markDirty();
  return { id: userId2, participants: [userId1, userId2], messages: [] };
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
    if (isDemoModeEnabled()) return demoApi.getChatById(chatId);
    // This is a mock implementation based on the current schema. `chatId` is the other participant's ID.
    // This method is not truly fetching a chat "by its own ID".
    return { id: chatId, participants: ["a", "b"], messages: [] };
}

// =================================================================
// SECTION: Media (Tracks & Playlists)
// =================================================================
export const getTracksForDj = async (djUserId: string): Promise<Track[]> => {
    if (isDemoModeEnabled()) return demoApi.getTracksForDj(djUserId);
    const { data, error } = await supabase.from('app_e255c3cdb5_dj_profiles').select('portfolio_tracks').eq('user_id', djUserId).maybeSingle();
    if (error || !data) {
        if(error) console.error('Error fetching tracks for DJ:', error);
        return [];
    }
    return (data.portfolio_tracks as unknown as Track[] || []).filter(Boolean);
};

export const getPlaylistsForDj = async (djUserId: string): Promise<Playlist[]> => {
    if (isDemoModeEnabled()) return demoApi.getPlaylistsForDj(djUserId);
    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').select('*').eq('dj_user_id', djUserId);
    if (error) {
        console.error('Error fetching playlists for DJ:', error);
        return [];
    }
    return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        creatorId: p.dj_user_id, 
        trackIds: ((p.tracks as any[])?.map(t => t.id) || []).filter(Boolean),
        artworkUrl: p.artwork_url || ''
    }));
};

export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
    if (isDemoModeEnabled()) return demoApi.getPlaylistById(id);
    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').select('*').eq('id', id).single();
    if (error || !data) return null;
    return {
        id: data.id,
        name: data.name,
        creatorId: data.dj_user_id, 
        trackIds: ((data.tracks as any[])?.map(t => t.id) || []).filter(Boolean),
        artworkUrl: data.artwork_url || ''
    };
};

export const getTrackById = async (id: string): Promise<Track | null> => {
    if (isDemoModeEnabled()) return demoApi.getTrackById(id);
    // WARNING: Inefficient. See getTracksByIds for details.
    const tracks = await getTracksByIds([id]);
    return tracks[0] || null;
};

export const getTracksByIds = async (ids: string[]): Promise<Track[]> => {
    if (isDemoModeEnabled()) return demoApi.getTracksByIds(ids);
    // WARNING: This is a highly inefficient implementation due to the database schema
    // storing tracks in a JSONB column on the `dj_profiles` table. It must scan
    // all DJ profiles to find tracks. A dedicated 'tracks' table with a foreign key
    // to `user_id` would be the correct, performant solution.
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase.from('app_e255c3cdb5_dj_profiles').select('portfolio_tracks');
    if (error) {
        console.error('Error fetching all tracks for ID lookup:', error);
        return [];
    }
    const allTracks = (data || []).flatMap((p) => (p.portfolio_tracks as unknown as Track[] || [])).filter(t => t && t.id);
    const trackMap = new Map(allTracks.map(t => [t.id, t]));
    return ids.map(id => trackMap.get(id)).filter((t): t is Track => !!t);
};

export const addTrack = async (userId: string, title: string, artworkUrl: string, trackUrl: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.addTrack(userId, title, artworkUrl, trackUrl);
    userAppUpdatesService.logAction('ADD_TRACK', { userId, title });
    const newTrack: Track = { id: uuidvv4(), artistId: userId, title, artworkUrl, trackUrl, duration: '3:30' }; // Mock duration
    const { error } = await supabase.rpc('add_track_to_portfolio', { dj_user_id_param: userId, new_track: newTrack as any });
    if (error) {
        console.error('Error adding track to portfolio:', error);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

export const createPlaylist = async (playlistData: Omit<Playlist, 'id'>): Promise<Playlist | null> => {
    if (isDemoModeEnabled()) return demoApi.createPlaylist(playlistData);
    userAppUpdatesService.logAction('CREATE_PLAYLIST', { playlistData });
    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').insert({ dj_user_id: playlistData.creatorId, name: playlistData.name, artwork_url: playlistData.artworkUrl, tracks: [] }).select().single();
    if (error || !data) {
        console.error('Error creating playlist:', error);
        return null;
    }
    persistenceService.markDirty();
    return getPlaylistById(data.id);
};

export const updatePlaylist = async (playlistId: string, playlistData: Partial<Playlist>): Promise<Playlist | null> => {
    if (isDemoModeEnabled()) return demoApi.updatePlaylist(playlistId, playlistData);
    userAppUpdatesService.logAction('UPDATE_PLAYLIST', { playlistId, playlistData });
    const dbUpdate: Database['public']['Tables']['app_e255c3cdb5_playlists']['Update'] = {};
    if (playlistData.name) dbUpdate.name = playlistData.name;
    if (playlistData.artworkUrl) dbUpdate.artwork_url = playlistData.artworkUrl;

    const { data, error } = await supabase.from('app_e255c3cdb5_playlists').update(dbUpdate).eq('id', playlistId).select().single();
    if (error || !data) {
        console.error('Error updating playlist:', error);
        return null;
    }
    persistenceService.markDirty();
    return getPlaylistById(data.id);
};

export const addTrackToPlaylist = async (playlistId: string, track: Track): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.addTrackToPlaylist(playlistId, track);
    userAppUpdatesService.logAction('ADD_TRACK_TO_PLAYLIST', { playlistId, trackId: track.id });
    const { error } = await supabase.rpc('add_track_to_playlist', { playlist_id_param: playlistId, new_track: track as any });
    if (error) {
        console.error('Error adding track to playlist:', error);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

export const deletePlaylist = async (playlistId: string, userId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.deletePlaylist(playlistId, userId);
    userAppUpdatesService.logAction('DELETE_PLAYLIST', { playlistId, userId });

    const { error } = await supabase
        .from('app_e255c3cdb5_playlists')
        .delete()
        .match({ id: playlistId, dj_user_id: userId });

    if (error) {
        console.error('Error deleting playlist:', error);
        return false;
    }

    persistenceService.markDirty();
    return true;
};

export const deleteTrack = async (userId: string, trackId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.deleteTrack(userId, trackId);
    userAppUpdatesService.logAction('DELETE_TRACK', { userId, trackId });

    // 1. Fetch current tracks from the DJ's portfolio
    const { data: profile, error: fetchError } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .select('portfolio_tracks')
        .eq('user_id', userId)
        .single();

    if (fetchError || !profile) {
        console.error('Error fetching DJ profile for track deletion:', fetchError);
        return false;
    }

    // 2. Filter out the track from the portfolio
    const currentTracks = (profile.portfolio_tracks as unknown as Track[] || []).filter(Boolean);
    const updatedTracks = currentTracks.filter(track => track.id !== trackId);

    // 3. Update the DJ profile with the new track list
    const { error: updateError } = await supabase
        .from('app_e255c3cdb5_dj_profiles')
        .update({ portfolio_tracks: updatedTracks as any })
        .eq('user_id', userId);

    if (updateError) {
        console.error('Error updating tracks after deletion:', updateError);
        return false;
    }

    // 4. Fetch all user's playlists to clean them up
    const { data: playlists, error: playlistError } = await supabase
        .from('app_e255c3cdb5_playlists')
        .select('id, tracks')
        .eq('dj_user_id', userId);

    if (playlistError) {
        console.warn('Could not fetch playlists to clean up after track deletion:', playlistError);
        // Continue, as the main deletion was successful.
    }

    if (playlists) {
        const updatePromises = playlists.map(playlist => {
            const playlistTracks = (playlist.tracks as unknown as Track[] || []).filter(Boolean);
            if (playlistTracks.some(t => t.id === trackId)) {
                const updatedPlaylistTracks = playlistTracks.filter(t => t.id !== trackId);
                return supabase
                    .from('app_e255c3cdb5_playlists')
                    .update({ tracks: updatedPlaylistTracks as any })
                    .eq('id', playlist.id);
            }
            return null;
        }).filter(Boolean);

        await Promise.all(updatePromises);
    }

    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Reviews
// =================================================================
export const getReviewsForUser = async (revieweeId: string): Promise<EnrichedReview[]> => {
    if (isDemoModeEnabled()) return demoApi.getReviewsForUser(revieweeId);

    // Step 1: Fetch the raw reviews
    const { data: reviewsData, error: reviewsError } = await supabase.from('app_e255c3cdb5_reviews')
        .select('*')
        .eq('reviewee_id', revieweeId);
        
    if (reviewsError || !reviewsData || reviewsData.length === 0) {
        if (reviewsError) console.error("Error fetching reviews:", reviewsError);
        return [];
    }
    
    // Step 2: Get unique author IDs from the reviews
    const authorIds = [...new Set(reviewsData.map(r => r.reviewer_id))];
    if (authorIds.length === 0) return [];

    // Step 3: Fetch the user profiles for all authors in a single query
    const { data: authorsData, error: authorsError } = await supabase.from('app_e255c3cdb5_user_profiles')
        .select('user_id, display_name, avatar_url, user_type')
        .in('user_id', authorIds);
        
    if (authorsError) {
        console.error("Error fetching review authors:", authorsError);
        return [];
    }
    
    // Step 4: Create a map for quick author lookup
    const authorsMap = new Map((authorsData || []).map(a => [a.user_id, a]));
    
    // Step 5: Join the data in the client
    return (reviewsData.map(review => {
        const author: any = authorsMap.get(review.reviewer_id);
        if (!author) return null; // Should not happen, but defensive
        
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
    }).filter(Boolean) as EnrichedReview[]);
};

export const submitReview = async (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review | null> => {
    if (isDemoModeEnabled()) return demoApi.submitReview(reviewData);
    userAppUpdatesService.logAction('SUBMIT_REVIEW', { reviewData });
    const dbReview: Database['public']['Tables']['app_e255c3cdb5_reviews']['Insert'] = { reviewer_id: reviewData.authorId, reviewee_id: reviewData.targetId, rating: reviewData.rating, comment: reviewData.comment, gig_id: reviewData.gigId };
    const { data, error } = await supabase.from('app_e255c3cdb5_reviews').insert(dbReview).select().single();
    if (error || !data) {
        console.error('Error submitting review:', error);
        return null;
    }
    
    // Re-fetch all reviews for the target user to ensure accurate recalculation.
    // This is more robust than the previous read-modify-write pattern which could lead to race conditions.
    const allReviews = await getReviewsForUser(reviewData.targetId);
    const newReviewsCount = allReviews.length;
    const newRating = newReviewsCount > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / newReviewsCount
        : 0;

    // We still need the user's role to know which table to update.
    const targetUser = await getUserById(reviewData.targetId);
    if (targetUser) {
        if (targetUser.role === Role.DJ) {
            const { error: updateError } = await supabase.from('app_e255c3cdb5_dj_profiles').update({ reviews_count: newReviewsCount, rating: newRating }).eq('user_id', reviewData.targetId);
            if (updateError) console.error("Failed to update DJ profile after review:", updateError);
        } else if (targetUser.role === Role.Business) {
            const { error: updateError } = await supabase.from('app_e255c3cdb5_business_profiles').update({ reviews_count: newReviewsCount, rating: newRating }).eq('user_id', reviewData.targetId);
            if (updateError) console.error("Failed to update Business profile after review:", updateError);
        }
    }
    
    // After successful review submission, create a feed item and notification.
    try {
        const [author, target] = await Promise.all([
            getUserById(reviewData.authorId),
            getUserById(reviewData.targetId)
        ]);

        if (author && target) {
            await addFeedItem({
                type: 'new_review',
                // The user ID for the feed item is the person who was reviewed.
                userId: target.id,
                title: `${author.name} left a new review for ${target.name}`,
                description: reviewData.comment || `Rated ${reviewData.rating} out of 5 stars.`,
                rating: reviewData.rating,
                // Link the feed item back to the review itself.
                relatedId: data.id, 
            });
            await createNotification(
                reviewData.targetId,
                NotificationType.NewReview,
                `${author.name} left a ${reviewData.rating}-star review for you.`,
                target.id // Link to their own profile
            );
        } else {
             console.warn("Could not create review feed item: author or target user not found.");
        }
    } catch (feedError) {
        console.error("Failed to create feed item for new review:", feedError);
        // Do not block review submission if feed item creation fails.
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
    if (isDemoModeEnabled()) return demoApi.createStreamSession(djId, title);
    userAppUpdatesService.logAction('CREATE_STREAM_SESSION', { djId, title });
    const { data, error } = await supabase.from('app_e255c3cdb5_stream_sessions').insert({ dj_user_id: djId, title, is_live: true }).select().single();
    if (error || !data) {
        console.error("Error creating stream session:", error);
        throw new Error("Could not create stream session.");
    }
    persistenceService.markDirty();
    return { id: data.id, djId: data.dj_user_id, title: data.title, isLive: data.is_live, listenerCount: data.listener_count };
};

export const getStreamSessionById = async (sessionId: string): Promise<StreamSession | null> => {
    if (isDemoModeEnabled()) return demoApi.getStreamSessionById(sessionId);
    const { data, error } = await supabase.from('app_e255c3cdb5_stream_sessions').select('*').eq('id', sessionId).single();
    if (error || !data) return null;
    return { id: data.id, djId: data.dj_user_id, title: data.title, isLive: data.is_live, listenerCount: data.listener_count };
}

export const endStreamSession = async (sessionId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return demoApi.endStreamSession(sessionId);
    userAppUpdatesService.logAction('END_STREAM_SESSION', { sessionId });
    const { error } = await supabase.from('app_e255c3cdb5_stream_sessions').update({ is_live: false }).eq('id', sessionId);
    if (error) {
        console.error("Error ending stream session:", error);
        return false;
    }
    persistenceService.markDirty();
    return true;
}

// =================================================================
// SECTION: Notifications
// =================================================================

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    if (isDemoModeEnabled()) return demoApi.getNotifications(userId);
    const { data, error } = await supabase.from('app_e255c3cdb5_notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) console.error('Error fetching notifications:', error);
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
    if (isDemoModeEnabled()) return demoApi.markAllAsRead(userId);
    userAppUpdatesService.logAction('MARK_ALL_NOTIFICATIONS_AS_READ', { userId });
    const { error } = await supabase.from('app_e255c3cdb5_notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    if (error) {
        console.error('Error marking notifications as read:', error);
        return false;
    }
    persistenceService.markDirty();
    return true;
};

// =================================================================
// SECTION: Search
// =================================================================

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
    if (isDemoModeEnabled()) return demoApi.searchUsers(query);
    if (!query) return [];
    const { data, error } = await supabase.from('app_e255c3cdb5_user_profiles').select(PROFILE_QUERY_STRING).ilike('display_name', `%${query.toLowerCase()}%`).limit(10);
    if (error) console.error('Error searching users:', error);
    return (data || []).map((p) => mapJoinedDataToUserProfile(p as any));
}

// =================================================================
// SECTION: Auth & Profile Creation
// =================================================================
export const createDjProfile = async (userId: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return true; // In demo, profiles are pre-made
    userAppUpdatesService.logAction('CREATE_DJ_PROFILE', { userId });
    const { error } = await supabase.from('app_e255c3cdb5_dj_profiles').upsert({ user_id: userId, genres: ['Electronic'], description: 'Newly joined DJ! Please update your bio.', location: 'Cape Town', tier: Tier.Bronze }, { onConflict: 'user_id' });
    if (error) console.error("Error self-healing DJ profile:", error);
    else persistenceService.markDirty();
    return !error;
};

export const createBusinessProfile = async (userId: string, displayName: string): Promise<boolean> => {
    if (isDemoModeEnabled()) return true; // In demo, profiles are pre-made
    userAppUpdatesService.logAction('CREATE_BUSINESS_PROFILE', { userId, displayName });
    const { error } = await supabase.from('app_e255c3cdb5_business_profiles').upsert({ user_id: userId, venue_name: displayName, location: 'Cape Town', description: 'A great place for music! Please update your description.' }, { onConflict: 'user_id' });
    if (error) console.error("Error self-healing business profile:", error);
    else persistenceService.markDirty();
    return !error;
};

export const createUserProfile = async (user: any): Promise<UserProfile | null> => {
    if (isDemoModeEnabled()) return null; // In demo, profiles are pre-made
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
        if(userProfileError) console.error("Error upserting base user profile:", userProfileError);
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
    if (isDemoModeEnabled()) return demoApi.signUpWithEmail(email, password, name, role);
    userAppUpdatesService.logAction('SIGN_UP_WITH_EMAIL', { email, name, role });
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name, user_type: role, avatar_url: `https://source.unsplash.com/random/200x200/?abstract,${role}` } } });
    if (!error) persistenceService.markDirty();
    return { user: data.user, error };
};

// =================================================================
// SECTION: Developer & Utility
// =================================================================
export const seedDatabase = async (): Promise<any> => {
    if (isDemoModeEnabled()) return demoApi.seedDatabase();
    console.warn("seedDatabase is a developer tool and should not be used in production.");
    // This is a placeholder for a real seeding mechanism. A real implementation would likely
    // be a server-side function (RPC in Supabase) to avoid exposing table modification logic to the client.
    // For this app, we will simply mark the persistence service as "seeded" to disable warnings.
    persistenceService.markSeeded();
    // Return empty data as the component expects something to download.
    return { djs: [], businesses: [], gigs: [], tracks: [], playlists: [] };
};
