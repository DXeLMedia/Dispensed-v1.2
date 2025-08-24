
import React from 'react';
import { EnrichedComment } from '../types';
import { Avatar } from './Avatar';
import { Link } from 'react-router-dom';

interface CommentCardProps {
    comment: EnrichedComment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    return (
        <div className="flex items-start gap-3 p-1 animate-fade-in">
            <Link to={`/profile/${comment.author.id}`}>
                <Avatar src={comment.author.avatarUrl} alt={comment.author.name} size="sm" />
            </Link>
            <div className="flex-1 bg-zinc-800 rounded-lg px-3 py-2">
                <div className="flex items-baseline gap-2">
                    <Link to={`/profile/${comment.author.id}`} className="font-bold text-white text-sm hover:underline">{comment.author.name}</Link>
                    <p className="text-xs text-zinc-500">{comment.timestamp}</p>
                </div>
                <p className="text-zinc-200 mt-1 whitespace-pre-line">{comment.text}</p>
            </div>
        </div>
    );
};
