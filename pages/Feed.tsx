
import React, { useEffect, useState } from 'react';
import { FeedItem as FeedItemType, User, Role } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconHeart, IconComment, IconRadio, IconSearch, IconNotifications, IconStar, IconPlay, IconPlus, IconRepeat } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TrackPreview } from '../components/TrackPreview';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';


const FeedHeader = ({ unreadCount, role }: { unreadCount: number; role: Role | null }) => (
  <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
        <h1 className="font-orbitron text-xl font-bold text-[var(--text-primary)]">Feed</h1>
        <div className="flex items-center gap-4">
            {role === Role.DJ && (
              <Link to="/stream-setup" className="bg-[var(--accent)] text-[var(--accent-text)] font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <IconRadio size={14} />
                GO LIVE
              </Link>
            )}
            <Link to="/search">
                <IconSearch size={22} className="text-[var(--text-secondary)]" />
            </Link>
            <Link to="/notifications" className="relative">
                <IconNotifications size={22} className="text-[var(--text-secondary)]" />
                 {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                    </span>
                )}
            </Link>
        </div>
      </div>
  </div>
);

const OriginalPostCard: React.FC<{ item: FeedItemType }> = ({ item }) => {
    const [user, setUser] = useState<User | null>(null);
    const { playPlaylist } = useMediaPlayer();

    useEffect(() => {
        api.getUserById(item.userId).then(setUser);
    }, [item.userId]);

    const handlePlayTrack = async () => {
        if (item.relatedId) {
            const track = await api.getTrackById(item.relatedId);
            if (track && track.trackUrl) {
                playPlaylist([track], 0);
            } else {
                alert("Track could not be played.");
            }
        }
    };

    if (!user) {
        return <div className="border border-[var(--border)] rounded-lg p-4 h-64 animate-pulse bg-[var(--surface-2)]" />;
    }

    const CardContent = () => {
        switch (item.type) {
            case 'new_mix':
                return item.relatedId ? <TrackPreview playlistId={item.relatedId} /> : <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />;
            case 'new_track':
                return (
                    <div className="relative group">
                        <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={handlePlayTrack} className="p-4 bg-lime-400/80 text-black rounded-full hover:bg-lime-400 scale-100 hover:scale-110 transition-transform">
                                <IconPlay size={32} className="fill-current" />
                            </button>
                        </div>
                    </div>
                );
            default:
                return item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null;
        }
    };

    return (
        <Link to={`/post/${item.id}`} className="block bg-[var(--surface-1)] rounded-lg overflow-hidden border border-[var(--border)]">
            <div className="p-4 flex items-center gap-3">
                <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                <div>
                    <p className="font-bold text-[var(--text-primary)] hover:underline">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.timestamp}</p>
                </div>
            </div>
            {item.description && (
                <div className="px-4 pb-4">
                    <p className="text-[var(--text-secondary)] whitespace-pre-line">{item.description}</p>
                </div>
            )}
            <CardContent />
        </Link>
    );
};


