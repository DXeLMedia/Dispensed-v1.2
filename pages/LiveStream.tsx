import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { StreamSession, DJ } from '../types';
import { PageSpinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconArrowLeft, IconConnections, IconHeart, IconShare } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface EmojiReaction {
  id: number;
  emoji: string;
  x: number;
}

export const LiveStream = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [session, setSession] = useState<StreamSession | null>(null);
    const [dj, setDj] = useState<DJ | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnding, setIsEnding] = useState(false);
    const [reactions, setReactions] = useState<EmojiReaction[]>([]);
    let reactionIdCounter = 0;

    useEffect(() => {
        if (!sessionId) {
            navigate('/feed');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const sessionData = await api.getStreamSessionById(sessionId);
            if (sessionData && sessionData.isLive) {
                setSession(sessionData);
                const djData = await api.getDJById(sessionData.djId);
                setDj(djData || null);
            } else {
                setSession(null);
                setDj(null);
            }
            setLoading(false);
        };

        fetchData();
    }, [sessionId, navigate]);

    // Simulate listener count changes
    useEffect(() => {
        if (session) {
            const interval = setInterval(() => {
                setSession(prevSession => {
                    if (!prevSession) return null;
                    const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
                    return { ...prevSession, listenerCount: Math.max(0, prevSession.listenerCount + change) };
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [session]);

    const handleReaction = (emoji: string) => {
        const newReaction: EmojiReaction = {
            id: reactionIdCounter++,
            emoji,
            x: Math.random() * 80 + 10, // Horizontal position (10% to 90%)
        };
        setReactions(prev => [...prev, newReaction]);

        // Remove the reaction from the DOM after animation
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 3000);
    };
    
    const handleEndStream = async () => {
        if (!sessionId) return;
        setIsEnding(true);
        try {
            await api.endStreamSession(sessionId);
            navigate('/feed');
        } catch (error) {
            console.error("Failed to end stream:", error);
            alert("Could not end the stream. Please try again.");
        } finally {
            setIsEnding(false);
        }
    };

    if (loading) return <PageSpinner />;
    if (!session || !dj) {
        return (
            <div className="text-white min-h-full flex flex-col items-center justify-center">
                <p className="text-red-500">Live stream not found or has ended.</p>
                <button onClick={() => navigate('/feed')} className="mt-4 text-lime-400">Back to Feed</button>
            </div>
        );
    }
    
    const emojiChoices = ['🔥', '❤️', '🤯', '🙌', '💯'];
    const isOwnStream = currentUser?.id === dj.id;

    return (
        <div className="text-white h-full flex flex-col bg-zinc-900 relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                <button onClick={() => navigate(-1)} className="bg-black/30 p-2 rounded-full"><IconArrowLeft size={22} /></button>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full animate-pulse">
                    <IconConnections size={16} className="text-lime-300" />
                    <span className="font-bold text-white">{session.listenerCount.toLocaleString()}</span>
                </div>
                 {isOwnStream ? (
                    <button onClick={handleEndStream} disabled={isEnding} className="bg-red-600/80 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-red-500 transition-colors disabled:bg-zinc-600 w-28 text-center">
                        {isEnding ? 'Ending...' : 'End Stream'}
                    </button>
                 ) : (
                    <button onClick={() => alert('Sharing stream!')} className="bg-black/30 p-2 rounded-full"><IconShare size={22} /></button>
                 )}
            </header>

            {/* Reaction Canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {reactions.map(r => (
                    <div
                        key={r.id}
                        className="absolute bottom-20 text-3xl animate-float-up"
                        style={{ left: `${r.x}%` }}
                    >
                        {r.emoji}
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 bg-lime-400/10 rounded-full visualizer-pulse"></div>
                    </div>
                    <Avatar src={dj.avatarUrl} alt={dj.name} size="xl" className="border-4 border-black" />
                </div>
                <h1 className="font-orbitron text-2xl font-bold text-white">{dj.name}</h1>
                <p className="text-zinc-300 mt-1">{session.title}</p>
                <div className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md font-bold text-sm tracking-widest animate-pulse">
                    LIVE
                </div>
            </div>

            {/* Footer Controls */}
            <footer className="z-20 p-4 flex justify-center items-center gap-3 bg-gradient-to-t from-black/70 to-transparent">
                {emojiChoices.map(emoji => (
                     <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="p-3 bg-white/10 rounded-full text-2xl hover:bg-white/20 hover:scale-110 transition-transform duration-200 backdrop-blur-sm"
                    >
                        {emoji}
                    </button>
                ))}
            </footer>
        </div>
    );
};