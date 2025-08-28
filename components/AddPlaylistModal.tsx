
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { IconX, IconPhoto } from '../constants';
import { Spinner } from './Spinner';

interface AddPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlaylistAdded: () => void;
}

export const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ isOpen, onClose, onPlaylistAdded }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [artworkFile, setArtworkFile] = useState<File | null>(null);
    const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
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
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !user) return;

        setIsSubmitting(true);
        try {
            let uploadedArtworkUrl = '';
            if (artworkFile) {
                uploadedArtworkUrl = await api.uploadFile('playlists', artworkFile);
            }

            await api.createPlaylist({
                creatorId: user.id,
                name: name.trim(),
                artworkUrl: uploadedArtworkUrl,
                trackIds: []
            });
            onPlaylistAdded();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to create playlist.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-zinc-900 border-2 border-lime-400 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-lime-500/20 animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-orbitron text-xl text-white">New Playlist</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><IconX size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Cover Art (Optional)</label>
                        <label htmlFor="artwork-upload-playlist" className="cursor-pointer aspect-square flex items-center justify-center bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 hover:border-lime-400">
                            {artworkPreview ? (
                                <img src={artworkPreview} alt="Artwork preview" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <div className="text-center">
                                    <IconPhoto size={32} className="text-zinc-500 mx-auto" />
                                    <p className="text-xs text-zinc-400 mt-1">Upload Cover</p>
                                </div>
                            )}
                        </label>
                        <input id="artwork-upload-playlist" type="file" className="hidden" accept="image/*" onChange={handleArtworkChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Playlist Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
                    </div>
                    <button type="submit" disabled={isSubmitting || !name.trim()} className="w-full p-3 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600">
                        {isSubmitting ? <Spinner /> : 'Create Playlist'}
                    </button>
                </form>
            </div>
        </div>
    );
};