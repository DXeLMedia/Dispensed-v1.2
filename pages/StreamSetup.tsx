
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
             <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">Go Live</h1>
            </header>

            <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
                 <Avatar src={user.avatarUrl} alt={user.name} size="xl" className="mb-6 border-4 border-zinc-800" />
                 <h2 className="font-orbitron text-2xl font-bold text-white">Ready to Stream, {user.name}?</h2>
                 <p className="text-zinc-400 mt-2 mb-8">Give your stream a title to let everyone know what you're playing.</p>

                 <div className="w-full max-w-sm">
                    <label className="block text-sm font-medium text-zinc-300 mb-1 text-left">Stream Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Late Night Techno Session"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" 
                        required 
                    />
                </div>
            </div>

            <footer className="p-4 border-t border-zinc-800">
                 <button 
                    onClick={handleGoLive}
                    disabled={isLoading || !title.trim()} 
                    className="w-full p-4 bg-lime-400 text-black font-bold text-lg rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <IconRadio size={22} />}
                    {isLoading ? 'Starting Stream...' : 'Go Live Now'}
                </button>
            </footer>
        </div>
    );
};
