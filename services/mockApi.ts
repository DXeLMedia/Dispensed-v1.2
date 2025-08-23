import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
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
    Post,
    PostComment
} from '../types';

// All mock data and related logic removed.

// --- API FUNCTIONS ---
const simulate = <T,>(data: T): Promise<T> => new Promise(res => {
    setTimeout(() => {
        if (typeof data === 'undefined') {
            res(data);
            return;
        }
        // Deep copy to prevent mutation of the mock DB.
        res(JSON.parse(JSON.stringify(data)));
    }, 300);
});

// Helper for Supabase queries to gracefully fall back to mock data.
const fromSupabase = async <T,>(query: PromiseLike<{ data: T | null; error: any }>): Promise<T | null> => {
    try {
        const { data, error } = await query;
        if (error) {
            // Be silent for the expected "table does not exist" error.
            if (error.message && !error.message.includes('does not exist')) {
                 console.warn("Supabase query failed, falling back to mock data. Error:", error.message);
            }
            return null;
        }
        return data;
    } catch(e: any) {
        console.warn("Supabase network request failed, falling back to mock data. Error:", e.message || e);
        return null;
    }
};

export const getDJs = async (): Promise<DJ[]> => {
    const data = await fromSupabase(supabase.from('djs').select('*'));
    if (data === null) {
        return simulate(djs);
    }
    return (data || []) as DJ[];
};

export const getFeedItemById = async (id: string): Promise<FeedItem | null> => {
    const { data, error } = await supabase
        .from('feed')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // PostgREST error for "Not a single row"
            return null;
        }
        console.error('Error fetching feed item by id:', error);
        throw error;
    }
    return data as FeedItem | null;
};

export const getDJById = async (id: string): Promise<DJ | undefined> => {
    const dbData = await fromSupabase(supabase.from('djs').select('*').eq('id', id).single());
    
    if (dbData) {
        // Database is set up, fetch related data and return
        const [tracks, mixes] = await Promise.all([
            getTracksForDj(id),
            getPlaylistsForDj(id)
        ]);
        return { ...dbData, tracks, mixes } as DJ;
    }

    // Fallback if DB query fails
    const mockDj = djs.find(d => d.id === id);
    return simulate(mockDj);
};


export const getBusinesses = async (): Promise<Business[]> => {
    const data = await fromSupabase(supabase.from('businesses').select('*'));
    if (data === null) {
        return simulate(businesses);
    }
    return (data || []) as Business[];
};

export const getBusinessById = async (id: string): Promise<Business | undefined> => {
    const dbData = await fromSupabase(supabase.from('businesses').select('*').eq('id', id).single());
    
    if (dbData) {
        // Database is set up and contains the user
        return dbData as Business;
    }

    // Fallback if DB query fails
    const mockBusiness = businesses.find(b => b.id === id);
    return simulate(mockBusiness);
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    // This is simplified; a real app might need a unified 'users' table or view.
    let user = await getDJById(id);
    if (user) return user;
    
    let business = await getBusinessById(id);
    if (business) return business;

    // Fallback for listeners who are not in djs or businesses tables
    const listener = listeners.find(l => l.id === id);
    if(listener) return listener;

    return undefined;
};


export const getGigById = (id: string) => {
    const gig = gigs.find(g => g.id === id);
    if (!gig) return simulate(undefined);

    const bookedDj = gig.bookedDjId ? djs.find(d => d.id === gig.bookedDjId) : undefined;
    const enrichedGig = {
        ...gig,
        interestCount: interests.filter(i => i.gigId === gig.id).length,
        bookedDjName: bookedDj?.name,
    };
    return simulate(enrichedGig);
}
export const getGigs = () => simulate(gigs);
export const getGigsForVenue = (venueId: string) => {
    const venueGigs = gigs.filter(g => g.venueId === venueId);
    const enrichedGigs = venueGigs.map(gig => {
        const bookedDj = gig.bookedDjId ? djs.find(d => d.id === gig.bookedDjId) : undefined;
        return {
            ...gig,
            interestCount: interests.filter(i => i.gigId === gig.id).length,
            bookedDjName: bookedDj?.name,
        }
    });
    return simulate(enrichedGigs);
};
export const getVenueByGig = (gigId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    return simulate(businesses.find(b => b.id === gig?.venueId));
};
export const getDJByTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return simulate(djs.find(d => d.id === track?.artistId));
}

