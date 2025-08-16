
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DJ, Business, Role, Track, Gig, Listener, Playlist } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { PageSpinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconSettings, IconStar, IconMusic, IconPlay, IconShare, IconArrowLeft, IconBriefcase, IconRadio, IconPlusCircle } from '../constants';

const Stat = ({ value, label, to }: { value: string | number; label: string, to?: string }) => {
    const content = (
        <div className="text-center">
            <p className="font-orbitron text-xl font-bold">{value}</p>
            <p className="text-xs text-zinc-400">{label}</p>
        </div>
    );

    if (to) {
        return <Link to={to} className="hover:bg-zinc-800 p-2 rounded-md">{content}</Link>
    }
    return <div className="p-2">{content}</div>;
}

const ProfileTabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'about' | 'media') => void }) => (
  <div className="flex p-1 bg-zinc-800 rounded-lg mx-4 my-2">
    <button
      onClick={() => setActiveTab('about')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'about' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
    >
      About
    </button>
    <button
      onClick={() => setActiveTab('media')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'media' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
    >
      Media
    </button>
  </div>
);

const MediaGridItem = ({ item }: { item: Track | Playlist }) => (
    <div className="relative aspect-square bg-zinc-800 rounded-lg overflow-hidden group">
        <img src={item.artworkUrl} alt={('title' in item) ? item.title : item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <IconPlay size={40} className="text-white" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
             <p className="font-bold text-white text-sm truncate">{('title' in item) ? item.title : item.name}</p>
        </div>
    </div>
)


interface DJProfileProps {
    dj: DJ;
    isOwnProfile: boolean;
}

const DJProfile: React.FC<DJProfileProps> = ({ dj, isOwnProfile }) => {
    const { user: currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<'about' | 'media'>('about');
    
    useEffect(() => {
        if(currentUser && 'following' in currentUser) {
            setIsFollowing((currentUser as DJ | Business | Listener).following.includes(dj.id));
        }
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
    
    const allMedia = [...dj.tracks, ...dj.mixes];

    return (
        <>
            <div className="p-4 flex flex-col items-center text-center">
                <Avatar src={dj.avatarUrl} alt={dj.name} size="xl" className="mb-4 border-4 border-zinc-800" />
                <h1 className="font-orbitron text-2xl font-bold text-white">{dj.name}</h1>
                 <div className="mt-2 px-4 py-1 bg-lime-400/20 text-lime-300 rounded-full font-bold text-sm">
                    {dj.tier}
                </div>
            </div>

            <div className="flex justify-around p-4 bg-zinc-900/50">
                <Stat value={dj.rating.toFixed(1)} label="Rating" />
                <Stat value={dj.followers.toLocaleString()} label="Followers" to={`/profile/${dj.id}/connections?tab=followers`} />
                <Stat value={dj.following.length} label="Following" to={`/profile/${dj.id}/connections?tab=following`} />
            </div>

            <div className="p-4">
                 {isOwnProfile ? (
                     <div className="grid grid-cols-2 gap-2">
                        <Link to="/gigs" className="flex items-center justify-center gap-2 w-full bg-zinc-800 text-white font-bold py-3 rounded-lg hover:bg-zinc-700 transition-colors">
                            <IconBriefcase size={20} /> My Gigs
                        </Link>
                         <Link to="/stream-setup" className="flex items-center justify-center gap-2 w-full bg-lime-400 text-black font-bold py-3 rounded-lg hover:bg-lime-300 transition-colors">
                            <IconRadio size={20} /> Go Live
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleFollowToggle} className={`flex-1 font-bold py-2 rounded-lg transition-colors ${(currentUser && 'following' in currentUser) ? (isFollowing ? 'bg-zinc-800 text-white' : 'bg-lime-400 text-black') : 'bg-zinc-600'}`} disabled={!currentUser || !('following' in currentUser)}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleMessage} className="flex-1 bg-zinc-800 text-white font-bold py-2 rounded-lg">Message</button>
                        <button className="p-2 bg-zinc-800 text-white rounded-lg"><IconShare size={20} /></button>
                    </div>
                )}
            </div>
            
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="px-4 pb-4">
                {activeTab === 'about' && (
                     <>
                        <div className="mb-4">
                             <h2 className="font-orbitron text-lg font-bold mb-2">Genres</h2>
                             <div className="flex flex-wrap gap-2">
                                {dj.genres.map(genre => (
                                    <span key={genre} className="px-3 py-1 bg-lime-900/50 border border-lime-500/30 text-lime-300 text-xs font-semibold rounded-full">{genre}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-orbitron text-lg font-bold mb-2">About</h2>
                            <p className="text-zinc-300 whitespace-pre-line">{dj.bio}</p>
                        </div>
                    </>
                )}
                {activeTab === 'media' && (
                     <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                        {allMedia.length > 0 ? (
                            allMedia.map(item => <MediaGridItem key={item.id} item={item} />)
                        ) : (
                            <p className="col-span-3 md:col-span-4 text-center text-zinc-500 py-8">No media uploaded yet.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    )
};

interface BusinessProfileProps {
    business: Business;
    isOwnProfile: boolean;
}
const BusinessProfile: React.FC<BusinessProfileProps> = ({ business, isOwnProfile }) => {
    const { user: currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [gigs, setGigs] = useState<Gig[]>([]);

    useEffect(() => {
        if(currentUser && 'following' in currentUser) {
            setIsFollowing((currentUser as DJ | Business | Listener).following.includes(business.id));
        }
        api.getGigsForVenue(business.id).then(gigs => setGigs(gigs.filter(g => g.status === 'Open' || g.status === 'Booked')));
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
    
    return (
        <>
            <div className="p-4 flex flex-col items-center text-center">
                <Avatar src={business.avatarUrl} alt={business.venueName} size="xl" className="mb-4 border-4 border-zinc-800" />
                <h1 className="font-orbitron text-2xl font-bold text-white">{business.venueName}</h1>
                <p className="text-zinc-400">{business.location}</p>
            </div>

            <div className="flex justify-around p-4 bg-zinc-900/50">
                <Stat value={business.rating.toFixed(1)} label="Rating" />
                <Stat value={business.followers.toLocaleString()} label="Followers" to={`/profile/${business.id}/connections?tab=followers`} />
                <Stat value={business.following.length} label="Following" to={`/profile/${business.id}/connections?tab=following`} />
            </div>

            <div className="p-4 space-y-4">
                {isOwnProfile ? (
                     <div className="grid grid-cols-2 gap-2">
                        <Link to="/venue/gigs" className="flex items-center justify-center gap-2 w-full bg-zinc-800 text-white font-bold py-3 rounded-lg hover:bg-zinc-700 transition-colors">
                            <IconBriefcase size={20} /> Manage Gigs
                        </Link>
                         <Link to="/create-gig" className="flex items-center justify-center gap-2 w-full bg-lime-400 text-black font-bold py-3 rounded-lg hover:bg-lime-300 transition-colors">
                            <IconPlusCircle size={20} /> New Gig
                        </Link>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleFollowToggle} className={`flex-1 font-bold py-2 rounded-lg transition-colors ${(currentUser && 'following' in currentUser) ? (isFollowing ? 'bg-zinc-800 text-white' : 'bg-lime-400 text-black') : 'bg-zinc-600'}`} disabled={!currentUser || !('following' in currentUser)}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleMessage} className="flex-1 bg-zinc-800 text-white font-bold py-2 rounded-lg">Message</button>
                        <button className="p-2 bg-zinc-800 text-white rounded-lg"><IconShare size={20} /></button>
                    </div>
                )}

                <div>
                    <h2 className="font-orbitron text-lg font-bold mb-2">About {business.venueName}</h2>
                    <p className="text-zinc-300 whitespace-pre-line">{business.description}</p>
                </div>

                {gigs.length > 0 && (
                    <div>
                        <h2 className="font-orbitron text-lg font-bold mb-2">Upcoming Gigs</h2>
                        <div className="space-y-2">
                            {gigs.map(gig => (
                                <div key={gig.id} className="block bg-zinc-800/50 p-3 rounded-lg hover:bg-zinc-800">
                                    <p className="font-semibold text-white">{gig.title}</p>
                                    <p className="text-sm text-zinc-400">{new Date(gig.date).toDateString()}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gig.status === 'Open' ? 'bg-lime-400/20 text-lime-300' : 'bg-blue-400/20 text-blue-300'}`}>{gig.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};


export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<DJ | Business | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = id === 'me' ? currentUser?.id : id;

  useEffect(() => {
    if (!profileId) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
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

    fetchProfile();
  }, [profileId, navigate]);
  
  if (loading) return <PageSpinner />;

  const isOwnProfile = profileId === currentUser?.id;

  if (!profileData) {
     if(id === 'me' && currentUser?.role === Role.Listener) {
        return (
            <div className="text-white min-h-full pb-20">
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center">
                    <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
                    <span className="font-semibold">My Profile</span>
                    <div className="w-8"/>
                </div>
                <div className='p-4 text-center'>
                    <Avatar src={currentUser!.avatarUrl} alt={currentUser!.name} size="xl" className="mx-auto mb-4 border-4 border-zinc-800" />
                    <h1 className="font-orbitron text-2xl font-bold text-white">{currentUser!.name}</h1>
                    <p className="text-zinc-400 mt-1 capitalize">{currentUser!.role}</p>
                     <div className="mt-8">
                        <p className="text-zinc-500">More profile features for listeners are coming soon!</p>
                    </div>
                </div>
            </div>
        );
     }
     return <div className="text-center text-red-500 p-8">Profile not found.</div>;
  }

  return (
    <div className="text-white min-h-full pb-20">
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
        <span className="font-semibold">{profileData.role === Role.DJ ? "DJ Profile" : "Venue Profile"}</span>
        <div className="w-8"/>
      </div>
      {profileData.role === Role.DJ && <DJProfile dj={profileData as DJ} isOwnProfile={isOwnProfile} />}
      {profileData.role === Role.Business && <BusinessProfile business={profileData as Business} isOwnProfile={isOwnProfile} />}
    </div>
  );
};
