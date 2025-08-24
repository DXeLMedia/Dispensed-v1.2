import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { Track, Playlist } from '../types';
import { Spinner } from '../components/Spinner';
import { IconArrowLeft, IconMusic, IconList, IconPlus, IconGripVertical } from '../constants';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
            <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
            <h1 className="font-orbitron text-xl font-bold text-white">Media Manager</h1>
        </div>
    );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'tracks' | 'playlists') => void }) => (
    <div className="flex p-1 bg-zinc-800 rounded-lg mx-4 my-2">
        <button
            onClick={() => setActiveTab('tracks')}
            className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'tracks' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
        >
            <IconMusic size={16} /> Tracks
        </button>
        <button
            onClick={() => setActiveTab('playlists')}
            className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'playlists' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
        >
            <IconList size={16} /> Playlists
        </button>
    </div>
);

const TrackItem = ({ track }: { track: Track }) => (
    <div className="flex items-center gap-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
        <img src={track.artworkUrl} alt={track.title} className="w-12 h-12 rounded-md object-cover"/>
        <div className="flex-1">
            <p className="font-bold text-white">{track.title}</p>
            <p className="text-sm text-zinc-400">{track.duration}</p>
        </div>
    </div>
);

const PlaylistItem = ({ playlist }: { playlist: Playlist }) => (
     <div className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
        <IconGripVertical className="text-zinc-500 cursor-grab" />
        <img src={playlist.artworkUrl} alt={playlist.name} className="w-12 h-12 rounded-md object-cover"/>
        <div className="flex-1">
            <p className="font-bold text-white">{playlist.name}</p>
            <p className="text-sm text-zinc-400">{playlist.trackIds.length} tracks</p>
        </div>
    </div>
);


export const MediaManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setLoading(true);
        Promise.all([
            api.getTracksForDj(user.id),
            api.getPlaylistsForDj(user.id)
        ]).then(([trackData, playlistData]) => {
            setTracks(trackData);
            setPlaylists(playlistData);
            setLoading(false);
        });
    }, [user, navigate]);
    
    const handleUpload = () => {
        alert("Mock upload flow: A file picker would open here.");
    }

    if (!user) return null;

    return (
        <div className="text-white min-h-full">
            <Header />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? <div className="pt-20"><Spinner /></div> : (
                <div className="p-4 space-y-3 pb-24 relative">
                    {activeTab === 'tracks' && (
                        tracks.length > 0 ? tracks.map(t => <TrackItem key={t.id} track={t} />)
                        : <p className="text-center text-zinc-500 pt-10">No tracks uploaded.</p>
                    )}
                    {activeTab === 'playlists' && (
                        playlists.length > 0 ? playlists.map(p => <PlaylistItem key={p.id} playlist={p} />)
                        : <p className="text-center text-zinc-500 pt-10">No playlists created.</p>
                    )}

                     <button onClick={handleUpload} className="fixed bottom-20 right-4 bg-lime-400 text-black p-4 rounded-full shadow-lg shadow-lime-500/30 z-30">
                        <IconPlus size={28} />
                    </button>
                </div>
            )}
        </div>
    )
};