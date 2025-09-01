

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Role } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconArrowLeft } from '../constants';

// FIX: Changed component to use React.FC and a props interface to fix TypeScript error with `key` prop.
interface UserRowProps {
  user: User;
}
const UserRow: React.FC<UserRowProps> = ({ user }) => (
    <Link to={`/profile/${user.id}`} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg transition-colors">
        <Avatar src={user.avatarUrl} alt={user.name} />
        <div>
            <p className="font-bold text-white">{user.name}</p>
            <p className="text-sm text-zinc-400 capitalize">{user.role}</p>
        </div>
    </Link>
)

const Header = ({ username }: { username: string }) => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
             <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
            <h1 className="font-orbitron text-lg font-bold text-white truncate">{username}'s Network</h1>
        </div>
    );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'followers' | 'following') => void }) => (
  <div className="flex p-1 bg-zinc-800 rounded-lg mx-4 my-2">
    <button
      onClick={() => setActiveTab('followers')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'followers' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
    >
      Followers
    </button>
    <button
      onClick={() => setActiveTab('following')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'following' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
    >
      Following
    </button>
  </div>
);

export const Connections = () => {
    const { id: profileId } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const query = new URLSearchParams(location.search);
    const initialTab = query.get('tab') === 'following' ? 'following' : 'followers';

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [list, setList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);

    useEffect(() => {
        if (!profileId) {
            navigate('/login');
            return;
        }

        api.getUserById(profileId).then(setProfileUser);

        const fetchConnections = async () => {
            setLoading(true);
            const data = activeTab === 'followers'
                ? await api.getFollowersForUser(profileId)
                : await api.getFollowingForUser(profileId);
            setList(data);
            setLoading(false);
        }
        fetchConnections();

    }, [profileId, activeTab, navigate]);

    if (!profileUser) return <Spinner />;

    return (
        <div className="text-white min-h-full">
            <Header username={profileUser.name} />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? (
                <div className="pt-10"><Spinner /></div>
            ) : (
                <div className="p-2 space-y-1 pb-20">
                    {list.length > 0 ? list.map(user => (
                        <UserRow key={user.id} user={user} />
                    )) : (
                        <p className="text-center text-zinc-500 pt-10">No users found.</p>
                    )}
                </div>
            )}
        </div>
    );
};