export const getFeedItems = async (): Promise<FeedItem[]> => {
    const { data, error } = await supabase
        .from('feed')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feed items:', error);
        throw error;
    }
    return data as FeedItem[];
};

export const getTrackById = async (id: string): Promise<Track | null> => {
    const dbData = await fromSupabase(supabase.from('tracks').select('*').eq('id', id).single());
    if(dbData) return dbData as Track;

    return simulate(tracks.find(t => t.id === id) || null);
}


export const addFeedItem = (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'reposts'>) => {
    const newFeedItem: FeedItem = {
        ...item,
        id: `f${feedItems.length + 1}`,
        timestamp: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        reposts: 0,
    };
    feedItems.unshift(newFeedItem);
    persistenceService.markDirty();
    return simulate(newFeedItem);
}


export const getNotifications = (userId: string) => simulate(notifications.filter(n => n.userId === userId));

export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
    const playlistData = await fromSupabase(supabase.from('playlists').select('*').eq('id', id).single());

    if (!playlistData) {
        const mockPlaylist = playlists.find(p => p.id === id);
        return simulate(mockPlaylist || null);
    }
    
    // Get track IDs from the join table
    const { data: trackLinks, error } = await supabase
        .from('playlist_tracks')
        .select('track_id')
        .eq('playlist_id', id);
        
    if (error) {
        // If join table doesn't exist, return playlist with no tracks from DB
        return { ...playlistData, trackIds: [] } as Playlist;
    }
        
    const trackIds = trackLinks ? trackLinks.map(link => link.track_id) : [];
    
    return { ...playlistData, trackIds } as Playlist;
};

export const getTracksByIds = async (ids: string[]): Promise<Track[]> => {
    if (ids.length === 0) return [];
    const data = await fromSupabase(supabase.from('tracks').select('*').in('id', ids));
    if (data === null) {
        return simulate(tracks.filter(t => ids.includes(t.id)));
    }
    return (data || []) as Track[];
};
export const getStreamSessionById = (id: string) => simulate(streamSessions.find(s => s.id === id));

export const markAllAsRead = (userId: string) => {
    notifications.forEach(n => {
        if (n.userId === userId) {
            n.read = true;
        }
    });
    persistenceService.markDirty();
    return simulate(true);
}

export const getEnrichedChatsForUser = (userId: string): Promise<EnrichedChat[]> => {
    const userChats = chats.filter(c => c.participants.includes(userId));
    const enriched = userChats.map(chat => {
        const otherId = chat.participants.find(p => p !== userId)!;
        const otherParticipant = allUsers.find(u => u.id === otherId)!;
        return { ...chat, otherParticipant };
    }).filter(chat => chat.otherParticipant); // Filter out chats where other participant might not exist
    return simulate(enriched.sort((a,b) => {
        const timeA = a.messages[a.messages.length - 1]?.timestamp ?? 0;
        const timeB = b.messages[b.messages.length - 1]?.timestamp ?? 0;
        if (!timeA) return 1;
        if (!timeB) return -1;
        // Simple sort for demo, not robust for various time formats
        return timeA > timeB ? -1 : 1;
    }));
};

export const getChatById = (chatId: string) => simulate(chats.find(c => c.id === chatId));

export const findChatByParticipants = (userId1: string, userId2: string) => {
    const chat = chats.find(c => c.participants.includes(userId1) && c.participants.includes(userId2));
    return simulate(chat);
};

export const createChat = (userId1: string, userId2: string) => {
    const newChat: Chat = {
        id: `chat-${chats.length + 1}`,
        participants: [userId1, userId2],
        messages: []
    };
    chats.push(newChat);
    persistenceService.markDirty();
    return simulate(newChat);
}

