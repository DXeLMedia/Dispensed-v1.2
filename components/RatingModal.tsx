import React, { useState } from 'react';
import { IconStar, IconX } from '../constants';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    targetName: string;
    targetType: 'DJ' | 'Venue';
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit, targetName, targetType }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a rating.");
            return;
        }
        setIsSubmitting(true);
        await onSubmit(rating, comment);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-zinc-900 border-2 border-lime-400 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-lime-500/20 animate-pop-in" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-orbitron text-xl text-white">Rate {targetName}</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><IconX size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p className="text-zinc-300 mb-2 text-center">Your rating for this {targetType}</p>
                        <div className="flex justify-center items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <IconStar
                                    key={star}
                                    size={36}
                                    className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-zinc-600'}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onClick={() => setRating(star)}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-sm font-medium text-zinc-300 mb-1">Add a comment (optional)</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows={3}
                            placeholder={`What was your experience with ${targetName}?`}
                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full p-3 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};