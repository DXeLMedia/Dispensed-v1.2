

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
import { TrackCard } from '../components/TrackCard';


const FeedHeader = ({ unreadCount, role }: { unreadCount: number; role: Role | null }) => (
  <div className="sticky top-0 z-20 bg-[var(--background)]">
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

    useEffect(() => {
        api.getUserById(item.userId).then(setUser);
    }, [item.userId]);

    if (!user) {
        return <div className="border border-[var(--border)] rounded-lg p-4 h-64 animate-pulse bg-[var(--surface-2)]" />;
    }

    const CardContent = () => {
        switch (item.type) {
            case 'new_mix':
                return item.relatedId ? <TrackPreview playlistId={item.relatedId} /> : <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" />;
            case 'new_track':
                return item.relatedId ? <TrackCard trackId={item.relatedId} /> : (item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null);
            default:
                return item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null;
        }
    };

    return (
        <Link to={`/post/${item.id}`} className="block bg-[var(--surface-1)] rounded-lg overflow-hidden border border-[var(--border)]">
            <div className="p-4 flex items-center gap-3">
                <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                <div>
                    <p className="font-bold text-sm text-[var(--text-primary)] hover:underline">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.timestamp}</p>
                </div>
            </div>
            {item.description && (
                <div className="px-4 pb-4">
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">{item.description}</p>
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
        } else {
            setOriginalPost(null);
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
        } else {
            alert("You can't repost a repost.");
        }
        setIsReposting(false);
    };
    
    if (!author) return <div className="bg-[var(--surface-1)] rounded-lg p-4 h-96 animate-pulse" />;

    const renderCardActions = (postToGetRepostCountFrom: FeedItemType) => (
        <div className="flex justify-around items-center p-2 text-[var(--text-secondary)] border-t border-[var(--border)]">
            <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isLiked ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'}`}>
                <IconHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-sm">{likeCount}</span>
            </button>
            <Link to={`/post/${item.id}`} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors">
                <IconComment size={20} />
                <span className="text-sm">{item.comments}</span>
            </Link>
             <button onClick={handleRepost} disabled={isReposting} className="flex items-center gap-2 hover:text-[var(--accent)] p-2 rounded-md transition-colors disabled:opacity-50">
                <IconRepeat size={20} />
                <span className="text-sm">{postToGetRepostCountFrom.reposts}</span>
            </button>
        </div>
    );

    const CardContent = () => {
        const postToRender = originalPost || item;
        switch (postToRender.type) {
            case 'new_mix':
                return postToRender.relatedId ? <TrackPreview playlistId={postToRender.relatedId} /> : (postToRender.mediaUrl ? <img src={postToRender.mediaUrl} alt={postToRender.title} className="w-full h-auto object-cover" /> : null);
            case 'new_track':
                return postToRender.relatedId ? <TrackCard trackId={postToRender.relatedId} /> : (postToRender.mediaUrl ? <img src={postToRender.mediaUrl} alt={postToRender.title} className="w-full h-auto object-cover" /> : null);
            case 'new_review':
                return (
                     <div className="p-4 bg-[var(--surface-2)]">
                        <Link to={`/post/${postToRender.id}`} className="block">
                            <div className="flex gap-1 text-yellow-400 mb-2">
                                {[...Array(5)].map((_, i) => <IconStar key={i} size={18} fill={i < (postToRender.rating || 0) ? 'currentColor' : 'none'} />)}
                            </div>
                             <p className="font-bold text-[var(--text-primary)]">{postToRender.title}</p>
                            {postToRender.description && <p className="text-[var(--text-secondary)] font-semibold italic mt-1">"{postToRender.description}"</p>}
                        </Link>
                    </div>
                )
             case 'user_post':
                 return postToRender.mediaUrl ? (
                    <Link to={`/post/${postToRender.id}`}>
                        {postToRender.mediaType === 'video' ? (
                            <video src={postToRender.mediaUrl} muted loop playsInline className="w-full h-auto object-cover bg-black" />
                        ) : (
                            <img src={postToRender.mediaUrl} alt={postToRender.title || 'User post'} className="w-full h-auto object-cover" />
                        )}
                    </Link>
                ) : null;
            default:
                return postToRender.mediaUrl ? <Link to={`/post/${postToRender.id}`}><img src={postToRender.mediaUrl} alt={postToRender.title} className="w-full h-auto object-cover" /></Link> : null;
        }
    }
    
    const postToRenderDetailsFor = originalPost || item;

    return (
        <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] animate-pop-in">
            {item.repostOf && (
                <div className="px-4 pt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <IconRepeat size={16} />
                    <Link to={`/profile/${author.id}`} className="font-bold hover:underline">{author.name}</Link> reposted
                </div>
            )}

            {!originalPost && (
                <Link to={`/profile/${author.id}`} className="flex items-center gap-3 p-4">
                    <Avatar src={author.avatarUrl} alt={author.name} size="md" />
                    <div>
                        <p className="font-bold text-[var(--text-primary)] hover:underline">{author.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{item.timestamp}</p>
                    </div>
                </Link>
            )}

            {postToRenderDetailsFor.description && (
                <div className="px-4 pb-4">
                    <Link to={`/post/${postToRenderDetailsFor.id}`} className="block">
                        <p className="text-[var(--text-secondary)] whitespace-pre-line">{postToRenderDetailsFor.description}</p>
                    </Link>
                </div>
            )}
            
            {originalPost && <OriginalPostCard item={originalPost} />}

            {!originalPost && <CardContent />}
            
            {renderCardActions(postToRenderDetailsFor)}
        </div>
    );
};


export const Feed = () => {
    const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const { unreadCount, role } = useAuth();
    
    useEffect(() => {
        setLoading(true);
        api.getFeedItems().then(data => {
            setFeedItems(data);
            setLoading(false);
        });
    }, []);
    
    const handleRepostSuccess = (newPost: FeedItemType) => {
        setFeedItems(prev => [newPost, ...prev]);
    };

    return (
        <div className="text-[var(--text-primary)] min-h-full">
            <FeedHeader unreadCount={unreadCount} role={role} />
            {loading ? (
                <div className="pt-20">
                    <Spinner />
                </div>
            ) : (
                <div className="p-2 grid grid-cols-1 md:grid-cols-1 gap-3 pb-24">
                    <Link to="/create-post" className="block p-4 bg-[var(--surface-1)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent)] transition-colors text-center">
                        Create a new post...
                    </Link>
                    {feedItems.map(item => <FeedCard key={item.id} item={item} onRepostSuccess={handleRepostSuccess} />)}
                </div>
            )}
        </div>
    );
};