export const sendMessage = (chatId: string, senderId: string, text: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        const newMessage: Message = {
            id: `m${nextMessageId++}`,
            senderId,
            text,
            timestamp: 'Just now'
        };
        chat.messages.push(newMessage);
        
        const recipientId = chat.participants.find(p => p !== senderId);
        if (recipientId) {
             const sender = allUsers.find(u => u.id === senderId);
             notifications.unshift({
                id: `n${notifications.length + 1}`,
                userId: recipientId,
                type: NotificationType.Message,
                text: `New message from ${sender?.name}`,
                timestamp: 'Just now',
                read: false,
                relatedId: chatId,
             });
        }
        persistenceService.markDirty();
        return simulate(newMessage);
    }
    return simulate(null);
};


export const authenticate = async (email: string, password: string): Promise<User | undefined> => {
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Any password works for the demo, but it must be provided.
  if (!user || !password) return simulate(undefined);

  // Return the detailed profile based on role
  if (user.role === Role.DJ) {
      return getDJById(user.id);
  }
  if (user.role === Role.Business) {
      return getBusinessById(user.id);
  }
  if (user.role === Role.Listener) {
      return simulate(listeners.find(l => l.id === user.id));
  }
  return simulate(user);
}

export const addGig = (newGigData: Omit<Gig, 'id' | 'status'>) => {
    const gig: Gig = {
        id: `g${gigs.length + 1}`,
        status: 'Open',
        title: newGigData.title,
        venueId: newGigData.venueId,
        date: newGigData.date,
        time: newGigData.time,
        budget: newGigData.budget,
        description: newGigData.description,
        genres: newGigData.genres,
        flyerUrl: newGigData.flyerUrl,
    };
    gigs.unshift(gig);
    persistenceService.markDirty();

    // Also create a feed item
    const venue = businesses.find(b => b.id === newGigData.venueId);
    if (venue) {
        addFeedItem({
            type: 'gig_announcement',
            userId: newGigData.venueId,
            title: newGigData.title,
            description: `We're hosting ${newGigData.title} on ${new Date(newGigData.date).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' })}! Find out more and get involved.`,
            mediaUrl: newGigData.flyerUrl || venue.avatarUrl,
            mediaType: 'image',
            relatedId: gig.id,
        })
    }
    return simulate(gig);
}

export const updateGig = (gigId: string, venueId: string, updatedData: Partial<Gig>) => {
    const gigIndex = gigs.findIndex(g => g.id === gigId && g.venueId === venueId);
    if (gigIndex > -1) {
        gigs[gigIndex] = { ...gigs[gigIndex], ...updatedData };
        persistenceService.markDirty();
        return simulate(gigs[gigIndex]);
    }
    return simulate(null);
};

export const expressInterestInGig = (gigId: string, djId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    const dj = djs.find(d => d.id === djId);
    const venue = businesses.find(b => b.id === gig?.venueId);

    if (gig && dj && venue) {
        // Record the interest
        if (!interests.some(i => i.gigId === gigId && i.djId === djId)) {
            interests.unshift({ gigId, djId, timestamp: new Date().toISOString() });
        }

        // Add notification for the venue
        notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: venue.id,
            type: NotificationType.BookingRequest,
            text: `${dj.name} expressed interest in your gig: "${gig.title}"`,
            timestamp: 'Just now',
            read: false,
            relatedId: gig.id,
        });
        persistenceService.markDirty();
        return simulate(true);
    }
    return simulate(false);
}

export const getInterestedGigsForDj = (djId: string) => {
    const interestedGigIds = interests.filter(i => i.djId === djId).map(i => i.gigId);
    const interestedGigs = gigs.filter(g => interestedGigIds.includes(g.id));
    return simulate(interestedGigs);
};

export const getBookedGigsForDj = (djId: string) => {
    const bookedGigs = gigs.filter(g => g.bookedDjId === djId && g.status === 'Booked');
    return simulate(bookedGigs);
};

export const getCompletedGigsForDj = (djId: string) => {
    const completedGigs = gigs.filter(g => g.bookedDjId === djId && g.status === 'Completed');
    return simulate(completedGigs);
}

