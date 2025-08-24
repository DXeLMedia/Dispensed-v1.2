

import React, { useEffect, useState } from 'react';
import { FeedItem } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// TODO: Create a proper FeedCard component to render different feed item types.
export const Feed = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await api.getFeedItems();
                setFeedItems(data);
            } catch (error) {
                console.error("Error fetching feed items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const renderFeedItemContent = (item: FeedItem) => {
        // This is a simplified renderer. A dedicated component would be better.
        return (
            <div>
                <div className="flex items-center mb-2">
                    <img src={item.user_avatar_url} alt={item.user_name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-bold">{item.user_name}</p>
                        <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <p className="font-semibold">{item.title}</p>
                <p>{item.text_content}</p>
                <div className="text-xs text-gray-500 mt-2 flex space-x-4">
                    <span>Likes: {item.likes_count}</span>
                    <span>Comments: {item.comments_count}</span>
                    <span>Reposts: {item.reposts_count}</span>
                </div>
            </div>
        );
    }


    return (
        <div className="text-[var(--text-primary)] min-h-full">
             <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex items-center border-b border-[var(--border)]">
                <h1 className="font-orbitron text-xl font-bold">Feed</h1>
            </div>
            {loading ? (
                <div className="pt-20"><Spinner /></div>
            ) : (
                <div className="p-2 md:p-4 space-y-4 pb-20 max-w-xl mx-auto">
                    {feedItems.map(item => (
                        <div key={item.id} className="bg-[var(--surface-1)] p-4 rounded-lg border border-[var(--border)]">
                            {renderFeedItemContent(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};