import React from 'react';
import { EnrichedReview } from '../types';
import { Avatar } from './Avatar';
import { IconStar } from '../constants';
import { Link } from 'react-router-dom';

interface ReviewCardProps {
    review: EnrichedReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-start gap-3">
                <Link to={`/profile/${review.author.id}`}>
                    <Avatar src={review.author.avatarUrl} alt={review.author.name} size="md" />
                </Link>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link to={`/profile/${review.author.id}`} className="font-bold text-white hover:underline">{review.author.name}</Link>
                            <p className="text-xs text-zinc-500">{review.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                                <IconStar key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="text-zinc-300 mt-2">{review.comment}</p>
                    )}
                </div>
            </div>
        </div>
    );
};