export const getInterestedDJsForGig = (gigId: string): Promise<DJ[]> => {
    const interestedDjIds = interests.filter(i => i.gigId === gigId).map(i => i.djId);
    const interestedDjs = djs.filter(d => interestedDjIds.includes(d.id));
    return simulate(interestedDjs);
};

export const bookDJForGig = (gigId: string, djId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    const dj = djs.find(d => d.id === djId);
    const venue = businesses.find(b => b.id === gig?.venueId);

    if (gig && dj && venue) {
        if (gig.status === 'Booked') {
            console.error("Gig is already booked");
            return simulate(false);
        }

        gig.status = 'Booked';
        gig.bookedDjId = dj.id;
        persistenceService.markDirty();

        // Notify the booked DJ
        notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: dj.id,
            type: NotificationType.BookingConfirmed,
            text: `You have been booked for "${gig.title}" at ${venue.name}!`,
            timestamp: 'Just now',
            read: false,
            relatedId: gig.id,
        });

        // Notify other applicants
        const allInterestedDjIds = interests.filter(i => i.gigId === gigId).map(i => i.djId);
        allInterestedDjIds.forEach(interestedDjId => {
            if (interestedDjId !== dj.id) {
                notifications.unshift({
                    id: `n${notifications.length + 1}`,
                    userId: interestedDjId,
                    type: NotificationType.GigFilled,
                    text: `The gig "${gig.title}" has been filled. Better luck next time!`,
                    timestamp: 'Just now',
                    read: false,
                    relatedId: gig.id,
                });
            }
        });

        // Remove all interest entries for this gig now that it's booked
        interests = interests.filter(i => i.gigId !== gigId);

        return simulate(true);
    }
    return simulate(false);
};


// Leaderboard Functions
export const getTopDJs = async (): Promise<DJ[]> => {
    const data = await fromSupabase(
        supabase
            .from('djs')
            .select('*')
            .order('rating', { ascending: false })
            .limit(50)
    );
     if (data === null) {
        const sortedDjs = [...djs].sort((a, b) => b.rating - a.rating).slice(0, 50);
        return simulate(sortedDjs);
    }
    return (data || []) as DJ[];
};

export const getTopVenues = async (): Promise<Business[]> => {
    const data = await fromSupabase(
        supabase
            .from('businesses')
            .select('*')
            .order('rating', { ascending: false })
            .limit(50)
    );
    if (data === null) {
        const sortedBusinesses = [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 50);
        return simulate(sortedBusinesses);
    }
    return (data || []) as Business[];
};

// Social Functions
const findMutableProfile = (userId: string): DJ | Business | Listener | undefined => {
    const dj = djs.find(u => u.id === userId);
    if (dj) return dj;
    
    const business = businesses.find(u => u.id === userId);
    if (business) return business;

    return listeners.find(u => u.id === userId);
}

export const followUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = findMutableProfile(currentUserId);
    const targetUser = allUsers.find(u => u.id === targetUserId);
    
    if(!targetUser) return simulate(false);

    if (currentUser && !currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        
        const targetProfile = findMutableProfile(targetUserId);
        if (targetProfile) {
            targetProfile.followers++;
        }
        
        notifications.unshift({
             id: `n${notifications.length + 1}`,
             userId: targetUserId,
             type: NotificationType.NewFollower,
             text: `${currentUser.name} started following you.`,
             timestamp: 'Just now',
             read: false,
             relatedId: currentUserId,
        });
        persistenceService.markDirty();
    }
    
    return simulate(true);
}

export const unfollowUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = findMutableProfile(currentUserId);
    const targetUser = findMutableProfile(targetUserId);

    if (currentUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    }
     if (targetUser) {
        targetUser.followers--;
    }
    persistenceService.markDirty();
    return simulate(true);
}


export const getFollowersForUser = (userId: string) => {
    const followers = allUsers.filter(u => {
      const profile = findMutableProfile(u.id);
      return profile && profile.following.includes(userId);
    });
    return simulate(followers);
}

