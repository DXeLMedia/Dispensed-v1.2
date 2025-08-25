let allUsers = [...djs, ...businesses, ...listeners];


// --- GIGS ---
let gigs: Gig[] = [
  { id: 'g1', title: 'Deep Tech Invites: K-DOLLA', venueId: 'biz-1', date: '2025-08-15', time: '22:00', budget: 1500, description: 'Prepare for a journey into the deep. K-DOLLA takes over Mødular for a night of relentless techno.', genres: ['Techno', 'Deep-Tech'], status: 'Open' },
  { id: 'g2', title: 'Rooftop Grooves with DJ Loyd', venueId: 'biz-2', date: '2025-08-17', time: '19:00', budget: 800, description: 'Sunset vibes on the Long Street rooftop. Spinning soulful and deep house.', genres: ['Deep House', 'Soulful House'], status: 'Completed', bookedDjId: 'dj-5' },
  { id: 'g3', title: 'We House Sundays - August Edition', venueId: 'biz-3', date: '2025-08-18', time: '14:00', budget: 1200, description: 'Join the movement. Seeking a DJ who understands the soulful core of house music.', genres: ['Soulful House', 'Afro House'], status: 'Open'},
  { id: 'g4', title: 'Minimal Effort with The Fogshow', venueId: 'biz-4', date: '2025-08-22', time: '23:00', budget: 900, description: 'Intricate grooves and minimal soundscapes all night long with The Other Side head honcho.', genres: ['Minimal', 'Deep-Tech'], status: 'Booked', bookedDjId: 'dj-7'},
  { id: 'g5', title: 'ERA Re-opening Party', venueId: 'biz-5', date: '2025-09-01', time: '21:00', budget: 2000, description: 'The legend is back. We are looking for a headline techno act to celebrate our return.', genres: ['Techno'], status: 'Open'},
  { id: 'g6', title: 'Wolfkop Weekender - Main Stage', venueId: 'biz-23', date: '2026-01-28', time: '18:00', budget: 3500, description: 'Seeking artists for our annual journey into sound. Melodic and groovy sets preferred.', genres: ['Melodic House', 'Deep House', 'Techno'], status: 'Open'},
  { id: 'g7', title: 'Stay True Sounds Showcase', venueId: 'biz-42', date: '2025-09-15', time: '20:00', budget: 1800, description: 'A night dedicated to the finest deep house, with Kid Fonque at the helm.', genres: ['Deep House', 'Jazz'], status: 'Completed', bookedDjId: 'dj-20'},
  { id: 'g8', title: 'Minimal Effort with Pierre Johnson', venueId: 'biz-1', date: '2025-09-05', time: '23:00', budget: 1000, description: 'An intimate night of minimal and deep tech.', genres: ['Minimal', 'Deep-Tech'], status: 'Open'},
  { id: 'g9', title: 'Afro House Journey with Atmos Blaq', venueId: 'biz-7', date: '2025-09-06', time: '20:00', budget: 1200, description: 'An epic journey through the sounds of afro house and afro tech.', genres: ['Afro House', 'Afro Tech'], status: 'Open'},
  { id: 'g10', title: 'Dub Techno Special: Sides', venueId: 'biz-49', date: '2025-09-12', time: '22:00', budget: 750, description: 'Deep End presents a night of pure dub techno. Heads down, eyes closed.', genres: ['Dub-Techno', 'Deep House'], status: 'Open'},
  { id: 'g11', title: 'UNTMD Presents: Rose Bonica', venueId: 'biz-50', date: '2025-09-13', time: '23:00', budget: 900, description: 'Raw, industrial, and experimental techno all night long.', genres: ['Techno', 'Industrial'], status: 'Booked', bookedDjId: 'dj-44'},
  { id: 'g12', title: 'The Search: Leighton Moody All Night Long', venueId: 'biz-41', date: '2025-09-19', time: '21:00', budget: 1500, description: 'A masterclass in soulful and deep house from a Cape Town legend.', genres: ['Deep House', 'Soulful House'], status: 'Open'},
  { id: 'g13', title: 'Sexy Groovy Love - Spring Edition', venueId: 'biz-38', date: '2025-09-27', time: '12:00', budget: 2500, description: 'Our first party of the season! Looking for DJs that bring the vibe.', genres: ['House', 'Tech House', 'Deep House'], status: 'Open'},
  { id: 'g14', title: 'Fiction Fridays: Call for Residents', venueId: 'biz-10', date: '2025-10-01', time: '21:00', budget: 500, description: 'Fiction is looking for new resident DJs to join our family. Send us your mixes!', genres: ['Techno', 'House', 'Break-Dub'], status: 'Open'},
  { id: 'g15', title: 'It Is What It Is ft. Jullian Gomes', venueId: 'biz-26', date: '2025-09-28', time: '14:00', budget: 2000, description: 'The legendary Jullian Gomes graces the IIWII stage for a magical afternoon set.', genres: ['Deep House', 'Soulful House'], status: 'Booked', bookedDjId: 'dj-13'},

  // Gigs for dj-46 (Double X eL) to populate MyGigs page
  { id: 'g16', title: 'Neon Nights Club ft. Double X eL', venueId: 'biz-201', date: '2025-08-15', time: '9:00 PM - 2:00 AM', budget: 450, description: 'Bring extra speakers for outdoor area', genres: ['Techno', 'House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g17', title: 'Sunset Session', venueId: 'biz-202', date: '2025-08-18', time: '7:00 PM - 11:00 PM', budget: 320, description: 'Prepare a chill sunset vibe set', genres: ['Deep House', 'Melodic House'], status: 'Open' },
  { id: 'g18', title: 'Late Night Grooves', venueId: 'biz-1', date: '2025-08-29', time: '11:00 PM - 4:00 AM', budget: 500, description: 'Main room closing set', genres: ['Techno'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g19', title: 'Rooftop Day Party', venueId: 'biz-202', date: '2025-08-22', time: '2:00 PM - 8:00 PM', budget: 280, description: 'Day time event, play groovy house.', genres: ['House'], status: 'Open' },
  { id: 'g20', title: 'The Bassment Opening', venueId: 'biz-203', date: '2025-08-02', time: '10:00 PM - 3:00 AM', budget: 300, description: '', genres: ['Deep-Tech'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g21', title: 'Saturday Social', venueId: 'biz-6', date: '2025-08-09', time: '8:00 PM - 1:00 AM', budget: 250, description: 'Vibey, social atmosphere.', genres: ['House', 'Soulful House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g22', title: 'Groove Garden Festival', venueId: 'biz-204', date: '2025-08-16', time: '12:00 PM - 10:00 PM', budget: 400, description: 'Main stage, peak time slot.', genres: ['Melodic House', 'Progressive'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g23', title: 'We House Sundays Guest Slot', venueId: 'biz-3', date: '2025-08-24', time: '4:00 PM - 6:00 PM', budget: 350, description: 'Warm up for the headliner.', genres: ['Soulful House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g24', title: 'Fiction Wednesdays', venueId: 'biz-10', date: '2025-08-27', time: '10:00 PM - 1:00 AM', budget: 200, description: 'Mid-week party, anything goes.', genres: ['Breaks', 'House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g25', title: 'Reset Closing Set', venueId: 'biz-8', date: '2025-08-30', time: '2:00 AM - 4:00 AM', budget: 250, description: '', genres: ['Techno'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g26', title: 'Warehouse Rave', venueId: 'biz-44', date: '2025-08-23', time: '11:00 PM - 4:00 AM', budget: 300, description: 'Hard and fast techno.', genres: ['Hard Techno', 'Industrial'], status: 'Open' },

  // Gigs for dj-46 to populate previous months on MyGigs page
  // July 2025
  { id: 'g27', title: 'Mid-Month Modular', venueId: 'biz-1', date: '2025-07-15', time: '10:00 PM - 3:00 AM', budget: 400, description: 'Past gig.', genres: ['Techno'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g28', title: 'Winter Warmer at Waiting Room', venueId: 'biz-2', date: '2025-07-22', time: '8:00 PM - 1:00 AM', budget: 250, description: 'Past gig.', genres: ['Deep House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g29', title: 'Souk Saturday', venueId: 'biz-7', date: '2025-07-12', time: '9:00 PM - 2:00 AM', budget: 300, description: 'Past gig.', genres: ['Melodic House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g30', title: 'Fiction Flashback', venueId: 'biz-10', date: '2025-07-04', time: '10:00 PM - 2:00 AM', budget: 200, description: 'Past gig.', genres: ['90s House'], status: 'Completed', bookedDjId: 'dj-46' },

  // June 2025
  { id: 'g31', title: 'Deep Tech Night', venueId: 'biz-203', date: '2025-06-20', time: '11:00 PM - 4:00 AM', budget: 350, description: 'Past gig.', genres: ['Deep-Tech'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g32', title: 'House of Machines Social', venueId: 'biz-6', date: '2025-06-13', time: '7:00 PM - 12:00 AM', budget: 200, description: 'Past gig.', genres: ['House', 'Soulful House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g33', title: 'Colorbox Showcase', venueId: 'biz-9', date: '2025-06-06', time: '9:00 PM - 2:00 AM', budget: 300, description: 'Past gig.', genres: ['Techno', 'Minimal'], status: 'Completed', bookedDjId: 'dj-46' },

  // May 2025
  { id: 'g34', title: 'ERA Special Guest', venueId: 'biz-5', date: '2025-05-30', time: '10:00 PM - 4:00 AM', budget: 500, description: 'Past gig.', genres: ['Progressive', 'Techno'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g35', title: 'Rooftop Sundowners', venueId: 'biz-202', date: '2025-05-16', time: '5:00 PM - 10:00 PM', budget: 320, description: 'Past gig.', genres: ['Melodic House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g36', title: 'Athletic Club Groove', venueId: 'biz-13', date: '2025-05-23', time: '8:00 PM - 1:00 AM', budget: 280, description: 'Past gig.', genres: ['Soulful House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g37', title: 'The Movemint', venueId: 'biz-32', date: '2025-05-09', time: '9:00 PM - 2:00 AM', budget: 250, description: 'Past gig.', genres: ['Deep House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g38', title: 'Kulture Klub Night', venueId: 'biz-33', date: '2025-05-02', time: '10:00 PM - 3:00 AM', budget: 220, description: 'Past gig.', genres: ['Tech House'], status: 'Completed', bookedDjId: 'dj-46' },
];

let interests: { gigId: string; djId: string; timestamp: string }[] = [
    { gigId: 'g17', djId: 'dj-46', timestamp: new Date().toISOString() },
    { gigId: 'g19', djId: 'dj-46', timestamp: new Date().toISOString() },
    { gigId: 'g26', djId: 'dj-46', timestamp: new Date().toISOString() },
];

// --- STREAM SESSIONS ---
const streamSessions: StreamSession[] = [
    { id: 'stream-1', djId: 'dj-3', title: 'Live from a secret warehouse', isLive: true, listenerCount: 1342 },
];

// --- FEED ITEMS ---
let feedItems: FeedItem[] = [
    { id: 'f1', type: 'live_now', userId: 'dj-3', title: 'Desiree is LIVE from a secret warehouse.', description: 'Tuning in for some heavy techno vibes!', imageUrl: 'https://images.unsplash.com/photo-1594623930335-9491a343a429?q=80&w=800&auto=format&fit=crop', timestamp: '2h ago', likes: 1200, comments: 88, shares: 45, relatedId: 'stream-1' },
    { id: 'f2', type: 'new_track', userId: 'dj-10', title: 'New Track: City Lights', description: 'My new single "City Lights" is out now. A deep, lo-fi journey for late nights. Hope you enjoy.', imageUrl: 'https://picsum.photos/seed/dwson-track/600/400', timestamp: '18h ago', likes: 1800, comments: 130, shares: 77 },
    { id: 'f3', type: 'gig_announcement', userId: 'biz-3', title: 'We House Sundays - August Lineup!', description: 'So excited to announce FKA Mash will be headlining our next event! Tickets are flying.', imageUrl: 'https://picsum.photos/seed/whsaug/600/400', timestamp: '1d ago', likes: 950, comments: 45, shares: 30 },
    { id: 'f4', type: 'new_connection', userId: 'dj-1', title: 'K-DOLLA is now following Desiree', description: 'Two of the city\'s techno titans are now connected. We love to see it!', imageUrl: 'https://picsum.photos/seed/connect1/600/400', timestamp: '2d ago', likes: 450, comments: 23, shares: 12 },
    { id: 'f5', type: 'new_review', userId: 'dj-39', title: 'Ivan Turanjanin gets a 5-star review!', description: '"An absolutely mind-blowing, raw performance at Mødular. The master at work." The people have spoken!', imageUrl: 'https://picsum.photos/seed/ivan-review/600/400', timestamp: '3d ago', likes: 1500, comments: 99, shares: 60 },
    { id: 'f6', type: 'new_mix', userId: 'dj-4', title: 'New Mix: Dub Echoes Vol. 5', description: '60 minutes of deep, dubby techno. Perfect for a rainy day in the city.', imageUrl: 'https://picsum.photos/seed/sidesmix/600/400', timestamp: '4d ago', likes: 800, comments: 110, shares: 90, relatedId: 'pl4' },
    { id: 'f14', type: 'new_mix', userId: 'dj-2', title: 'Afro House Sunset Mix', description: 'Here is my latest mix for all the sunset chasers. Enjoy!', imageUrl: 'https://picsum.photos/seed/pl2/600/400', timestamp: '3d ago', likes: 2100, comments: 250, shares: 150, relatedId: 'pl2' },
    { id: 'f7', type: 'gig_announcement', userId: 'biz-1', title: 'Open Decks next Wednesday!', description: 'Think you have what it takes? We\'re hosting an open decks night. Come through and show us what you got. Best selector gets a paid gig.', imageUrl: 'https://picsum.photos/seed/opendecks/600/400', timestamp: '5d ago', likes: 800, comments: 150, shares: 50},
    { id: 'f8', type: 'new_track', userId: 'dj-11', title: 'Out Now: "Langa"', description: 'My new EP just dropped on all platforms. This one is for my home. Big love to everyone supporting.', imageUrl: 'https://picsum.photos/seed/pierrejohnson/600/400', timestamp: '5d ago', likes: 2200, comments: 180, shares: 90},
    { id: 'f9', type: 'live_now', userId: 'dj-12', title: 'Leighton Moody is live!', description: 'Sunday vinyl session incoming. Deep and soulful vibes only.', imageUrl: 'https://picsum.photos/seed/leightonlive/600/400', timestamp: '6d ago', likes: 980, comments: 75, shares: 40},
    { id: 'f10', type: 'new_connection', userId: 'biz-23', title: 'Wolfkop Weekender is now following Pierre Johnson', description: 'Looks like a future collaboration might be on the cards!', imageUrl: 'https://picsum.photos/seed/wolfkoppierre/600/400', timestamp: '1w ago', likes: 1100, comments: 40, shares: 20},
    { id: 'f11', type: 'gig_announcement', userId: 'biz-49', title: 'Deep End returns with Sides', description: 'We\'re back in the warehouse on Sept 12. Limited tickets available for this one.', imageUrl: 'https://picsum.photos/seed/deependg10/600/400', timestamp: '1w ago', likes: 600, comments: 55, shares: 35},
    { id: 'f12', type: 'new_mix', userId: 'dj-7', title: 'The Other Side Live Recording', description: 'Here\'s my set from last weekend. All minimal, all groovy.', imageUrl: 'https://picsum.photos/seed/fogshowmix/600/400', timestamp: '1w ago', likes: 1300, comments: 95, shares: 65},
    { id: 'f13', type: 'new_track', userId: 'dj-33', title: 'Chronical Deep - "Karbau"', description: 'New music alert! My track Karbau is officially out. Go stream it and let me know what you think.', imageUrl: 'https://picsum.photos/seed/chronicaldeep/600/400', timestamp: '8d ago', likes: 2500, comments: 250, shares: 120},
];

// --- NOTIFICATIONS ---
let notifications: Notification[] = [
    // For DJ: Double X eL (dj-46)
    { id: 'n1', userId: 'dj-46', type: NotificationType.Message, text: 'Mødular. wants to discuss your availability for a future gig.', timestamp: '1h ago', read: false, relatedId: 'chat-6' },
    { id: 'n2', userId: 'dj-46', type: NotificationType.NewFollower, text: 'Leighton Moody started following you.', timestamp: '1d ago', read: true, relatedId: 'dj-12' },
    { id: 'n3', userId: 'dj-46', type: NotificationType.EventUpdate, text: 'The gig "Dub Techno Special: Sides" has been updated.', timestamp: '3d ago', read: true, relatedId: 'g10' },

    // For Business: Mødular (biz-1)
    { id: 'n4', userId: 'biz-1', type: NotificationType.BookingRequest, text: 'K-DOLLA expressed interest in your gig: "Deep Tech Invites".', timestamp: '5m ago', read: false, relatedId: 'g1' },
    { id: 'n5', userId: 'biz-1', type: NotificationType.BookingRequest, text: 'Pierre Johnson expressed interest in your gig: "Minimal Effort".', timestamp: '2h ago', read: false, relatedId: 'g8' },
    { id: 'n6', userId: 'biz-1', type: NotificationType.NewFollower, text: 'Cape Town Raver started following you.', timestamp: '1d ago', read: true, relatedId: 'listener-1' },

    // For Listener: Cape Town Raver (listener-1)
    { id: 'n7', userId: 'listener-1', type: NotificationType.EventUpdate, text: 'We House Sundays just announced their August lineup!', timestamp: '4h ago', read: false, relatedId: 'g3' },
];

// --- CHATS ---
let nextMessageId = 5;
const chats: Chat[] = [
  { id: 'chat-1', participants: ['dj-1', 'biz-1'], messages: [
      { id: 'm1', senderId: 'biz-1', text: "Hey K-DOLLA, we have an open slot next Friday. Are you available?", timestamp: "1d ago"},
      { id: 'm2', senderId: 'dj-1', text: "Hey! Sounds good. What are the timings and budget?", timestamp: "22h ago"},
  ]},
  { id: 'chat-2', participants: ['dj-1', 'biz-2'], messages: [
      { id: 'm3', senderId: 'biz-2', text: "Love your latest mix! Let us know when you're free for a rooftop set.", timestamp: "3h ago"},
  ]},
  { id: 'chat-3', participants: ['dj-1', 'dj-2'], messages: [
      { id: 'm4', senderId: 'dj-2', text: "Bro your last set was fire.", timestamp: "2d ago"},
  ]},
  { id: 'chat-4', participants: ['dj-11', 'biz-23'], messages: []},
  { id: 'chat-5', participants: ['dj-10', 'biz-9'], messages: []},
  { id: 'chat-6', participants: ['dj-46', 'biz-1'], messages: [
    { id: 'm5', senderId: 'biz-1', text: "Hey Double X, we're big fans of your untitled.deep series. Let's connect about a potential residency.", timestamp: "1h ago"},
  ]},
];

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


export const getDJs = () => simulate(djs);
export const getDJById = (id: string) => simulate(djs.find(d => d.id === id));
export const getBusinesses = () => simulate(businesses);
export const getBusinessById = (id: string) => simulate(businesses.find(b => b.id === id));
export const getUserById = (id: string) => simulate(allUsers.find(u => u.id === id));
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
export const getFeedItems = () => simulate(feedItems.sort((a,b) => 0.5 - Math.random()));

export const addFeedItem = (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => {
    const newFeedItem: FeedItem = {
        ...item,
        id: `f${feedItems.length + 1}`,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
    };
    feedItems.unshift(newFeedItem);
    return simulate(newFeedItem);
}


export const getPlaylistById = (id: string) => simulate(playlists.find(p => p.id === id));
export const getTracksByIds = (ids: string[]) => simulate(tracks.filter(t => ids.includes(t.id)));
export const getStreamSessionById = (id: string) => simulate(streamSessions.find(s => s.id === id));


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

        return simulate(newMessage);
    }

};


export const authenticate = (email: string): Promise<User | undefined> => {
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return simulate(undefined);

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

export const addGig = (newGig: Omit<Gig, 'id' | 'status'>) => {
    const gig: Gig = {
        ...newGig,
        id: `g${gigs.length + 1}`,
        status: 'Open'
    };
    gigs.unshift(gig);
    return simulate(gig);
}

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



    if (gig && dj && venue) {
        if (gig.status === 'Booked') {
            console.error("Gig is already booked");
            return simulate(false);
        }



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



// Leaderboard Functions
export const getTopDJs = () => simulate(djs.slice().sort((a, b) => b.rating - a.rating));
export const getTopVenues = () => simulate(businesses.slice().sort((a, b) => b.rating - a.rating));

// Social Functions
const findMutableProfile = (userId: string): DJ | Business | Listener | undefined => {
    let user: DJ | Business | Listener | undefined = djs.find(u => u.id === userId);
    if (user) return user;
    user = businesses.find(u => u.id === userId);
    if (user) return user;
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
    
export const unfollowUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = findMutableProfile(currentUserId);
    const targetUser = findMutableProfile(targetUserId);

    if (currentUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    }
     if (targetUser) {
        targetUser.followers--;
    }
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
    return simulate(newSession);
};

export const getTracksForDj = (djId: string) => {
    const djTracks = tracks.filter(t => t.artistId === djId);
    return simulate(djTracks);
}

export const getPlaylistsForDj = (djId: string) => {
    const djPlaylists = playlists.filter(p => p.creatorId === djId);
    return simulate(djPlaylists);
}