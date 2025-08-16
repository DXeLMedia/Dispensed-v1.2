

import React, { useEffect, useState } from 'react';
import { FeedItem as FeedItemType, User, Role } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconHeart, IconMessages, IconShare, IconRadio, IconSearch, IconNotifications, IconStar, IconTrophy, IconPlusCircle } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TrackPreview } from '../components/TrackPreview';

const FeedHeader = ({ unreadCount, role }: { unreadCount: number; role: Role | null }) => (
  <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm">
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h1 className="font-orbitron text-xl font-bold text-white">Feed</h1>
        <div className="flex items-center gap-4">
            {role === Role.DJ && (
              <Link to="/stream-setup" className="bg-lime-400 text-black font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <IconRadio size={14} />
                GO LIVE
              </Link>
            )}
            <Link to="/search">
                <IconSearch size={22} className="text-gray-300" />
            </Link>
            <Link to="/notifications" className="relative">
                <IconNotifications size={22} className="text-gray-300" />
                 {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                    </span>
                )}
            </Link>
        </div>
      </div>
  </div>
);

interface FeedCardProps {
  item: FeedItemType;
}

const FeedCard: React.FC<FeedCardProps> = ({ item }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  useEffect(() => {
    api.getUserById(item.userId).then(setUser);
  }, [item.userId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const CardContent = () => {
    switch (item.type) {
      case 'live_now':
        return (
          <div className="relative">
            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                <IconRadio size={48} className="text-lime-400 animate-pulse" />
                <p className="font-orbitron text-2xl mt-4 text-white">LIVE NOW</p>
                <Link to={`/stream/${item.relatedId}`} className="mt-4 bg-lime-400 text-black font-bold py-2 px-6 rounded-full hover:bg-lime-300 transition-colors">
                    Join Stream
                </Link>
            </div>
          </div>
        );
      case 'new_mix':
        return item.relatedId ? <TrackPreview playlistId={item.relatedId} /> : <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />;
      case 'new_review':
        return (
            <div className="p-4 bg-zinc-800/50">
                <div className="flex gap-1 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => <IconStar key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-zinc-200 font-semibold italic">"{item.description}"</p>
            </div>
        )
      case 'gig_announcement':
        return (
             <div className="relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-orbitron text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-300">{item.description}</p>
                </div>
            </div>
        );
      default:
        return item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" /> : null;
    }
  }
  
  if (!user) return <div className="bg-zinc-900 rounded-lg p-4 h-96 animate-pulse" />;

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pop-in">
      <div className="p-4 flex items-center gap-3">
        <Link to={`/profile/${user.id}`}>
          <Avatar src={user.avatarUrl} alt={user.name} size="md" />
        </Link>
        <div>
          <Link to={`/profile/${user.id}`} className="font-bold text-white hover:underline">{user.name}</Link>
          <p className="text-xs text-zinc-400">{item.timestamp}</p>
        </div>
      </div>
      
      { (item.type !== 'new_review' && item.type !== 'gig_announcement') &&
        <div className="px-4 pb-4">
            <p className="text-zinc-300">{item.description}</p>
        </div>
      }
      
      <CardContent />

      <div className="flex justify-around items-center p-2 text-zinc-400 border-t border-zinc-800">
        <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${isLiked ? 'text-lime-400' : 'hover:text-lime-400'}`}>
          <IconHeart size={20} fill={isLiked ? 'currentColor' : 'none'} /> 
          <span className="text-sm">{likeCount}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-lime-400 p-2 rounded-md transition-colors">
          <IconMessages size={20} /> <span className="text-sm">{item.comments}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-lime-400 p-2 rounded-md transition-colors">
          <IconShare size={20} /> <span className="text-sm">{item.shares}</span>
        </button>
      </div>
    </div>
  );
};


export const Feed = () => {
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { unreadCount, role } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.getFeedItems().then(items => {
      setFeedItems(items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="text-white min-h-full">
      <FeedHeader unreadCount={unreadCount} role={role} />
      {loading ? (
        <div className="pt-20">
            <Spinner />
        </div>
      ) : (
        <div className="p-2 md:p-4 space-y-4 pb-20 max-w-xl mx-auto">
          {feedItems.map(item => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