export const getFollowingForUser = (userId: string) => {
    const user = findMutableProfile(userId);
    if(user) {
        const followingUsers = user.following.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
        return simulate(followingUsers);
    }
    return simulate([]);
}

export const createStreamSession = (djId: string, title: string) => {
    const newSession: StreamSession = {
        id: `stream-${streamSessions.length + 1}`,
        djId,
        title,
        isLive: true,
        listenerCount: 0,
    };
    streamSessions.push(newSession);
    persistenceService.markDirty();
    return simulate(newSession);
};

export const endStreamSession = (sessionId: string): Promise<StreamSession | null> => {
    const session = streamSessions.find(s => s.id === sessionId);
    if (session) {
        session.isLive = false;
        
        // Remove the 'live_now' feed item associated with this stream
        feedItems = feedItems.filter(item => !(item.type === 'live_now' && item.relatedId === sessionId));
        
        persistenceService.markDirty();
        return simulate(session);
    }
    return simulate(null);
};

export const getTracksForDj = async (djId: string): Promise<Track[]> => {
    const data = await fromSupabase(supabase.from('tracks').select('*').eq('artistId', djId));
    if(data === null) {
        return simulate(tracks.filter(t => t.artistId === djId));
    }
    return (data || []) as Track[];
}

export const getPlaylistsForDj = async (djId: string): Promise<Playlist[]> => {
    const data = await fromSupabase(supabase.from('playlists').select('*').eq('creatorId', djId));
    if(data === null) {
        return simulate(playlists.filter(p => p.creatorId === djId));
    }
    
    const dbPlaylists = (data || []) as Omit<Playlist, 'trackIds'>[];
    const enrichedPlaylists = await Promise.all(dbPlaylists.map(async (p) => {
        const { data: trackLinks } = await supabase.from('playlist_tracks').select('track_id').eq('playlist_id', p.id);
        return { ...p, trackIds: trackLinks ? trackLinks.map(l => l.track_id) : [] };
    }));

    return enrichedPlaylists;
}

export const getReviewsForUser = (targetId: string): Promise<EnrichedReview[]> => {
    const userReviews = reviews.filter(r => r.targetId === targetId);
    const enrichedReviews = userReviews.map(review => {
        const author = allUsers.find(u => u.id === review.authorId);
        return { ...review, author: author! };
    }).filter(r => r.author); // ensure author was found
    return simulate(enrichedReviews.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
}

export const submitReview = (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review> => {
    const newReview: Review = {
        ...reviewData,
        id: `r${reviews.length + 1}`,
        timestamp: 'Just now',
    };
    reviews.unshift(newReview);
    persistenceService.markDirty();

    const targetProfile = findMutableProfile(newReview.targetId);
    const author = allUsers.find(u => u.id === newReview.authorId);

    if(targetProfile && author && (targetProfile.role === Role.DJ || targetProfile.role === Role.Business)) {
        const newTotalRating = (targetProfile.rating * targetProfile.reviewsCount) + newReview.rating;
        targetProfile.reviewsCount++;
        targetProfile.rating = newTotalRating / targetProfile.reviewsCount;

        addFeedItem({
            type: 'new_review',
            userId: targetProfile.id,
            title: `${targetProfile.name} received a new review from ${author.name}.`,
            description: newReview.comment || '',
            mediaUrl: targetProfile.avatarUrl,
            mediaType: 'image',
            rating: newReview.rating,
            relatedId: newReview.id,
        });
        
        notifications.unshift({
             id: `n${notifications.length + 1}`,
             userId: targetProfile.id,
             type: NotificationType.NewReview,
             text: `${author.name} left you a ${newReview.rating}-star review!`,
             timestamp: 'Just now',
             read: false,
             relatedId: newReview.id,
        });
    }

    return simulate(newReview);
}

export const getCommentsForPost = (postId: string): Promise<EnrichedComment[]> => {
    const postComments = comments.filter(c => c.postId === postId);
    const enriched = postComments.map(comment => {
        const author = allUsers.find(u => u.id === comment.authorId);
        return { ...comment, author: author! };
    }).filter(c => c.author);
    // sort by oldest first for display
    return simulate(enriched.sort((a,b) => (a.id < b.id ? -1 : 1)));
};

export const addCommentToPost = (postId: string, authorId: string, text: string): Promise<EnrichedComment | null> => {
    const post = feedItems.find(f => f.id === postId);
    const author = allUsers.find(u => u.id === authorId);
    if (!post || !author) return simulate(null);

    const newComment: Comment = {
        id: `c${nextCommentId++}`,
        postId,
        authorId,
        text,
        timestamp: 'Just now',
    };
    comments.push(newComment); // Add to end of array to maintain order
    post.comments++;
    persistenceService.markDirty();

    if (post.userId !== authorId) {
         notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: post.userId,
            type: NotificationType.NewComment,
            text: `${author.name} commented on your post.`,
            timestamp: 'Just now',
            read: false,
            relatedId: postId,
         });
    }
    
    const enrichedComment: EnrichedComment = { ...newComment, author };
    return simulate(enrichedComment);
};

