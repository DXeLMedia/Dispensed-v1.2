

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { IconArrowLeft, IconRadio } from '../constants';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { Role } from '../types';
import { usePersistence } from '../hooks/usePersistence';

export const StreamSetup = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = usePersistence();
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoLive = async () => {
        if (!title.trim() || !user) return;

        setIsLoading(true);
        try {
            // 1. Create the stream session in the backend
            const newSession = await api.createStreamSession(user.id, title);
            
            // 2. Create a feed item to announce the live stream
            await api.addFeedItem({
                type: 'live_now',
                userId: user.id,
                title: `${user.name} is LIVE!`,
                description: title,
                mediaUrl: user.avatarUrl,
                mediaType: 'image',
                relatedId: newSession.id,
            });

            // 3. Navigate to the live stream page
            navigate(`/stream/${newSession.id}`);

        } catch (error) {
            console.error("Failed to go live:", error);
            showToast("Could not start the stream. Please try again.", 'error');
            setIsLoading(false);
        }
    };

    if (!user || user.role !== Role.DJ) {
        navigate('/feed');
        return null;
    }

    return (
        <div className="text-white h-full flex flex-col bg-zinc-900">
             <header className="sticky top-0 z-20 bg-black p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white