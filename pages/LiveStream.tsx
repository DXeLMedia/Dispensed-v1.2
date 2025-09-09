
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { StreamSession, DJ } from '../types';
import { PageSpinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconArrowLeft, IconConnections, IconHeart, IconShare } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { usePersistence } from '../hooks/usePersistence';

interface EmojiReaction {
  id: number;
  emoji: string;
  x: number;
}

export const LiveStream = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { showToast } = usePersistence();
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
            x: Math.random() * 90 + 5, // Random horizontal position from 5% to 95%
        };
        setReactions(prev => [...prev, newReaction]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 3000); // Remove reaction after 3 seconds
    };

    const handleEndStream = async () => {
        if (!sessionId) return;
        setIsEnding(true);
        try {
            await api.endStreamSession(sessionId);
            showToast("Stream has ended.", 'success');
            navigate('/feed');
        } catch (err: any) {
            showToast("Could not end stream. Please try again.", 'error');
            setIsEnding(false);
        }
    };


    if (loading) return <PageSpinner />;
    if (!session || !dj) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <h2 className="text-2xl font-bold">Stream Not Found</h2>
                <p className="text-zinc-400">This stream has ended or does not exist.</p>
                <button onClick={() => navigate('/feed')} className="mt-4 px-4 py-2 bg-lime-400 text-black font-bold rounded-lg">
                    Back to Feed
                </button>
            </div>
        );
    }
    
    const isOwnStream = currentUser?.id === dj.id;

    return (
        <div className="text-white h-full flex flex-col bg-black">
            {/* Visualizer/Video Placeholder */}
            <div className="relative flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <img src={dj.avatarUrl} alt="DJ" className="w-full h-full object-cover opacity-30 blur-md scale-110" />
                <p className="z-10 text-zinc-600 font-bold text-2xl">AUDIO VISUALIZER</p>

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                    <button onClick={() => navigate(-1)} className="p-2 bg-black/30 rounded-full"><IconArrowLeft size={22} /></button>
                    <div className="text-right">
                         <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
                            <span>LIVE</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full text-sm mt-2">
                            <IconConnections size={16} />
                            <span>{session.listenerCount}</span>
                        </div>
                    </div>
                </header>

                {/* Reactions */}
                 <div className="absolute bottom-20 left-0 right-0 h-40 pointer-events-none z-20">
                    {reactions.map(r => (
                        <span key={r.id} className="absolute text-3xl animate-float-up" style={{ left: `${r.x}%`, bottom: '0%' }}>
                            {r.emoji}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <footer className="absolute bottom-0 left-0 right-0 p-4 z-20">
                     <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                             <Avatar src={dj.avatarUrl} alt={dj.name} size="md" />
                             <div>
                                <h1 className="font-orbitron text-xl font-bold">{dj.name}</h1>
                                <p className="text-zinc-300 text-sm">{session.title}</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-3 bg-white/10 rounded-full hover:bg-white/20"><IconShare size={20}/></button>
                           {!isOwnStream && <button onClick={() => handleReaction('❤️')} className="p-3 bg-white/10 rounded-full hover:bg-white/20"><IconHeart size={20}/></button>}
                        </div>
                    </div>

                    {!isOwnStream && (
                         <div className="mt-4 flex justify-around items-center bg-black/30 p-2 rounded-full">
                            {['🔥', '🙌', '😎', '💯'].map(emoji => (
                                <button key={emoji} onClick={() => handleReaction(emoji)} className="text-2xl p-2 transform hover:scale-125 transition-transform">{emoji}</button>
                            ))}
                        </div>
                    )}
                    
                    {isOwnStream && (
                         <button onClick={handleEndStream} disabled={isEnding} className="w-full mt-4 p-3 bg-red-600 font-bold rounded-lg hover:bg-red-700 disabled:bg-zinc-700">
                             {isEnding ? 'Ending Stream...' : 'End Stream'}
                         </button>
                    )}
                </footer>
            </div>
        </div>
    );
};