export const addTrack = async (artistId: string, title: string, artworkUrl: string, trackUrl: string) => {
    const newTrackData: Track = {
        id: `t${Math.random().toString(36).substr(2, 9)}`,
        title,
        artistId,
        artworkUrl,
        trackUrl: trackUrl,
        duration: `${Math.floor(Math.random() * 5) + 3}:${Math.floor(Math.random()*60).toString().padStart(2,'0')}` // random duration
    };

    if (!persistenceService.isSeeded) {
        tracks.push(newTrackData);
        persistenceService.markDirty();
    } else {
        const { data: newTrack, error } = await supabase.from('tracks').insert(newTrackData).select().single();
        if (error) {
            console.error("Supabase insert failed for 'tracks':", error);
            throw error;
        }
        tracks.push(newTrack as Track);
    }
    
    addFeedItem({
        type: 'new_track',
        userId: artistId,
        title: `New Track: ${title}`,
        description: `Check out my new track, "${title}"!`,
        mediaUrl: artworkUrl,
        mediaType: 'image',
        relatedId: newTrackData.id,
    });

    return newTrackData;
};

export const createPlaylist = async (creatorId: string, name: string, artworkUrl = '') => {
    const newPlaylistData: Omit<Playlist, 'trackIds'> = {
        id: `pl${Math.random().toString(36).substr(2, 9)}`,
        name,
        creatorId,
        artworkUrl,
    };
    const newPlaylist: Playlist = { ...newPlaylistData, trackIds: [] };

    if (!persistenceService.isSeeded) {
        playlists.push(newPlaylist);
        persistenceService.markDirty();
        return newPlaylist;
    }

    const { data, error } = await supabase.from('playlists').insert(newPlaylistData).select().single();
    if (error) {
        console.error("Supabase insert failed for 'playlists':", error);
        throw error;
    }
    if (!data) return null;

    playlists.push(newPlaylist);
    return newPlaylist;
};

export const updatePlaylist = async (playlistId: string, { name, artworkUrl }: { name?: string, artworkUrl?: string }) => {
    const updateData: { name?: string; artworkUrl?: string } = {};
    if (name) updateData.name = name;
    if (typeof artworkUrl === 'string') updateData.artworkUrl = artworkUrl;

    const mockPlaylist = playlists.find(p => p.id === playlistId);
    if (!mockPlaylist) throw new Error("Playlist not found");

    if (!persistenceService.isSeeded) {
        if(name) mockPlaylist.name = name;
        if(typeof artworkUrl === 'string') mockPlaylist.artworkUrl = artworkUrl;
        persistenceService.markDirty();
        return { ...mockPlaylist };
    }

    const { data, error } = await supabase
        .from('playlists')
        .update(updateData)
        .eq('id', playlistId)
        .select()
        .single();
    
    if (error) {
        console.error("Supabase update failed for 'playlists':", error);
        throw error;
    }

    if(name) mockPlaylist.name = name;
    if(typeof artworkUrl === 'string') mockPlaylist.artworkUrl = artworkUrl;
    
    return data;
}

