
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { IconX, IconPhoto, IconFileMusic } from '../constants';
import { Spinner } from './Spinner';

interface AddTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTrackAdded: () => void;
}

export const AddTrackModal: React.FC<AddTrackModalProps> = ({ isOpen, onClose, onTrackAdded }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
    const [artworkFile, setArtworkFile] = useState<File | null>(null);
    const [trackFileName, setTrackFileName] = useState<string | null>(null);
    const [trackFile, setTrackFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setArtworkFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setArtworkPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleTrackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setTrackFile(file);
            // Auto-populate title from filename, removing extension.
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
            setTrackFileName(file.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !artworkFile || !trackFile || !user) {
            alert("Please provide a title and upload both artwork and a track file.");
            return;
        }
        setIsSubmitting(true);
        try {
            const [artworkUrl, trackUrl] = await Promise.all([
                api.uploadFile('artwork', artworkFile),
                api.uploadFile('tracks', trackFile)
            ]);
            
            await api.addTrack(
                user.id,
                title,
                artworkUrl,
                trackUrl
            );
            onTrackAdded(); // This will refetch the tracks in the parent component
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to add track. Please check the console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-zinc-900 border-2 border-lime-400 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-lime-500/20 animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-orbitron text-xl text-white">Upload New Track</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><IconX size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Track Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Cover Art</label>
                            <label htmlFor="artwork-upload" className="cursor-pointer aspect-square flex items-center justify-center bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 hover:border-lime-400">
                                {artworkPreview ? (
                                    <img src={artworkPreview} alt="Artwork preview" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <IconPhoto size={32} className="text-zinc-500" />
                                )}
                            </label>
                            <input id="artwork-upload" type="file" className="hidden" accept="image/*" onChange={handleArtworkChange} />
                        </div>
                        <div className="w-2/3">
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Track File (.mp3)</label>
                            <label htmlFor="track-upload" className="cursor-pointer h-full flex flex-col items-center justify-center bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 hover:border-lime-400 p-2">
                                <IconFileMusic size={32} className="text-zinc-500" />
                                <p className="text-xs text-zinc-400 mt-2 text-center break-all">{trackFileName || "Click to upload MP3"}</p>
                            </label>
                            <input id="track-upload" type="file" className="hidden" accept=".mp3,audio/mpeg" onChange={handleTrackFileChange} />
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full p-3 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600">
                        {isSubmitting ? <Spinner /> : 'Upload Track'}
                    </button>
                </form>
            </div>
        </div>
    );
};