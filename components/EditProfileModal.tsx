
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { DJ, Business, Role } from '../types';
import { IconX, IconInstagram, IconMusic, IconWebsite, IconPencil } from '../constants';
import { Spinner } from './Spinner';
import { Avatar } from './Avatar';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdated: () => void;
    profileData: DJ | Business | null;
}

const availableGenres = ['Deep House', 'Techno', 'Afro House', 'Soulful House', 'Minimal', 'Dub-Techno', 'Deep-Tech', 'Melodic House', 'Progressive House', 'Lo-fi House', 'Industrial', 'EBM', '90s House', 'Jazz', 'Breaks', 'Hard Techno'];


export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onProfileUpdated, profileData }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [instagram, setInstagram] = useState('');
    const [soundcloud, setSoundcloud] = useState('');
    const [website, setWebsite] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (profileData) {
            setName(profileData.name);
            setBio(profileData.role === Role.Business ? profileData.description : profileData.bio);
            setLocation(profileData.location);
            setInstagram(profileData.socials?.instagram || '');
            setSoundcloud(profileData.role === Role.DJ ? profileData.socials?.soundcloud || '' : '');
            setWebsite(profileData.socials?.website || '');
            if (profileData.role === Role.DJ) {
                setSelectedGenres(profileData.genres);
            }
            setAvatarPreview(null);
        }
    }, [profileData]);

    if (!isOpen || !profileData) return null;
    
    const handleGenreToggle = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!profileData) return;

            if (profileData.role === Role.DJ) {
                const updatedData: Partial<DJ> = {
                    name,
                    bio,
                    location,
                    genres: selectedGenres,
                    socials: {
                        instagram: instagram || undefined,
                        soundcloud: soundcloud || undefined,
                        website: website || undefined,
                    },
                };
                 if (avatarPreview) updatedData.avatarUrl = avatarPreview;
                await api.updateUserProfile(profileData.id, updatedData);
            } else { // Role.Business
                const updatedData: Partial<Business> = {
                    name: name,
                    description: bio,
                    location,
                    socials: {
                        instagram: instagram || undefined,
                        website: website || undefined,
                    },
                };
                if (avatarPreview) updatedData.avatarUrl = avatarPreview;
                await api.updateUserProfile(profileData.id, updatedData);
            }

            onProfileUpdated();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--surface-1)] border-2 border-[var(--accent)] rounded-lg p-6 max-w-md w-full shadow-2xl shadow-[var(--accent)]/20 animate-pop-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-orbitron text-xl text-[var(--text-primary)]">Edit Profile</h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><IconX size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 -mr-2">
                    <div className="relative w-32 h-32 mx-auto">
                        <Avatar src={avatarPreview || profileData.avatarUrl} alt="Profile Avatar" size="xl" className="border-4 border-[var(--surface-2)]" />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-[var(--accent)] text-[var(--accent-text)] p-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
                            aria-label="Change profile picture"
                        >
                            <IconPencil size={16} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{profileData.role === Role.DJ ? 'Bio' : 'Description'}</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" required></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" required />
                    </div>
                     
                    {profileData.role === Role.DJ && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Genres</label>
                            <div className="flex flex-wrap gap-2">
                                {availableGenres.map(genre => {
                                    const isSelected = selectedGenres.includes(genre);
                                    return (
                                        <button
                                            type="button"
                                            key={genre}
                                            onClick={() => handleGenreToggle(genre)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                                isSelected
                                                    ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                                                    : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                                            }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-orbitron text-lg text-[var(--text-primary)] mb-2">Social Links</h3>
                        <div className="space-y-3">
                             <div className="relative">
                                <IconInstagram size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="Instagram username" className="w-full p-3 pl-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                            </div>
                            {profileData.role === Role.DJ && (
                                <div className="relative">
                                    <IconMusic size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                                    <input type="text" value={soundcloud} onChange={e => setSoundcloud(e.target.value)} placeholder="SoundCloud username" className="w-full p-3 pl-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                                </div>
                            )}
                            <div className="relative">
                                <IconWebsite size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="yourwebsite.com" className="w-full p-3 pl-10 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-2 flex-shrink-0">
                        <button type="submit" disabled={isSubmitting} className="w-full p-3 bg-[var(--accent)] text-[var(--accent-text)] font-bold rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:bg-[var(--surface-2)] disabled:cursor-not-allowed">
                            {isSubmitting ? <Spinner /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};