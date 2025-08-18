import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { Track, Playlist } from '../types';
import { IconX, IconCheckCircle2 } from '../constants';
import { Spinner } from './Spinner';

interface AddToPlaylistModalProps {
    track: Track | null;
    onClose: () => void;
    onUpdate: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, onClose, onUpdate }) => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (track && user) {
            setLoading(true);
            api.getPlaylistsForDj(user.id).then(data => {
                setPlaylists(data);
                setLoading(false);
            });
        }
    }, [track, user]);

    if (!track || !user) return null;

    const handleTogglePlaylist = async (playlistId: string, isTrackInPlaylist: boolean) => {
        // For simplicity, this mock will only handle adding, not removing.
        if (isTrackInPlaylist) return;

        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        // Optimistic update
        const updatedPlaylists = playlists.map(p => 
            p.id === playlistId ? { ...p, trackIds: [...p.trackIds, track.id] } : p
        );
        setPlaylists(updatedPlaylists);

        await api.addTrackToPlaylist(playlistId, track.id);
        onUpdate(); // Notify parent to refetch data
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-zinc-900 border-2 border-lime-400 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-lime-500/20 animate-pop-in flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-orbitron text-xl text-white truncate">Add to Playlist</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><IconX size={20}/></button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    {loading ? <Spinner /> : (
                        <div className="space-y-2">
                            {playlists.map(playlist => {
                                const isTrackInPlaylist = playlist.trackIds.includes(track.id);
                                return (
                                    <button 
                                        key={playlist.id}
                                        onClick={() => handleTogglePlaylist(playlist.id, isTrackInPlaylist)}
                                        disabled={isTrackInPlaylist}
                                        className="w-full flex items-center gap-3 p-2 bg-zinc-800 rounded-lg transition-colors disabled:opacity-70 enabled:hover:bg-zinc-700"
                                    >
                                        <img src={playlist.artworkUrl} alt={playlist.name} className="w-10 h-10 object-cover rounded-md"/>
                                        <span className="flex-1 text-left text-white font-semibold truncate">{playlist.name}</span>
                                        {isTrackInPlaylist && <IconCheckCircle2 size={20} className="text-lime-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                 <div className="mt-4 flex-shrink-0">
                    <button onClick={onClose} className="w-full p-3 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
