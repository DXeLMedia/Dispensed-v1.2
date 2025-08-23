

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { FeedItem } from '../types';
import { PageSpinner } from '../components/Spinner';
import { IconArrowLeft } from '../constants';

export const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<FeedItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) {
            setLoading(false);
            return;
        };
        const fetchPostData = async () => {
            setLoading(true);
            try {
                const postData = await api.getFeedItemById(postId);
                setItem(postData);
            } catch (error) {
                console.error("Error fetching post details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [postId]);

    if (loading) return <PageSpinner />;
    if (!item) return <div className="text-center p-8">Post not found.</div>;

    return (
        <div className="text-[var(--text-primary)] h-full flex flex-col">
            <header className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex items-center border-b border-[var(--border)]">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold">Post</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                 <div className="flex items-center mb-4">
                    <img src={item.user_avatar_url} alt={item.user_name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <p className="font-bold text-lg">{item.user_name}</p>
                        <p className="text-sm text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p>{item.text_content}</p>

                <div className="text-sm text-gray-500 mt-4 pt-4 border-t border-[var(--border)] flex space-x-6">
                    <span>Likes: {item.likes_count}</span>
                    <span>Comments: {item.comments_count}</span>
                    <span>Reposts: {item.reposts_count}</span>
                </div>

                {/* TODO: Implement comment fetching and display */}
                <hr className="my-4 border-[var(--border)]" />
                <h3 className="text-xl font-bold mb-2">Comments</h3>
                <div className="space-y-2">
                    <p className="text-[var(--text-secondary)]">Comment functionality is under construction.</p>
                </div>
            </main>
        </div>
    );
};