export const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return null;

    if (!persistenceService.isSeeded) {
        if (!playlist.trackIds.includes(trackId)) {
            playlist.trackIds.push(trackId);
            persistenceService.markDirty();
        }
        return playlist;
    }

    const { error } = await supabase.from('playlist_tracks').insert({
        playlist_id: playlistId,
        track_id: trackId,
    });

    if (error) {
        console.error("Supabase insert failed for 'playlist_tracks':", error);
        throw error;
    }

    if (!playlist.trackIds.includes(trackId)) {
        playlist.trackIds.push(trackId);
    }

    return getPlaylistById(playlistId);
};

export const updateUserProfile = async (userId: string, data: Partial<DJ> | Partial<Business>): Promise<(DJ | Business | null)> => {
    const userProfile = findMutableProfile(userId);
    if (!userProfile) return null;

    if (!persistenceService.isSeeded) {
        Object.assign(userProfile, data);
        persistenceService.markDirty();
        return simulate(userProfile as DJ | Business);
    }
    
    const tableName: 'djs' | 'businesses' = userProfile.role === Role.DJ ? 'djs' : 'businesses';

    const updatePayload: { [key: string]: any } = {};
    Object.keys(data).forEach(key => {
        // We shouldn't be trying to update tracks/mixes this way.
        if (key === 'tracks' || key === 'mixes') return;
        
        const value = data[key as keyof typeof data];
        if (value !== undefined) {
            if (key === 'socials' && typeof value === 'object' && value !== null) {
                const cleanSocials: { [key: string]: any } = {};
                Object.entries(value).forEach(([socialKey, socialValue]) => {
                    if (socialValue) { 
                        cleanSocials[socialKey] = socialValue;
                    }
                });
                updatePayload[key] = Object.keys(cleanSocials).length > 0 ? cleanSocials : null;
            } else {
                updatePayload[key] = value;
            }
        }
    });
    
    let result;
    if (tableName === 'djs') {
        result = await supabase
            .from('djs')
            .update(updatePayload)
            .eq('id', userId)
            .select()
            .single();
    } else {
        result = await supabase
            .from('businesses')
            .update(updatePayload)
            .eq('id', userId)
            .select()
            .single();
    }

    const { data: updatedData, error } = result;

    if (error) {
        console.error(`Supabase update failed for '${tableName}':`, error);
        throw error;
    }
    
    Object.assign(userProfile, data);

    return updatedData as DJ | Business;
}

export const updateUserSettings = async (userId: string, newSettings: Partial<UserSettings>): Promise<boolean> => {
    const userProfile = findMutableProfile(userId);
    if (!userProfile) return false;

    if (!persistenceService.isSeeded) {
        userProfile.settings = { ...userProfile.settings, ...newSettings };
        persistenceService.markDirty();
        return simulate(true);
    }
    
    const tableName = userProfile.role === Role.DJ ? 'djs' : 'businesses';

    let result;
    if (tableName === 'djs') {
        result = await supabase
            .from('djs')
            .update({ settings: newSettings })
            .eq('id', userId);
    } else {
        result = await supabase
            .from('businesses')
            .update({ settings: newSettings })
            .eq('id', userId);
    }

    const { error } = result;

    if (error) {
        console.error(`Supabase update failed for '${tableName}' settings:`, error);
        return false;
    }
    
    userProfile.settings = { ...userProfile.settings, ...newSettings };
    return !error;
}


export const toggleLikePost = (postId: string, userId: string): Promise<{ likes: number; likedBy: string[] } | null> => {
    const post = feedItems.find(f => f.id === postId);
    if (post) {
        if (!post.likedBy) {
            post.likedBy = [];
        }
        const userIndex = post.likedBy.indexOf(userId);
        if (userIndex > -1) {
            // User has liked it, so unlike it
            post.likedBy.splice(userIndex, 1);
            post.likes--;
        } else {
            // User hasn't liked it, so like it
            post.likedBy.push(userId);
            post.likes++;
        }
        persistenceService.markDirty();
        return simulate({ likes: post.likes, likedBy: post.likedBy });
    }
    return simulate(null);
};

