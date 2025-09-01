import React, { createContext, useState, useEffect, ReactNode, useCallback, useRef, useContext } from 'react';
import { Track } from '../types';

interface MediaPlayerContextType {
    currentTrack: Track | null;
    playlist: Track[];
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playPlaylist: (tracks: Track[], startIndex?: number) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    seek: (time: number) => void;
    closePlayer: () => void;
    setVolume: (volume: number) => void;
}

export const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

interface MediaPlayerProviderProps {
  children: ReactNode;
}

export const MediaPlayerProvider: React.FC<MediaPlayerProviderProps> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioRef = useRef<HTMLAudioElement>(null);
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => playNext();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlist, currentIndex]);

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);
    
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playPlaylist = useCallback((tracks: Track[], startIndex = 0) => {
        // Filter out any tracks that do not have a valid trackUrl.
        const playableTracks = tracks.filter(t => t && t.trackUrl);
    
        if (playableTracks.length === 0) {
            console.warn("Attempted to play a playlist with no playable tracks.", tracks);
            alert("Sorry, the selected media is not available for playback right now.");
            return;
        }
    
        // If the originally selected track is playable, find its new index.
        const originalStartTrack = tracks[startIndex];
        let newStartIndex = -1;
    
        if (originalStartTrack) {
            newStartIndex = playableTracks.findIndex(t => t.id === originalStartTrack.id);
        }
        
        // If the original track was unplayable or couldn't be found, default to the first playable track.
        if (newStartIndex === -1) {
            newStartIndex = 0;
        }
    
        setPlaylist(playableTracks);
        setCurrentIndex(newStartIndex);
        setCurrentTrack(playableTracks[newStartIndex]);
        setIsPlaying(true);
    }, []);

    const togglePlay = useCallback(() => {
        if (currentTrack) {
            setIsPlaying(prev => !prev);
        }
    }, [currentTrack]);

    const playNext = useCallback(() => {
        if (playlist.length > 0) {
            const nextIndex = (currentIndex + 1) % playlist.length;
            setCurrentIndex(nextIndex);
            setCurrentTrack(playlist[nextIndex]);
            setIsPlaying(true);
        }
    }, [playlist, currentIndex]);
    
    const playPrev = useCallback(() => {
        if (playlist.length > 0) {
            const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
            setCurrentIndex(prevIndex);
            setCurrentTrack(playlist[prevIndex]);
            setIsPlaying(true);
        }
    }, [playlist, currentIndex]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const closePlayer = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setIsPlaying(false);
        setCurrentTrack(null);
        setPlaylist([]);
        setCurrentIndex(0);
        setCurrentTime(0);
        setDuration(0);
    }, []);

    const value = {
        currentTrack,
        playlist,
        isPlaying,
        currentTime,
        duration,
        volume,
        playPlaylist,
        togglePlay,
        playNext,
        playPrev,
        seek,
        closePlayer,
        setVolume,
    };
    
    return (
        <MediaPlayerContext.Provider value={value}>
            {children}
            <audio ref={audioRef} src={currentTrack?.trackUrl} />
        </MediaPlayerContext.Provider>
    );
};

export const useMediaPlayer = () => {
    const context = useContext(MediaPlayerContext);
    if (context === undefined) {
        throw new Error('useMediaPlayer must be used within a MediaPlayerProvider');
    }
    return context;
};
