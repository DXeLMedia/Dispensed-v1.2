
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { DJ, Business, Role, Track, Gig, Listener, Playlist, EnrichedReview } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { PageSpinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconSettings, IconStar, IconMusic, IconPlay, IconShare, IconArrowLeft, IconBriefcase, IconRadio, IconPlusCircle, IconList, IconPencil, IconInstagram, IconWebsite, IconTrophy, IconMoney, IconMapPin, IconCalendar } from '../constants';
import { RatingModal } from '../components/RatingModal';
import { ReviewCard } from '../components/ReviewCard';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';
import { EditProfileModal } from '../components/EditProfileModal';

const Stat = ({ value, label, to }: { value: string | number; label: string, to?: string }) => {
    const content = (
        <div className="text-center">
            <p className="font-orbitron text-xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        </div>
    );

    if (to) {
        return <Link to={to} className="hover:bg-[var(--surface-2)] p-2 rounded-md">{content}</Link>
    }
    return <div className="p-2">{content}</div>;
}

const ProfileTabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'about' | 'media' | 'reviews') => void }) => (
  <div className="flex p-1 bg-[var(--surface-2)] rounded-lg mx-4 my-2">
    <button
      onClick={() => setActiveTab('about')}
      className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'about' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
    >
      About
    </button>
    <button
      onClick={() => setActiveTab('media')}
      className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'media' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
    >
      Media
    </button>
    <button
      onClick={() => setActiveTab('reviews')}
      className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'reviews' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
    >
      Reviews
    </button>
  </div>
);

const MediaGridItem = ({ artworkUrl, name, onClick }: { artworkUrl: string, name: string, onClick: () => void }) => {
    return (
        <button onClick={onClick} className="relative aspect-square bg-[var(--surface-2)] rounded-lg overflow-hidden group">
            <img src={artworkUrl} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <IconPlay size={40} className="text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-left">
                <p className="font-bold text-white text-sm truncate">{name}</p>
            </div>
        </button>
    )
}


interface DJProfileProps {
    dj: DJ;
    isOwnProfile: boolean;
    onReviewSubmitted: () => void;
    onEditClick: () => void;
}

