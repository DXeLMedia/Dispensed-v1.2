import React, { useState, useEffect } from 'react';
import * as api from '../services/mockApi';
import { Playlist, Track } from '../types';
import { Spinner } from './Spinner';
import { IconChevronLeft, IconChevronRight, IconPlay, IconMusic } from '../constants';

interface TrackPreviewProps {
    playlistId: string;
}

export const TrackPreview: React.FC<TrackPreviewProps> = ({ playlistId }) => {
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            setLoading(true);
            const pl = await api.getPlaylistById(playlistId);
            if (pl) {
                setPlaylist(pl);
                const trackData = await api.getTracksByIds(pl.trackIds);
                setTracks(trackData);
            }
            setLoading(false);
        };
        fetchPlaylistData();
    }, [playlistId]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    };

    const handlePlay = (track: Track) => {
        alert(`Playing ${track.title}`);
    };

    if (loading) {
        return <div className="aspect-square flex items-center justify-center bg-zinc-800"><Spinner /></div>;
    }

    if (!playlist || tracks.length === 0) {
        return (
            <div className="aspect-square flex flex-col items-center justify-center bg-zinc-800 text-zinc-400">
                <IconMusic size={48} />
                <p>Could not load mix</p>
            </div>
        );
    }

    const currentTrack = tracks[currentIndex];

    return (
        <div className="aspect-square relative w-full overflow-hidden group">
            <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-bold text-white text-lg">{currentTrack.title}</h3>
                <p className="text-sm text-zinc-300">{playlist.name}</p>
            </div>

            {/* Controls */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handlePrev}
                    className="p-3 bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                    <IconChevronLeft size={24} />
                </button>
                <button
                    onClick={() => handlePlay(currentTrack)}
                    className="p-4 bg-lime-400/80 text-black rounded-full hover:bg-lime-400 scale-100 hover:scale-110 transition-transform"
                >
                    <IconPlay size={32} className="fill-current" />
                </button>
                <button
                    onClick={handleNext}
                    className="p-3 bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                    <IconChevronRight size={24} />
                </button>
            </div>
            
             {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {tracks.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentIndex === index ? 'w-4 bg-lime-400' : 'w-1.5 bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
