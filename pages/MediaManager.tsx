



import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/mockApi';
import { Track, Playlist } from '../types';
import { Spinner } from '../components/Spinner';
import { IconArrowLeft, IconMusic, IconList, IconPlus, IconPlay, IconPlusCircle, IconPencil, IconTrash } from '../constants';
import { AddTrackModal } from '../components/AddTrackModal';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';
import { AddPlaylistModal } from '../components/AddPlaylistModal';
import { AddToPlaylistModal } from '../components/AddToPlaylistModal';
import { EditPlaylistModal } from '../components/EditPlaylistModal';

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

// FIX: Changed component to use React.FC and a props interface to fix TypeScript error with `key` prop.
interface TrackItemProps {
  track: Track;
  onPlay: () => void;
  onAddToPlaylist: () => void;
  onDelete: () => void;
}
const TrackItem: React.FC<TrackItemProps> = ({ track, onPlay, onAddToPlaylist, onDelete }) => (
    <div className="w-full flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-lime-400/50">
        <button onClick={onPlay} className="flex items-center gap-4 flex-1 text-left">
            <img src={track.artworkUrl} alt={track.title} className="w-12 h-12 rounded-md object-cover"/>
            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-white truncate">{track.title}</p>
                <p className="text-sm text-zinc-400">{track.duration}</p>
            </div>
        </button>
         <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onAddToPlaylist} title="Add to Playlist" className="p-2 text-zinc-400 hover:text-white">
                <IconPlusCircle size={22} />
            </button>
             <button onClick={onDelete} title="Delete Track" className="p-2 text-zinc-400 hover:text-red-500">
                <IconTrash size={20} />
            </button>
        </div>
    </div>
);

// FIX: Changed component to use React.FC and a props interface to fix TypeScript error with `key` prop.
interface PlaylistItemProps {
  playlist: Playlist;
  onPlay: () => void;
  onEdit: () => void;
}
const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, onPlay, onEdit }) => (
    <div className="w-full flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-lime-400/50">
        <button onClick={onPlay} className="flex items-center gap-4 flex-1 text-left">
            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img src={playlist.artworkUrl} alt={playlist.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <IconPlay size={24} className="text-white fill-current" />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-white truncate">{playlist.name}</p>
                <p className="text-sm text-zinc-400">{playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'track' : 'tracks'}</p>
            </div>
        </button>
         <button onClick={onEdit} title="Edit Playlist" className="p-2 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <IconPencil size={20} />
        </button>
    </div>
);


export const MediaManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    const { playPlaylist } = useMediaPlayer();

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        const [trackData, playlistData] = await Promise.all([
            api.getTracksForDj(user.id),
            api.getPlaylistsForDj(user.id)
        ]);

        const enrichedPlaylists = playlistData.map(p => {
            if (!p.artworkUrl && p.trackIds.length > 0) {
                const firstTrack = trackData.find(t => t.id === p.trackIds[0]);
                return { ...p, artworkUrl: firstTrack?.artworkUrl || `https://source.unsplash.com/200x200/?music&sig=${p.id}` };
            }
            if (!p.artworkUrl) {
                return { ...p, artworkUrl: `https://source.unsplash.com/200x200/?music,abstract&sig=${p.id}` };
            }
            return p;
        });

        setTracks(trackData);
        setPlaylists(enrichedPlaylists);
        setLoading(false);
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]);

    const handlePlayTrack = (startIndex: number) => {
        playPlaylist(tracks, startIndex);
    };

    const handlePlayPlaylist = (playlist: Playlist) => {
        if (playlist.trackIds.length > 0) {
            api.getTracksByIds(playlist.trackIds).then(tracks => {
                if (tracks.length > 0) {
                    playPlaylist(tracks, 0);
                } else {
                    alert("Could not load tracks for this playlist.");
                }
            });
        } else {
            alert("This playlist is empty.");
        }
    };

    const handleAddClick = () => {
        if (activeTab === 'tracks') {
            setIsTrackModalOpen(true);
        } else {
            setIsPlaylistModalOpen(true);
        }
    };

    const handleEditPlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
        setIsEditPlaylistModalOpen(true);
    };

    const handleDeleteTrack = async (trackToDelete: Track) => {
        if (!user) return;
        if (window.confirm(`Are you sure you want to delete "${trackToDelete.title}"? This action cannot be undone.`)) {
            const success = await api.deleteTrack(user.id, trackToDelete.id);
            if (success) {
                fetchData(); // Refresh data
            } else {
                alert("Failed to delete track. Please try again.");
            }
        }
    };
    
    if (!user) return null;

    return (
        <div className="text-white min-h-full">
            <Header />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? <div className="pt-20"><Spinner /></div> : (
                <div className="p-4 space-y-3 pb-24 relative">
                    {activeTab === 'tracks' && (
                        tracks.length > 0 ? tracks.map((t, index) => 
                            <TrackItem
                                key={t.id}
                                track={t}
                                onPlay={() => handlePlayTrack(index)}
                                onAddToPlaylist={() => setSelectedTrack(t)}
                                onDelete={() => handleDeleteTrack(t)}
                            />
                        )
                        : <p className="text-center text-zinc-500 pt-10">No tracks uploaded.</p>
                    )}
                    {activeTab === 'playlists' && (
                        playlists.length > 0 ? playlists.map(p => <PlaylistItem key={p.id} playlist={p} onPlay={() => handlePlayPlaylist(p)} onEdit={() => handleEditPlaylistClick(p)} />)
                        : <p className="text-center text-zinc-500 pt-10">No playlists created.</p>
                    )}

                     <button onClick={handleAddClick} title="Add new media" className="absolute bottom-6 right-6 bg-lime-400 text-black p-4 rounded-full shadow-lg shadow-lime-500/30 z-30 hover:bg-lime-300 transition-all transform hover:scale-110">
                        <IconPlus size={28} />
                    </button>
                </div>
            )}
            <AddTrackModal
                isOpen={isTrackModalOpen}
                onClose={() => setIsTrackModalOpen(false)}
                onTrackAdded={fetchData}
            />
             <AddPlaylistModal
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                onPlaylistAdded={fetchData}
            />
            <AddToPlaylistModal
                track={selectedTrack}
                onClose={() => setSelectedTrack(null)}
                onUpdate={fetchData}
            />
            <EditPlaylistModal
                isOpen={isEditPlaylistModalOpen}
                onClose={() => setIsEditPlaylistModalOpen(false)}
                onPlaylistUpdated={fetchData}
                playlist={selectedPlaylist}
            />
        </div>
    )
};