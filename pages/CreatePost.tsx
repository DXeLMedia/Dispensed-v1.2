

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { IconArrowLeft, IconPaperclip, IconX } from '../constants';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { User } from '../types';

export const CreatePost = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // State for user tagging
    const [isTagging, setIsTagging] = useState(false);
    const [tagQuery, setTagQuery] = useState<string | null>(null);
    const [tagResults, setTagResults] = useState<User[]>([]);
    const [tagLoading, setTagLoading] = useState(false);

    useEffect(() => {
        if (tagQuery === null) {
            setTagResults([]);
            return;
        }

        const handler = setTimeout(() => {
            if (tagQuery.length > 0) {
                setTagLoading(true);
                api.searchUsers(tagQuery).then(results => {
                    setTagResults(results);
                    setTagLoading(false);
                });
            } else {
                setTagResults([]);
            }
        }, 300); // Debounce API calls

        return () => {
            clearTimeout(handler);
        };
    }, [tagQuery]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setDescription(text);

        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPos);
        const atMatch = textBeforeCursor.match(/@(\w+)$/);

        if (atMatch) {
            setIsTagging(true);
            setTagQuery(atMatch[1]);
        } else {
            setIsTagging(false);
            setTagQuery(null);
        }
    };

    const handleSelectTag = (userToTag: User) => {
        const currentText = description;
        const cursorPos = textareaRef.current?.selectionStart || 0;
        
        const textBeforeCursor = currentText.substring(0, cursorPos);
        const textAfterCursor = currentText.substring(cursorPos);

        const newTextBefore = textBeforeCursor.replace(/@\S*$/, `@${userToTag.name} `);

        setDescription(newTextBefore + textAfterCursor);
        
        // Reset tagging state
        setIsTagging(false);
        setTagQuery(null);
        setTagResults([]);
        
        // Set focus and cursor position after insertion
        setTimeout(() => {
            if(textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = newTextBefore.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);

            if (file.type.startsWith('image/')) {
                setMediaType('image');
            } else if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                alert('Please select a valid image or video file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() && !mediaFile) {
            alert("Please write something or add a photo/video.");
            return;
        }

        setIsLoading(true);
        try {
            let uploadedMediaUrl: string | undefined = undefined;
            if (mediaFile) {
                uploadedMediaUrl = await api.uploadFile('Posts', mediaFile);
            }

            await api.addFeedItem({
                type: 'user_post',
                userId: user.id,
                title: '', // Not used for user posts
                description,
                mediaUrl: uploadedMediaUrl,
                mediaType: mediaType || undefined,
            });
            navigate('/feed');
        } catch (err) {
            alert('Failed to create post.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const canPost = (description.trim().length > 0 || !!mediaFile) && !isLoading;

    return (
        <div className="text-white min-h-full flex flex-col">
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)}><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">New Post</h1>
                <button 
                    onClick={handleSubmit} 
                    disabled={!canPost}
                    className="bg-lime-400 text-black font-bold text-sm px-4 py-1.5 rounded-full disabled:bg-zinc-600 transition-colors"
                >
                    {isLoading ? <Spinner /> : 'Post'}
                </button>
            </div>

            <div className="flex-1 p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar src={user.avatarUrl} alt={user.name} />
                    <textarea
                        ref={textareaRef}
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="What's on your mind? Use @ to tag someone."
                        className="w-full h-32 p-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none"
                    />
                </div>

                {mediaPreview && (
                    <div className="relative">
                        {mediaType === 'image' && <img src={mediaPreview} alt="Post preview" className="rounded-lg w-full" />}
                        {mediaType === 'video' && <video src={mediaPreview} controls className="rounded-lg w-full bg-black" />}
                        <button 
                            onClick={handleRemoveMedia} 
                            className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80"
                        >
                            <IconX size={18} />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="p-2 border-t border-zinc-800">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 p-2 text-lime-400 hover:bg-zinc-800 rounded-lg w-full justify-center">
                    <IconPaperclip size={22} />
                    <span className="font-bold">Add Photo/Video</span>
                </button>
                <input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange}
                />
            </div>

            {isTagging && (
                <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-24 md:left-4 md:right-auto md:w-80 md:rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg z-30 animate-pop-in overflow-hidden">
                    <div className="p-2 border-b border-zinc-800">
                        <p className="text-sm text-zinc-400">Tagging: <span className="font-bold text-white">@{tagQuery}</span></p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {tagLoading && <div className="p-4 flex justify-center"><Spinner /></div>}
                        {!tagLoading && tagResults.length === 0 && tagQuery && (
                            <p className="p-4 text-center text-zinc-500">No users found.</p>
                        )}
                        {!tagLoading && tagResults.map(userResult => (
                            <button 
                                key={userResult.id} 
                                onClick={() => handleSelectTag(userResult)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-800"
                            >
                                <Avatar src={userResult.avatarUrl} alt={userResult.name} size="sm" />
                                <div>
                                    <p className="font-bold text-white">{userResult.name}</p>
                                    <p className="text-xs text-zinc-400 capitalize">{userResult.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
