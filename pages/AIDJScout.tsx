

import React, { useState, useEffect } from 'react';
import { DJ } from '../types';
import * as gemini from '../services/geminiService';
import { IconArrowLeft, IconSparkles } from '../constants';
import { Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { IconStar, IconMapPin } from '../constants';

// Re-using DJCard logic from DiscoverDJs but as a local component to avoid prop-drilling or context
const DJCard: React.FC<{ dj: DJ }> = ({ dj }) => (
  <Link to={`/profile/${dj.id}`} className="block bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-lime-400 transition-colors duration-200 animate-pop-in">
    <div className="flex items-center gap-4">
      <Avatar src={dj.avatarUrl} alt={dj.name} size="lg" />
      <div className="flex-1 min-w-0">
        <h3 className="font-orbitron text-lg font-bold text-white truncate">{dj.name}</h3>
        <p className="text-sm text-zinc-400 truncate">{dj.genres.join(', ')}</p>
        <div className="flex items-center gap-1 mt-1 text-sm text-zinc-500">
          <IconMapPin size={14} />
          <span className="truncate">{dj.location}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <IconStar className="text-lime-400" size={16} fill="currentColor" />
          <span className="text-white font-bold">{dj.rating}</span>
          <span className="text-zinc-500">({dj.reviewsCount} reviews)</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-2 bg-zinc-800 rounded-md">
        <span className="font-bold text-lime-400 text-sm">{dj.tier}</span>
        <span className="text-xs text-zinc-400">Tier</span>
      </div>
    </div>
  </Link>
);


interface AIDJScoutProps {
    isOpen: boolean;
    onClose: () => void;
    allDJs: DJ[];
}

export const AIDJScout: React.FC<AIDJScoutProps> = ({ isOpen, onClose, allDJs }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DJ[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset state on close
            setTimeout(() => {
                setQuery('');
                setResults([]);
                setIsLoading(false);
                setError('');
                setHasSearched(false);
            }, 300); // Delay reset until after exit animation
        }
    }, [isOpen]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError('');
        setResults([]);
        setHasSearched(true);

        try {
            const matchedIds = await gemini.findDJsWithAI(query, allDJs);
            if (matchedIds.length > 0) {
                 const matchedDJs = allDJs.filter(dj => matchedIds.includes(dj.id));
                 // Preserve order from AI response
                 const orderedDJs = matchedIds.map(id => matchedDJs.find(dj => dj.id === id)).filter(Boolean) as DJ[];
                 setResults(orderedDJs);
            } else {
                setResults([]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while scouting. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const exampleQueries = [
        "Find me a techno DJ from the City Bowl",
        "Who plays deep, melodic house perfect for a sunset vibe?",
        "I need a high-energy DJ for a warehouse party",
        "Looking for an up-and-coming dub-techno artist",
    ];
    
    const handleExampleClick = (exampleQuery: string) => {
        setQuery(exampleQuery);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
            <header className="sticky top-0 z-20 bg-black p-4 flex items-center border-b border-zinc-800">
                <button onClick={onClose} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white flex items-center gap-2">
                    <IconSparkles className="text-lime-400"/>
                    AI DJ Scout
                </h1>
            </header>

            <div className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Afro house DJ for a beach party"
                        className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-white"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-lime-400 text-black font-bold px-6 py-3 rounded-lg disabled:bg-zinc-600 flex items-center justify-center w-32" disabled={isLoading || !query.trim()}>
                        {isLoading ? <Spinner /> : 'Scout'}
                    </button>
                </form>
            </div>
            
            <main className="flex-1 overflow-y-auto px-2 space-y-3 pb-20">
                {isLoading && (
                    <div className="text-center pt-20 text-zinc-400 flex flex-col items-center">
                       <Spinner />
                       <p className="mt-4 font-orbitron">Scouting for the perfect vibe...</p>
                    </div>
                )}
                
                {error && <p className="text-center text-red-500 pt-20">{error}</p>}
                
                {!isLoading && !error && hasSearched && results.length === 0 && (
                     <div className="text-center pt-20 text-zinc-400">
                        <h3 className="text-lg font-bold text-white">No DJs match your request</h3>
                        <p>Try being more specific or using different keywords.</p>
                    </div>
                )}

                {!isLoading && !error && hasSearched && results.length > 0 && (
                     <div className="p-2 space-y-3">
                        {results.map(dj => <DJCard key={dj.id} dj={dj} />)}
                    </div>
                )}
                
                 {!isLoading && !hasSearched && (
                    <div className="text-center pt-10 text-zinc-400 p-4">
                         <h3 className="font-orbitron text-lg font-bold text-white">Find Your Sound</h3>
                         <p className="mb-4">Use natural language to discover DJs.</p>
                         <div className="space-y-2">
                            {exampleQueries.map(q => (
                                <button key={q} onClick={() => handleExampleClick(q)} className="w-full text-left p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-lime-400 transition-colors">
                                    "{q}"
                                </button>
                            ))}
                         </div>
                    </div>
                )}

            </main>
        </div>
    );
};