const DJProfile: React.FC<DJProfileProps> = ({ dj, isOwnProfile, onReviewSubmitted, onEditClick }) => {
    const { user: currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<'about' | 'media' | 'reviews'>('about');
    const [reviews, setReviews] = useState<EnrichedReview[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const { playPlaylist } = useMediaPlayer();
    
    const fetchReviews = async () => {
      const reviewData = await api.getReviewsForUser(dj.id);
      setReviews(reviewData);
    };

    const fetchMedia = async () => {
         const [trackData, playlistData] = await Promise.all([
            api.getTracksForDj(dj.id),
            api.getPlaylistsForDj(dj.id)
        ]);
        setTracks(trackData);
        setPlaylists(playlistData);
    };

    useEffect(() => {
        if(currentUser && 'following' in currentUser) {
            setIsFollowing((currentUser as DJ | Business | Listener).following.includes(dj.id));
        }
        fetchReviews();
        fetchMedia();
    }, [currentUser, dj.id]);

    const handleFollowToggle = async () => {
        if (!currentUser || !('following' in currentUser)) return;

        const optimisticUser = JSON.parse(JSON.stringify(currentUser));
        
        if (isFollowing) {
            await api.unfollowUser(currentUser.id, dj.id);
            optimisticUser.following = optimisticUser.following.filter((id: string) => id !== dj.id);
        } else {
            await api.followUser(currentUser.id, dj.id);
            optimisticUser.following.push(dj.id);
        }
        setIsFollowing(!isFollowing);
        updateUser(optimisticUser);
    };

    const handleMessage = async () => {
        if (!currentUser) return;
        const chat = await api.findChatByParticipants(currentUser.id, dj.id);
        if (chat) {
            navigate(`/messages/${chat.id}`);
        } else {
            const newChat = await api.createChat(currentUser.id, dj.id);
            if (newChat) {
                navigate(`/messages/${newChat.id}`);
            }
        }
    };

    const handlePlayTrack = (trackIndex: number) => {
        if (trackIndex !== -1) {
            playPlaylist(tracks, trackIndex);
        }
    };
    
    const handlePlayPlaylist = (playlist: Playlist) => {
        api.getTracksByIds(playlist.trackIds).then(playlistTracks => {
            if(playlistTracks.length > 0) {
                playPlaylist(playlistTracks, 0);
            } else {
                alert("This playlist is empty.");
            }
        });
    };
    
    const getPlaylistCover = (playlist: Playlist) => {
        if (playlist.artworkUrl) return playlist.artworkUrl;
        if (playlist.trackIds.length > 0) {
            const firstTrack = tracks.find(t => t.id === playlist.trackIds[0]);
            return firstTrack?.artworkUrl || `https://source.unsplash.com/200x200/?music&sig=${playlist.id}`;
        }
        return `https://source.unsplash.com/200x200/?music,abstract&sig=${playlist.id}`; // Default for empty playlist
    };

    const hasSocials = dj.socials && Object.values(dj.socials).some(Boolean);
    const hasDetails = dj.experienceYears || dj.hourlyRate || dj.travelRadius;

    return (
        <>
            <div className="p-4 flex flex-col items-center text-center">
                <Avatar src={dj.avatarUrl} alt={dj.name} size="xl" className="mb-4 border-4 border-[var(--surface-2)]" />
                <h1 className="font-orbitron text-2xl font-bold text-[var(--text-primary)]">{dj.name}</h1>
                 <div className="mt-2 px-4 py-1 bg-lime-400/20 text-lime-300 rounded-full font-bold text-sm">
                    {dj.tier}
                </div>
            </div>

            <div className="flex justify-around p-4 bg-[var(--surface-1)]/50">
                <Stat value={dj.rating.toFixed(1)} label="Rating" />
                <Stat value={dj.followers.toLocaleString()} label="Followers" to={`/profile/${dj.id}/connections?tab=followers`} />
                <Stat value={dj.reviewsCount} label="Reviews" />
            </div>

            <div className="p-4">
                 {isOwnProfile ? (
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={onEditClick} className="flex items-center justify-center gap-2 w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg hover:bg-[var(--border)] transition-colors">
                            <IconPencil size={18} /> Edit Profile
                        </button>
                         <Link to="/media-manager" className="flex items-center justify-center gap-2 w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg hover:bg-[var(--border)] transition-colors">
                            <IconList size={20} /> Manage Media
                        </Link>
                         <Link to="/gigs" className="flex items-center justify-center gap-2 w-full col-span-2 bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg hover:bg-[var(--border)] transition-colors">
                            <IconBriefcase size={20} /> My Gigs
                        </Link>
                         <Link to="/stream-setup" className="flex items-center justify-center gap-2 w-full col-span-2 bg-[var(--accent)] text-[var(--accent-text)] font-bold py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                            <IconRadio size={20} /> Go Live
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleFollowToggle} className={`font-bold py-3 rounded-lg transition-colors ${(currentUser && 'following' in currentUser) ? (isFollowing ? 'bg-[var(--surface-2)] text-[var(--text-primary)]' : 'bg-[var(--accent)] text-[var(--accent-text)]') : 'bg-[var(--surface-2)]'}`} disabled={!currentUser || !('following' in currentUser)}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleMessage} className="bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg">Message</button>
                    </div>
                )}
            </div>
            
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="px-4 pb-4 space-y-4">
                {activeTab === 'about' && (
                     <div className="space-y-4">
                        {hasSocials && (
                             <div>
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Connect</h2>
                                <div className="flex flex-wrap gap-2">
                                    {dj.socials?.instagram && <a href={`https://instagram.com/${dj.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-lg hover:bg-[var(--border)]"><IconInstagram size={20} /></a>}
                                    {dj.socials?.soundcloud && <a href={`https://soundcloud.com/${dj.socials.soundcloud}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-lg hover:bg-[var(--border)]"><IconMusic size={20} /></a>}
                                    {dj.socials?.website && <a href={`https://${dj.socials.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-lg hover:bg-[var(--border)]"><IconWebsite size={20} /></a>}
                                </div>
                            </div>
                        )}
                        <div>
                             <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Genres</h2>
                             <div className="flex flex-wrap gap-2">
                                {dj.genres.map(genre => (
                                    <span key={genre} className="px-3 py-1 bg-lime-900/50 border border-lime-500/30 text-lime-300 text-xs font-semibold rounded-full">{genre}</span>
                                ))}
                            </div>
                        </div>

                        {hasDetails && (
                            <div>
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">DJ Details</h2>
                                <div className="grid grid-cols-3 gap-2 text-center p-3 bg-[var(--surface-2)]/50 rounded-lg">
                                    {dj.experienceYears != null && (
                                        <div>
                                            <IconTrophy size={22} className="mx-auto text-[var(--accent)]" />
                                            <p className="font-bold text-sm mt-1">{dj.experienceYears} yrs</p>
                                            <p className="text-xs text-[var(--text-muted)]">Experience</p>
                                        </div>
                                    )}
                                    {dj.hourlyRate != null && (
                                        <div>
                                            <IconMoney size={22} className="mx-auto text-[var(--accent)]" />
                                            <p className="font-bold text-sm mt-1">R{dj.hourlyRate}/hr</p>
                                            <p className="text-xs text-[var(--text-muted)]">Rate</p>
                                        </div>
                                    )}
                                    {dj.travelRadius != null && (
                                        <div>
                                            <IconMapPin size={22} className="mx-auto text-[var(--accent)]" />
                                            <p className="font-bold text-sm mt-1">{dj.travelRadius} km</p>
                                            <p className="text-xs text-[var(--text-muted)]">Travels</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {dj.availabilitySchedule && (
                            <div>
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Availability</h2>
                                <div className="flex items-start gap-3 p-3 bg-[var(--surface-2)]/50 rounded-lg">
                                    <IconCalendar size={20} className="text-[var(--accent)] mt-1 flex-shrink-0" />
                                    <p className="text-[var(--text-secondary)] whitespace-pre-line">{dj.availabilitySchedule}</p>
                                </div>
                            </div>
                        )}

                        {dj.equipmentOwned && dj.equipmentOwned.length > 0 && (
                            <div>
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Equipment</h2>
                                <div className="flex flex-wrap gap-2">
                                    {dj.equipmentOwned.map(item => (
                                        <span key={item} className="px-3 py-1 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-semibold rounded-full">{item}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">About</h2>
                            <p className="text-[var(--text-secondary)] whitespace-pre-line">{dj.bio}</p>
                        </div>
                    </div>
                )}
                {activeTab === 'media' && (
                     <div className="space-y-4">
                        <div>
                            <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Playlists</h2>
                             {playlists.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                                    {playlists.map(p => (
                                        <MediaGridItem key={p.id} name={p.name} artworkUrl={getPlaylistCover(p)} onClick={() => handlePlayPlaylist(p)} />
                                    ))}
                                </div>
                             ) : (
                                <p className="text-center text-[var(--text-muted)] py-4">No playlists yet.</p>
                             )}
                        </div>
                        <div>
                            <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Tracks</h2>
                            {tracks.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                                    {tracks.map((t, index) => (
                                        <MediaGridItem key={t.id} name={t.title} artworkUrl={t.artworkUrl} onClick={() => handlePlayTrack(index)} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[var(--text-muted)] py-4">No tracks uploaded yet.</p>
                            )}
                        </div>
                    </div>
                )}
                 {activeTab === 'reviews' && (
                     reviews.length > 0 ? reviews.map(review => (
                         <ReviewCard key={review.id} review={review} />
                     )) : (
                         <p className="text-center text-[var(--text-muted)] py-8">No reviews yet.</p>
                     )
                )}
            </div>
        </>
    )
};

interface BusinessProfileProps {
    business: Business;
    isOwnProfile: boolean;
    onReviewSubmitted: () => void;
    onEditClick: () => void;
}
const BusinessProfile: React.FC<BusinessProfileProps> = ({ business, isOwnProfile, onReviewSubmitted, onEditClick }) => {
    const { user: currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [activeTab, setActiveTab] = useState<'about' | 'media' | 'reviews'>('about');
    const [reviews, setReviews] = useState<EnrichedReview[]>([]);

    const fetchReviews = async () => {
        setReviews(await api.getReviewsForUser(business.id));
    };

    useEffect(() => {
        if(currentUser && 'following' in currentUser) {
            setIsFollowing((currentUser as DJ | Business | Listener).following.includes(business.id));
        }
        api.getGigsForVenue(business.id).then(gigs => setGigs(gigs.filter(g => g.status === 'Open' || g.status === 'Booked')));
        fetchReviews();
    }, [currentUser, business.id]);

    const handleFollowToggle = async () => {
        if (!currentUser || !('following' in currentUser)) return;
        const optimisticUser = JSON.parse(JSON.stringify(currentUser));
        if (isFollowing) {
            await api.unfollowUser(currentUser.id, business.id);
            optimisticUser.following = optimisticUser.following.filter((id: string) => id !== business.id);
        } else {
            await api.followUser(currentUser.id, business.id);
            optimisticUser.following.push(business.id);
        }
        setIsFollowing(!isFollowing);
        updateUser(optimisticUser);
    };

    const handleMessage = async () => {
        if (!currentUser) return;
        const chat = await api.findChatByParticipants(currentUser.id, business.id);
        if (chat) {
            navigate(`/messages/${chat.id}`);
        } else {
            const newChat = await api.createChat(currentUser.id, business.id);
            if (newChat) {
                navigate(`/messages/${newChat.id}`);
            }
        }
    };
    
    const hasSocials = business.socials && Object.values(business.socials).some(Boolean);

    return (
        <>
            <div className="p-4 flex flex-col items-center text-center">
                <Avatar src={business.avatarUrl} alt={business.name} size="xl" className="mb-4 border-4 border-[var(--surface-2)]" />
                <h1 className="font-orbitron text-2xl font-bold text-[var(--text-primary)]">{business.name}</h1>
                <p className="text-[var(--text-secondary)]">{business.location}</p>
            </div>

            <div className="flex justify-around p-4 bg-[var(--surface-1)]/50">
                <Stat value={business.rating.toFixed(1)} label="Rating" />
                <Stat value={business.followers.toLocaleString()} label="Followers" to={`/profile/${business.id}/connections?tab=followers`} />
                <Stat value={business.reviewsCount} label="Reviews" />
            </div>

            <div className="p-4">
                {isOwnProfile ? (
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={onEditClick} className="flex items-center justify-center gap-2 w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg hover:bg-[var(--border)] transition-colors">
                            <IconPencil size={18} /> Edit Profile
                        </button>
                        <Link to="/venue/gigs" className="flex items-center justify-center gap-2 w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg hover:bg-[var(--border)] transition-colors">
                            <IconBriefcase size={20} /> Manage Gigs
                        </Link>
                         <Link to="/create-gig" className="col-span-2 flex items-center justify-center gap-2 w-full bg-[var(--accent)] text-[var(--accent-text)] font-bold py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                            <IconPlusCircle size={20} /> New Gig
                        </Link>
                    </div>
                ) : (
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleFollowToggle} className={`font-bold py-3 rounded-lg transition-colors ${(currentUser && 'following' in currentUser) ? (isFollowing ? 'bg-[var(--surface-2)] text-[var(--text-primary)]' : 'bg-[var(--accent)] text-[var(--accent-text)]') : 'bg-[var(--surface-2)]'}`} disabled={!currentUser || !('following' in currentUser)}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleMessage} className="bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-3 rounded-lg">Message</button>
                    </div>
                )}
            </div>
            
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab as any} />
            
            <div className="px-4 pb-4 space-y-4">
                {activeTab === 'about' && (
                    <>
                        {hasSocials && (
                             <div className="mb-4">
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Connect</h2>
                                <div className="flex flex-wrap gap-2">
                                    {business.socials?.instagram && <a href={`https://instagram.com/${business.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-lg hover:bg-[var(--border)]"><IconInstagram size={20} /></a>}
                                    {business.socials?.website && <a href={`https://${business.socials.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-lg hover:bg-[var(--border)]"><IconWebsite size={20} /></a>}
                                </div>
                            </div>
                        )}
                        <div>
                            <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">About {business.name}</h2>
                            <p className="text-[var(--text-secondary)] whitespace-pre-line">{business.description}</p>
                        </div>
                        {gigs.length > 0 && (
                            <div>
                                <h2 className="font-orbitron text-lg font-bold mb-2 text-[var(--text-primary)]">Upcoming Gigs</h2>
                                <div className="space-y-2">
                                    {gigs.map(gig => (
                                        <div key={gig.id} className="block bg-[var(--surface-2)]/50 p-3 rounded-lg hover:bg-[var(--surface-2)] flex items-center gap-4">
                                            {gig.flyerUrl && (
                                                <img src={gig.flyerUrl} alt={gig.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold text-[var(--text-primary)]">{gig.title}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{new Date(gig.date).toDateString()}</p>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gig.status === 'Open' ? 'bg-lime-400/20 text-lime-300' : 'bg-blue-400/20 text-blue-300'}`}>{gig.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                 {activeTab === 'reviews' && (
                     reviews.length > 0 ? reviews.map(review => (
                         <ReviewCard key={review.id} review={review} />
                     )) : (
                         <p className="text-center text-[var(--text-muted)] py-8">No reviews yet.</p>
                     )
                )}
                {activeTab === 'media' && (
                    <p className="text-center text-[var(--text-muted)] py-8">Media gallery for venues coming soon.</p>
                )}
            </div>
        </>
    );
};


export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<DJ | Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileId = id === 'me' ? currentUser?.id : id;

  const fetchProfile = async () => {
    if (!profileId) return;
    setLoading(true);
    const user = await api.getUserById(profileId);
    if (user?.role === Role.DJ) {
      const djProfile = await api.getDJById(profileId);
      setProfileData(djProfile || null);
    } else if (user?.role === Role.Business) {
      const businessProfile = await api.getBusinessById(profileId);
      setProfileData(businessProfile || null);
    } else {
       setProfileData(null); 
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true' && id === 'me') {
        setIsEditModalOpen(true);
    }
  }, [location.search, id]);

  useEffect(() => {
    if (!profileId) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [profileId, navigate]);

  const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      navigate(location.pathname, { replace: true });
  }

  const handleProfileUpdate = async () => {
      handleCloseEditModal();
      setLoading(true);
      await fetchProfile(); // Refetches for the page
      
      // Also update auth context so navbar/etc updates
      if (profileId) {
          const fullUpdatedProfile = profileData?.role === Role.DJ 
              ? await api.getDJById(profileId)
              : await api.getBusinessById(profileId);
          if (fullUpdatedProfile) {
              updateUser(fullUpdatedProfile);
          }
      }
  };
  
  if (loading) return <PageSpinner />;

  const isOwnProfile = profileId === currentUser?.id;

  if (!profileData) {
     if(id === 'me' && currentUser?.role === Role.Listener) {
        return (
            <div className="text-[var(--text-primary)] min-h-full pb-20">
                <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-[var(--border)]">
                    <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
                    <span className="font-semibold">My Profile</span>
                    <div className="w-8"/>
                </div>
                <div className='p-4 text-center'>
                    <Avatar src={currentUser!.avatarUrl} alt={currentUser!.name} size="xl" className="mx-auto mb-4 border-4 border-[var(--surface-2)]" />
                    <h1 className="font-orbitron text-2xl font-bold text-[var(--text-primary)]">{currentUser!.name}</h1>
                    <p className="text-[var(--text-secondary)] mt-1 capitalize">{currentUser!.role}</p>
                     <div className="mt-8">
                        <p className="text-[var(--text-muted)]">More profile features for listeners are coming soon!</p>
                    </div>
                </div>
            </div>
        );
     }
     return <div className="text-center text-red-500 p-8">Profile not found.</div>;
  }

  return (
    <div className="text-[var(--text-primary)] min-h-full pb-20">
      <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-[var(--border)]">
        <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
        <span className="font-semibold">{profileData.role === Role.DJ ? "DJ Profile" : "Venue Profile"}</span>
        { isOwnProfile && <Link to="/settings"><IconSettings size={22} /></Link> }
        { !isOwnProfile && <div className="w-8" /> }
      </div>
      {profileData.role === Role.DJ && <DJProfile dj={profileData as DJ} isOwnProfile={isOwnProfile} onReviewSubmitted={fetchProfile} onEditClick={() => setIsEditModalOpen(true)} />}
      {profileData.role === Role.Business && <BusinessProfile business={profileData as Business} isOwnProfile={isOwnProfile} onReviewSubmitted={fetchProfile} onEditClick={() => setIsEditModalOpen(true)} />}
    
      {isOwnProfile && (
        <EditProfileModal 
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onProfileUpdated={handleProfileUpdate}
            profileData={profileData}
        />
      )}
    </div>
  );
};