interface FeedCardProps {
  item: FeedItemType;
  onRepostSuccess: (newPost: FeedItemType) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onRepostSuccess }) => {
    const { user: currentUser } = useAuth();
    const { playPlaylist } = useMediaPlayer();
    
    // States for the main item (which could be a repost)
    const [author, setAuthor] = useState<User | null>(null);
    const [isLiked, setIsLiked] = useState(item.likedBy?.includes(currentUser?.id || '') || false);
    const [likeCount, setLikeCount] = useState(item.likes);
    const [isReposting, setIsReposting] = useState(false);
    
    // States for the nested original post if 'item' is a repost
    const [originalPost, setOriginalPost] = useState<FeedItemType | null>(null);

    useEffect(() => {
        api.getUserById(item.userId).then(setAuthor);
        if (item.repostOf) {
            api.getFeedItemById(item.repostOf).then(setOriginalPost);
        }
    }, [item]);

    const handleLike = async () => {
        if (!currentUser) return;
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
        await api.toggleLikePost(item.id, currentUser.id);
    };

    const handleRepost = async () => {
        if (!currentUser || isReposting) return;
        setIsReposting(true);
        const originalPostId = item.repostOf || item.id;
        const newPost = await api.repost(originalPostId, currentUser.id);
        if (newPost) {
            onRepostSuccess(newPost);
        }
        setIsReposting(false);
    };

    const handlePlayTrack = async () => {
        if (item.relatedId) {
            const track = await api.getTrackById(item.relatedId);
            if (track && track.trackUrl) {
                playPlaylist([track], 0);
            } else {
                alert("Track could not be played.");
            }
        }
    };
    
    if (!author) return <div className="bg-[var(--surface-1)] rounded-lg p-4 h-96 animate-pulse" />;

    if (item.repostOf) {
        if (!originalPost) return <div className="bg-[var(--surface-1)] rounded-lg p-4 h-96 animate-pulse" />;
        
        return (
            <div className="bg-[var(--surface-1)] rounded-lg overflow-hidden border border-[var(--border)] animate-pop-in">
                <div className="p-4 text-sm text-[var(--text-muted)]">
                    <IconRepeat size={14} className="inline-block mr-2" />
                    <Link to={`/profile/${author.id}`} className="font-bold hover:underline">{author.name}</Link> reposted
                </div>
                <div className="mx-4 mb-2">
                    <OriginalPostCard item={originalPost} />
                </div>
                 <div className="flex justify-around items-center p-2 text-[var(--text-secondary)] border-t border-[var(--border)]">
                    <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isLiked ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'}`}>
                      <IconHeart size={20} fill={isLiked ? 'currentColor' : 'none'} /> 
                      <span className="text-sm">{likeCount}</span>
                    </button>
                    <Link to={`/post/${item.id}`} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors">
                      <IconComment size={20} /> <span className="text-sm">{item.comments}</span>
                    </Link>
                    <button onClick={handleRepost} disabled={isReposting} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors disabled:opacity-50">
                      <IconRepeat size={20} /> <span className="text-sm">{item.reposts}</span>
                    </button>
                </div>
            </div>
        )
    }

    const CardContent = () => {
        switch (item.type) {
            case 'live_now': return <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />;
            case 'new_mix': return item.relatedId ? <TrackPreview playlistId={item.relatedId} /> : <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />;
            case 'new_track': return (
                <div className="relative group">
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={handlePlayTrack} className="p-4 bg-lime-400/80 text-black rounded-full hover:bg-lime-400 scale-100 hover:scale-110 transition-transform">
                            <IconPlay size={32} className="fill-current" />
                        </button>
                    </div>
                </div>
            );
            case 'new_review': return (
                <div className="p-4 bg-[var(--surface-2)]/50">
                    <div className="flex gap-1 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => <IconStar key={i} size={18} fill={i < (item.rating || 0) ? 'currentColor' : 'none'} />)}
                    </div>
                    <p className="text-[var(--text-secondary)] font-semibold italic">"{item.description}"</p>
                </div>
            )
            case 'gig_announcement': return (
                 <div className="relative">
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <h3 className="font-orbitron text-lg font-bold text-white">{item.title}</h3>
                        <p className="text-sm text-zinc-300">{item.description}</p>
                    </div>
                </div>
            );
            case 'user_post': return item.mediaUrl ? (
                item.mediaType === 'video' ? (
                    <video src={item.mediaUrl} controls muted loop className="w-full h-auto object-cover bg-black" />
                ) : (
                    <img src={item.mediaUrl} alt={item.title || 'User post'} className="w-full h-auto object-cover" />
                )
            ) : null;
            default: return item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null;
        }
    };
    
    return (
        <div className="bg-[var(--surface-1)] rounded-lg overflow-hidden border border-[var(--border)] animate-pop-in">
            <div className="p-4 flex items-center gap-3">
                <Link to={`/profile/${author.id}`}>
                    <Avatar src={author.avatarUrl} alt={author.name} size="md" />
                </Link>
                <div>
                    {(item.type === 'new_review' || item.type === 'new_connection' || item.type === 'live_now') ? (
                        <p className="text-[var(--text-primary)] leading-tight">{item.title}</p>
                    ) : (
                        <Link to={`/profile/${author.id}`} className="font-bold text-[var(--text-primary)] hover:underline">{author.name}</Link>
                    )}
                    <p className="text-xs text-[var(--text-secondary)]">{item.timestamp}</p>
                </div>
            </div>
            
            {(item.description) && (item.type !== 'new_review' && item.type !== 'gig_announcement') &&
                <div className="px-4 pb-4">
                    <p className={`text-[var(--text-secondary)] ${item.type === 'user_post' ? 'whitespace-pre-line' : ''}`}>{item.description}</p>
                </div>
            }
            
            <Link to={`/post/${item.id}`}><CardContent /></Link>

            <div className="flex justify-around items-center p-2 text-[var(--text-secondary)] border-t border-[var(--border)]">
                <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isLiked ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'}`}>
                    <IconHeart size={20} fill={isLiked ? 'currentColor' : 'none'} /> 
                    <span className="text-sm">{likeCount}</span>
                </button>
                <Link to={`/post/${item.id}`} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors">
                    <IconComment size={20} /> <span className="text-sm">{item.comments}</span>
                </Link>
                <button onClick={handleRepost} disabled={isReposting} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors disabled:opacity-50">
                    <IconRepeat size={20} /> <span className="text-sm">{item.reposts}</span>
                </button>
            </div>
        </div>
    );
};


export const Feed = () => {
    const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const { unreadCount, role } = useAuth();
    const canPost = role === Role.DJ || role === Role.Business;

    const fetchFeed = () => {
        setLoading(true);
        api.getFeedItems().then(items => {
            setFeedItems(items);
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchFeed();
        // Add event listener to refetch data when the window gains focus
        window.addEventListener('focus', fetchFeed);
        return () => {
            window.removeEventListener('focus', fetchFeed);
        };
    }, []);

    const handleNewRepost = (newPost: FeedItemType) => {
        setFeedItems(prevItems => [newPost, ...prevItems]);
    };

    return (
        <div className="text-[var(--text-primary)] min-h-full">
            <FeedHeader unreadCount={unreadCount} role={role} />
            {loading ? (
                <div className="pt-20">
                    <Spinner />
                </div>
            ) : (
                <div className="p-2 md:p-4 space-y-4 pb-20 max-w-xl mx-auto">
                    {feedItems.map(item => (
                        <FeedCard key={item.id} item={item} onRepostSuccess={handleNewRepost} />
                    ))}
                </div>
            )}
            {canPost && (
                <Link to="/create-post" title="Create a post" className="fixed bottom-20 md:bottom-10 right-4 bg-[var(--accent)] text-[var(--accent-text)] p-4 rounded-full shadow-lg shadow-lime-500/30 z-30 hover:bg-[var(--accent-hover)] transition-all transform hover:scale-110">
                    <IconPlus size={28} />
                </Link>
            )}
        </div>
    );
};