import React, { useState, useEffect } from 'react';
import * as api from '../services/mockApi';
import { Track, User } from '../types';
import { Spinner } from './Spinner';
import { IconPlay, IconPause } from '../constants';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';
import { Link } from 'react-router-dom';

interface TrackCardProps {
    trackId: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({ trackId }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [artist, setArtist] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    const { 
        currentTrack, 
        isPlaying, 
        playPlaylist, 
        togglePlay,
        currentTime,
        duration,
        seek,
    } = useMediaPlayer();

    useEffect(() => {
        const fetchTrackData = async () => {
            setLoading(true);
            const trackData = await api.getTrackById(trackId);
            if (trackData) {
                setTrack(trackData);
                const artistData = await api.getUserById(trackData.artistId);
                setArtist(artistData || null);
            }
            setLoading(false);
        };
        fetchTrackData();
    }, [trackId]);

    const isCurrentTrack = currentTrack?.id === track?.id;
    const isPlayingNow = isCurrentTrack && isPlaying;
    const progress = (isCurrentTrack && duration > 0) ? (currentTime / duration) * 100 : 0;

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isCurrentTrack) {
            togglePlay();
        } else if (track) {
            playPlaylist([track], 0);
        }
    };
    
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCurrentTrack || duration === 0) return;
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const newTime = (clickPosition / progressBar.offsetWidth) * duration;
        seek(newTime);
    }

    if (loading) {
        return <div className="aspect-video flex items-center justify-center bg-[var(--surface-2)] rounded-lg"><Spinner /></div>;
    }
    
    if (!track) {
        return <div className="aspect-video flex items-center justify-center bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)]">Track not available</div>;
    }

    return (
        <div className="relative aspect-video bg-[var(--surface-2)] rounded-lg overflow-hidden group">
            <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <button 
                    onClick={handlePlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-[var(--accent)] hover:text-[var(--accent-text)] transition-colors"
                    aria-label={isPlayingNow ? "Pause" : "Play"}
                >
                    {isPlayingNow ? <IconPause size={24} /> : <IconPlay size={24} className="ml-1" />}
                </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-orbitron text-lg font-bold text-white truncate">{track.title}</h3>
                {artist && (
                     <Link to={`/profile/${artist.id}`} onClick={(e) => e.stopPropagation()} className="text-sm text-[var(--text-secondary)] hover:underline truncate block">{artist.name}</Link>
                )}
                {isCurrentTrack && (
                    <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full cursor-pointer" onClick={handleSeek}>
                        <div 
                            className="bg-[var(--accent)] h-full rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