export const repost = (originalPostId: string, reposterId: string): Promise<FeedItem | null> => {
    const originalPost = feedItems.find(f => f.id === originalPostId);
    const reposter = allUsers.find(u => u.id === reposterId);
    if (!originalPost || !reposter) return simulate(null);

    // Don't allow reposting a repost to avoid nesting hell.
    if (originalPost.repostOf) return simulate(null);

    const newRepost: FeedItem = {
        id: `f${Date.now()}`, // Use timestamp for unique ID
        type: 'user_post',
        userId: reposterId,
        title: '', // Reposts don't have titles
        description: '', // User could add a comment, but for now it's empty
        timestamp: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        reposts: 0,
        repostOf: originalPostId,
    };
    feedItems.unshift(newRepost);
    persistenceService.markDirty();

    // Increment repost count on original post
    if (typeof originalPost.reposts !== 'number') {
        originalPost.reposts = 0;
    }
    originalPost.reposts++;
    
    // Add notification for the original author
    if (originalPost.userId !== reposterId) {
        notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: originalPost.userId,
            type: NotificationType.Repost,
            text: `${reposter.name} reposted your post.`,
            timestamp: 'Just now',
            read: false,
            relatedId: newRepost.id, // Link to the new repost
        });
    }

    return simulate(newRepost);
};

export const searchUsers = (query: string): Promise<User[]> => {
    if (!query) return simulate([]);
    const lowercasedQuery = query.toLowerCase();
    const results = allUsers
        .filter(u => u.name.toLowerCase().includes(lowercasedQuery))
        .slice(0, 5); // Limit to 5 results
    return simulate(results);
}


// --- DATABASE SEEDING ---

// Seed Payload Type Definition
interface DjProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: Record<string, any>;
  following: string[];
  followers: number;
  role: 'dj';
  genres: string[];
  bio: string;
  location: string;
  rating: number;
  reviewsCount: number;
  tier: string;
  socials?: Record<string, string>;
}

interface BusinessProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  settings?: Record<string, any>;
  following: string[];
  followers: number;
  role: 'business';
  location: string;
  description: string;
  rating: number;
  reviewsCount: number;
  socials?: Record<string, string>;
}

interface SeedTrack {
  id: string;
  title: string;
  artistId: string;
  artworkUrl: string;
  duration: string;
  trackUrl?: string;
}

interface SeedPlaylist {
  id: string;
  name: string;
  creatorId: string;
  artworkUrl: string;
}

interface PlaylistTrack {
  playlist_id: string;
  track_id: string;
}

interface SeedPayload {
  djs?: DjProfile[];
  businesses?: BusinessProfile[];
  tracks?: SeedTrack[];
  playlists?: SeedPlaylist[];
  playlist_tracks?: PlaylistTrack[];
}


// Main orchestrator function for seeding, called by the UI.
export const seedDatabase = async () => {
    console.log("Starting full database seed process via Supabase function invoke...");
    
    // Prepare payload from mock data
    const djsToInsert = djs.map(({ tracks, mixes, ...dj }) => dj);
    const playlistsToInsert = playlists.map(({ trackIds, ...playlist }) => playlist);
    const playlistTrackLinks = playlists.flatMap(p => 
        p.trackIds.map(trackId => ({ playlist_id: p.id, track_id: trackId }))
    );

    const payload: SeedPayload = {
        djs: djsToInsert,
        businesses,
        tracks,
        playlists: playlistsToInsert,
        playlist_tracks: playlistTrackLinks,
    };

    try {
        // Use supabase.functions.invoke to correctly handle auth and avoid CORS issues.
        const { data: result, error } = await supabase.functions.invoke('seed-database', {
            body: payload,
        });

        if (error) {
            // The error from invoke can be a FunctionsHttpError, FunctionsRelayError, or FunctionsFetchError
            // It has a helpful context property.
            throw error;
        }
        
        console.log("Database seeding completed successfully!", result);
        persistenceService.markSeeded();
        return result;
    } catch (error: any) {
        console.error('Comprehensive Seeding Error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            context: error.context // Supabase invoke errors often have more context
        });
        throw error;
    }
};