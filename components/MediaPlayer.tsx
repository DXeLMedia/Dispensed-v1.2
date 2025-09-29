import React, { useState, useEffect } from 'react';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';
import * as api from '../services/mockApi';
import { User } from '../types';
import { IconPlay, IconPause, IconSkipBack, IconSkipForward, IconX, IconVolume2, IconVolumeX } from '../constants';
import { Link } from 'react-router-dom';

const formatTime = (seconds: number) => {
  const flooredSeconds = Math.floor(seconds);
  const min = Math.floor(flooredSeconds / 60);
  const sec = flooredSeconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export const MediaPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrev,
    seek,
    closePlayer,
    volume,
    setVolume,
  } = useMediaPlayer();
  const [artist, setArtist] = useState<User | null>(null);

  useEffect(() => {
    if (currentTrack) {
      api.getUserById(currentTrack.artistId).then(setArtist);
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const VolumeIcon = volume === 0 ? IconVolumeX : IconVolume2;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-20 bg-[var(--surface-1)] border-t border-[var(--border)] flex items-center px-4 z-40 animate-pop-in">
        <div className="flex items-center gap-3 w-1/4 md:w-1/3 min-w-0">
            <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            <div className="overflow-hidden">
                <p className="font-bold text-[var(--text-primary)] truncate">{currentTrack.title}</p>
                {artist ? (
                     <Link to={`/profile/${artist.id}`} className="text-sm text-[var(--text-secondary)] hover:underline truncate block">{artist.name}</Link>
                ): (
                    <div className="h-4 w-24 bg-[var(--surface-2)] rounded animate-pulse mt-1"></div>
                )}
            </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-2">
            <div className="flex items-center gap-4">
                <button onClick={playPrev} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <IconSkipBack size={24} />
                </button>
                <button 
                    onClick={togglePlay} 
                    className="w-12 h-12 flex items-center justify-center bg-[var(--accent)] text-[var(--accent-text)] rounded-full hover:bg-[var(--accent-hover)] transition-colors transform hover:scale-105"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <IconPause size={28} className="fill-current" /> : <IconPlay size={28} className="fill-current ml-1" />}
                </button>
                <button onClick={playNext} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <IconSkipForward size={24} />
                </button>
            </div>
             <div className="w-full items-center gap-2 hidden md:flex mt-1">
                <span className="text-xs text-[var(--text-secondary)] w-10 text-center">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-[var(--surface-2)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-xs text-[var(--text-secondary)] w-10 text-center">{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex items-center justify-end gap-2 w-1/4 md:w-1/3">
            <div className="flex items-center gap-2">
                 <button onClick={() => setVolume(volume > 0 ? 0 : 1)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <VolumeIcon size={20} />
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-[var(--surface-2)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:rounded-full hidden md:block"
                    aria-label="Volume"
                />
            </div>

            <button onClick={closePlayer} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <IconX size={22} />
            </button>
        </div>
    </div>
  );
};