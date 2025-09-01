

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { FeedItem, EnrichedComment, User, Role } from '../types';
import { PageSpinner, Spinner } from '../components/Spinner';
import { IconArrowLeft, IconHeart, IconComment, IconRepeat, IconSend, IconStar } from '../constants';
import { Avatar } from '../components/Avatar';
import { CommentCard } from '../components/CommentCard';
import { TrackPreview } from '../components/TrackPreview';

// Re-creating a simplified post view to avoid importing the full FeedCard component
const PostContentView = ({ item, user }: { item: FeedItem, user: User }) => {
    const { user: currentUser } = useAuth();
    const [isLiked, setIsLiked] = useState(item.likedBy?.includes(currentUser?.id || '') || false);
    const [likeCount, setLikeCount] = useState(item.likes);
    const [repostCount, setRepostCount] = useState(item.reposts);
    const [isReposting, setIsReposting] = useState(false);

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
            setRepostCount(prev => prev + 1);
        } else {
            alert("You can't repost a repost.");
        }
        setIsReposting(false);
    };
    
     const CardContent = () => {
        switch (item.type) {
            case 'new_mix':
                return item.relatedId ? <TrackPreview playlistId={item.relatedId} /> : (item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null);
            case 'new_review':
                return (
                    <div className="p-4 bg-zinc-800/50">
                        <div className="flex gap-1 text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => <IconStar key={i} size={18} fill={i < (item.rating || 0) ? 'currentColor' : 'none'} />)}
                        </div>
                        {item.description && <p className="text-zinc-300 font-semibold italic">"{item.description}"</p>}
                    </div>
                )
            case 'user_post':
                 return item.mediaUrl ? (
                    item.mediaType === 'video' ? (
                        <video src={item.mediaUrl} controls muted loop className="w-full h-auto object-cover bg-black" />
                    ) : (
                        <img src={item.mediaUrl} alt={item.title || 'User post'} className="w-full h-auto object-cover" />
                    )
                ) : null;
            default:
                return item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-cover" /> : null;
        }
    }

    return (
        <div className="bg-zinc-900 border-b border-zinc-800">
            <div className="p-4 flex items-center gap-3">
                <Link to={`/profile/${user.id}`}>
                    <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                </Link>
                <div>
                    <Link to={`/profile/${user.id}`} className="font-bold text-white hover:underline">{user.name}</Link>
                    <p className="text-xs text-zinc-400">{item.timestamp}</p>
                </div>
            </div>

            {item.description && item.type !== 'new_review' && (
                <div className="px-4 pb-4">
                    <p className="text-zinc-300 whitespace-pre-line">{item.description}</p>
                </div>
            )}
            
            <CardContent />
            
            <div className="flex justify-around items-center p-2 text-zinc-400">
                <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isLiked ? 'text-lime-400' : 'hover:text-lime-400'}`}>
                    <IconHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{likeCount}</span>
                </button>
                <div className="flex items-center gap-2 p-2 rounded-md text-lime-400">
                    <IconComment size={20} />
                    <span className="text-sm">{item.comments}</span>
                </div>
                 <button onClick={handleRepost} disabled={isReposting} className="flex items-center gap-2 hover:text-lime-400 p-2 rounded-md transition-colors disabled:opacity-50">
                    <IconRepeat size={20} />
                    <span className="text-sm">{repostCount}</span>
                </button>
            </div>
        </div>
    );
}


export const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [post, setPost] = useState<FeedItem | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [comments, setComments] = useState<EnrichedComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchPostData = async () => {
        if (!postId) return;
        setLoading(true);
        const postData = await api.getFeedItemById(postId);
        if (postData) {
            setPost(postData);
            const [authorData, commentsData] = await Promise.all([
                api.getUserById(postData.userId),
                api.getCommentsForPost(postId)
            ]);
            setAuthor(authorData || null);
            setComments(commentsData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPostData();
    }, [postId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser || !postId) return;

        setIsSubmitting(true);
        const addedComment = await api.addCommentToPost(postId, currentUser.id, newComment.trim());
        if (addedComment) {
            setComments(prev => [...prev, addedComment]);
            setPost(prev => prev ? {...prev, comments: prev.comments + 1} : null);
            setNewComment('');
        }
        setIsSubmitting(false);
    };

    if (loading) return <PageSpinner />;
    if (!post || !author) {
        return <div className="text-center p-8 text-red-500">Post not found.</div>;
    }

    return (
        <div className="text-white h-full flex flex-col">
            <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">Post</h1>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                <PostContentView item={post} user={author} />
                <div className="p-2 space-y-1 pb-4">
                    {comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-2 bg-black border-t border-zinc-800">
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                    {currentUser && <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="sm" />}
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 text-white"
                        disabled={isSubmitting}
                    />
                    <button type="submit" className="bg-lime-400 text-black p-2.5 rounded-full disabled:bg-zinc-600 transition-colors" disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting ? <Spinner /> : <IconSend size={20} />}
                    </button>
                </form>
            </footer>
        </div>
    );
};