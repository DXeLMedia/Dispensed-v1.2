

import React, { useState, useEffect } from 'react';
import { DJ, Business, Role } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconStar, IconTrophy } from '../constants';
import { Link } from 'react-router-dom';

const LeaderboardHeader = () => (
  <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 border-b border-[var(--border)]">
    <h1 className="font-orbitron text-xl font-bold text-[var(--text-primary)] text-center">Leaderboard</h1>
  </div>
);

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'djs' | 'venues') => void }) => (
  <div className="flex p-1 bg-[var(--surface-2)] rounded-lg mx-4 my-2">
    <button
      onClick={() => setActiveTab('djs')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'djs' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
    >
      Top DJs
    </button>
    <button
      onClick={() => setActiveTab('venues')}
      className={`w-1/2 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'venues' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
    >
      Top Venues
    </button>
  </div>
);

const getRankMedal = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return rank + 1;
};

const getRankColor = (rank: number) => {
    if (rank === 0) return 'border-yellow-400 shadow-yellow-400/20';
    if (rank === 1) return 'border-gray-400 shadow-gray-400/20';
    if (rank === 2) return 'border-amber-600 shadow-amber-600/20';
    return 'border-[var(--border)]';
};

const LeaderboardItem = ({ item, rank }: { item: DJ | Business; rank: number }) => {
  const isDJ = item.role === Role.DJ;
  const linkTo = isDJ ? `/profile/${item.id}` : `/profile/${item.id}`;

  return (
    <Link to={linkTo} className={`block bg-[var(--surface-1)] border-2 rounded-lg p-3 hover:bg-[var(--surface-2)] transition-all duration-200 shadow-lg ${getRankColor(rank)}`}>
      <div className="flex items-center gap-4">
        <div className={`font-orbitron text-2xl font-bold w-10 text-center ${rank < 3 ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
          {getRankMedal(rank)}
        </div>
        <Avatar src={item.avatarUrl} alt={item.name} size="md" />
        <div className="flex-1">
          <h3 className="font-bold text-[var(--text-primary)] truncate">{item.name}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{isDJ ? (item as DJ).genres.join(', ') : (item as Business).location}</p>
        </div>
        <div className="flex items-center gap-1 text-lime-400">
          <IconStar size={16} fill="currentColor" />
          <span className="font-bold text-[var(--text-primary)]">{item.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
};

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'djs' | 'venues'>('djs');
  const [data, setData] = useState<(DJ[] | Business[])>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (activeTab === 'djs') {
        const djs = await api.getTopDJs();
        setData(djs);
      } else {
        const venues = await api.getTopVenues();
        setData(venues);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="text-[var(--text-primary)] min-h-full">
      <LeaderboardHeader />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {loading ? (
        <div className="pt-20">
          <Spinner />
        </div>
      ) : (
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
          {data.map((item, index) => (
            <LeaderboardItem key={item.id} item={item} rank={index} />
          ))}
        </div>
      )}
    </div>
  );
};