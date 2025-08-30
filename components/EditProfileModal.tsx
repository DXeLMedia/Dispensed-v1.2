

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import * as gemini from '../services/geminiService';
import { DJ, Business, Role, UserProfile } from '../types';
import { IconX, IconInstagram, IconMusic, IconWebsite, IconPencil, IconSparkles } from '../constants';
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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New DJ specific fields
    const [experienceYears, setExperienceYears] = useState<string>('');
    const [hourlyRate, setHourlyRate] = useState<string>('');
    const [travelRadius, setTravelRadius] = useState<string>('');
    const [equipmentOwnedStr, setEquipmentOwnedStr] = useState<string>('');
    const [availabilitySchedule, setAvailabilitySchedule] = useState('');

    // AI Bio Gen
    const [keywordsForBio, setKeywordsForBio] = useState('');
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (profileData) {
            setName(profileData.name);
            setLocation(profileData.location);
            setInstagram(profileData.socials?.instagram || '');
            setWebsite(profileData.socials?.website || '');
            
            if (profileData.role === Role.DJ) {
                setBio(profileData.bio);
                setSoundcloud(profileData.socials?.soundcloud || '');
                setSelectedGenres(profileData.genres);
                setExperienceYears(String(profileData.experienceYears ?? ''));
                setHourlyRate(String(profileData.hourlyRate ?? ''));
                setTravelRadius(String(profileData.travelRadius ?? ''));
                setEquipmentOwnedStr((profileData.equipmentOwned || []).join(', '));
                setAvailabilitySchedule(profileData.availabilitySchedule || '');
            } else {
                setBio(profileData.description);
            }
            
            setAvatarPreview(null);
            setAvatarFile(null);
            setKeywordsForBio('');
        }
    }, [profileData, isOpen]);

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
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateBio = async () => {
        if (!profileData || profileData.role !== Role.DJ) return;
        setIsGeneratingBio(true);
        const generatedBio = await gemini.generateDjBio(
            name,
            selectedGenres,
            location,
            Number(experienceYears) || undefined,
            equipmentOwnedStr.split(',').map(s => s.trim()).filter(Boolean),
            keywordsForBio
        );
        setBio(generatedBio);
        setIsGeneratingBio(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!profileData) return;

            const parseNumeric = (val: string): number | null => {
                if (val.trim() === '') return null;
                const num = Number(val);
                return isNaN(num) ? null : num;
            };

            let uploadedAvatarUrl = profileData.avatarUrl;
            if (avatarFile) {
                uploadedAvatarUrl = await api.uploadFile('Avatars', avatarFile);
            }

            if (profileData.role === Role.DJ) {
                const updatedData: Partial<DJ> = {
                    name,
                    bio,
                    location,
                    genres: selectedGenres,
                    experienceYears: parseNumeric(experienceYears),
                    hourlyRate: parseNumeric(hourlyRate),
                    travelRadius: parseNumeric(travelRadius),
                    equipmentOwned: equipmentOwnedStr.split(',').map(s => s.trim()).filter(Boolean),
                    availabilitySchedule,
                    socials: {
                        instagram: instagram || undefined,
                        soundcloud: soundcloud || undefined,
                        website: website || undefined,
                    },
                    avatarUrl: uploadedAvatarUrl,
                };
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
                    avatarUrl: uploadedAvatarUrl,
                };
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
                        <div className="flex justify-between items-center mb-1">
                             <label className="block text-sm font-medium text-[var(--text-secondary)]">{profileData.role === Role.DJ ? 'Bio' : 'Description'}</label>
                             {profileData.role === Role.DJ && (
                                <button type="button" onClick={handleGenerateBio} disabled={isGeneratingBio} className="flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:text-[var(--text-muted)]">
                                    {isGeneratingBio ? <div className="w-4 h-4"><Spinner /></div> : <IconSparkles size={16} />}
                                    {isGeneratingBio ? 'Generating...' : 'Generate with AI'}
                                </button>
                             )}
                        </div>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" required></textarea>
                         {profileData.role === Role.DJ && (
                             <input type="text" value={keywordsForBio} onChange={e => setKeywordsForBio(e.target.value)} placeholder="Add keywords for AI bio (e.g., melodic, high-energy)" className="w-full mt-2 p-2 text-xs bg-[var(--surface-2)] border border-[var(--border)] rounded-lg" />
                         )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" required />
                    </div>
                     
                    {profileData.role === Role.DJ && (
                        <>
                             <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Experience (Yrs)</label>
                                    <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg"/>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Rate (R/hr)</label>
                                    <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Travel (km)</label>
                                    <input type="number" value={travelRadius} onChange={e => setTravelRadius(e.target.value)} className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg"/>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Equipment</label>
                                <input type="text" value={equipmentOwnedStr} onChange={e => setEquipmentOwnedStr(e.target.value)} placeholder="e.g., CDJ 3000, Technics SL-1200" className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg" />
                                <p className="text-xs text-[var(--text-muted)] mt-1">Separate items with a comma.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Availability</label>
                                <textarea
                                    value={availabilitySchedule}
                                    onChange={e => setAvailabilitySchedule(e.target.value)}
                                    placeholder="e.g., Weekends after 8pm, Available for last-minute bookings"
                                    rows={3}
                                    className="w-full p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                                />
                                <p className="text-xs text-[var(--text-muted)] mt-1">Describe your general availability.</p>
                            </div>
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
                        </>
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
