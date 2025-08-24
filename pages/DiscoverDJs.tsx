

import React, { useEffect, useState } from 'react';
import { DJ } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
import { IconStar, IconMapPin, IconMusic, IconX, IconSearch, IconNotifications, IconSparkles } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AIDJScout } from './AIDJScout';

interface DJCardProps {
    dj: DJ;
}

const DJCard: React.FC<DJCardProps> = ({ dj }) => (
  <Link to={`/profile/${dj.id}`} className="block bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-lime-400 transition-colors duration-200">
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

const AIScoutTrigger = ({ onClick }: { onClick: () => void }) => (
    <div className="p-4">
        <button onClick={onClick} className="w-full bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-lg p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg shadow-lime-500/20">
            <div className="flex items-center gap-2">
                <IconSparkles size={24} />
                <h2 className="font-orbitron text-xl font-bold">AI DJ Scout</h2>
            </div>
            <p className="text-sm font-semibold">Find DJs with natural language</p>
        </button>
    </div>
);


const DiscoverHeader = ({ unreadCount }: { unreadCount: number }) => (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <h1 className="font-orbitron text-xl font-bold text-white">Find DJs</h1>
            <div className="flex items-center gap-4">
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

type FilterType = 'genre' | 'location' | 'rating';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilter: FilterType | null;
    availableGenres: string[];
    availableLocations: string[];
    currentFilters: { genres: string[]; location: string | null; rating: number; };
    onApply: (newFilters: { genres: string[]; location: string | null; rating: number; }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, activeFilter, availableGenres, availableLocations, currentFilters, onApply }) => {
    const [tempGenres, setTempGenres] = useState(currentFilters.genres);
    const [tempLocation, setTempLocation] = useState(currentFilters.location);
    const [tempRating, setTempRating] = useState(currentFilters.rating);

    useEffect(() => {
        setTempGenres(currentFilters.genres);
        setTempLocation(currentFilters.location);
        setTempRating(currentFilters.rating);
    }, [isOpen, currentFilters]);

    if (!isOpen || !activeFilter) return null;

    const handleGenreToggle = (genre: string) => {
        setTempGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    };
    
    const handleApply = () => {
        onApply({ genres: tempGenres, location: tempLocation, rating: tempRating });
        onClose();
    };
    
    const handleClear = () => {
        if(activeFilter === 'genre') setTempGenres([]);
        if(activeFilter === 'location') setTempLocation(null);
        if(activeFilter === 'rating') setTempRating(0);
    };

    const titles: Record<FilterType, string> = {
        genre: 'Filter by Genre',
        location: 'Filter by Location',
        rating: 'Filter by Rating'
    };

    const ratingOptions = [{label: '4.5+ stars', value: 4.5}, {label: '4.0+ stars', value: 4.0}, {label: '3.0+ stars', value: 3.0}];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="bg-zinc-900 w-full max-w-md rounded-t-2xl border-t-2 border-lime-400 shadow-2xl shadow-lime-500/20 flex flex-col max-h-[75%]" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-zinc-800">
                    <h2 className="font-orbitron text-lg text-white">{titles[activeFilter]}</h2>
                    <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white"><IconX size={24}/></button>
                </header>

                <main className="p-4 overflow-y-auto space-y-2">
                    {activeFilter === 'genre' && availableGenres.map(genre => (
                        <label key={genre} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={tempGenres.includes(genre)} onChange={() => handleGenreToggle(genre)} className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-lime-500 focus:ring-lime-500" />
                            <span className="text-white font-medium">{genre}</span>
                        </label>
                    ))}
                    {activeFilter === 'location' && availableLocations.map(loc => (
                         <label key={loc} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                            <input type="radio" name="location" checked={tempLocation === loc} onChange={() => setTempLocation(loc)} className="h-5 w-5 bg-zinc-700 border-zinc-600 text-lime-500 focus:ring-lime-500" />
                            <span className="text-white font-medium">{loc}</span>
                        </label>
                    ))}
                    {activeFilter === 'rating' && ratingOptions.map(opt => (
                         <label key={opt.value} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                            <input type="radio" name="rating" checked={tempRating === opt.value} onChange={() => setTempRating(opt.value)} className="h-5 w-5 bg-zinc-700 border-zinc-600 text-lime-500 focus:ring-lime-500" />
                            <span className="text-white font-medium">{opt.label}</span>
                        </label>
                    ))}
                </main>
                
                <footer className="p-4 border-t border-zinc-800 flex gap-4">
                     <button onClick={handleClear} className="flex-1 py-3 px-4 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors">Clear</button>
                    <button onClick={handleApply} className="flex-1 py-3 px-4 rounded-lg bg-lime-400 text-black font-bold hover:bg-lime-300 transition-colors">Apply Filters</button>
                </footer>
            </div>
        </div>
    );
};

const FilterBar = ({ onFilterClick, activeFilters }: { onFilterClick: (type: FilterType) => void, activeFilters: Record<FilterType, boolean> }) => (
    <div className="p-4 flex items-center justify-center gap-2 flex-wrap bg-black border-y border-zinc-800">
        <button onClick={() => onFilterClick('genre')} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${activeFilters.genre ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-white'}`}>
            <IconMusic size={16} /> Genre
        </button>
        <button onClick={() => onFilterClick('location')} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${activeFilters.location ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-white'}`}>
            <IconMapPin size={16} /> Location
        </button>
        <button onClick={() => onFilterClick('rating')} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${activeFilters.rating ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-white'}`}>
            <IconStar size={16} /> Rating
        </button>
    </div>
);


export const DiscoverDJs = () => {
  const [allDJs, setAllDJs] = useState<DJ[]>([]);
  const [filteredDJs, setFilteredDJs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);

  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const { unreadCount } = useAuth();
  const [isScoutOpen, setIsScoutOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getDJs().then(data => {
      setAllDJs(data);
      setFilteredDJs(data);
      const allGenres = [...new Set(data.flatMap(dj => dj.genres))].sort();
      const allLocations = [...new Set(data.map(dj => dj.location))].sort();
      setAvailableGenres(allGenres);
      setAvailableLocations(allLocations);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let tempDJs = [...allDJs];
    if (selectedGenres.length > 0) {
        tempDJs = tempDJs.filter(dj => selectedGenres.every(genre => dj.genres.includes(genre)));
    }
    if (selectedLocation) {
        tempDJs = tempDJs.filter(dj => dj.location === selectedLocation);
    }
    if (minRating > 0) {
        tempDJs = tempDJs.filter(dj => dj.rating >= minRating);
    }
    setFilteredDJs(tempDJs);
  }, [selectedGenres, selectedLocation, minRating, allDJs]);


  const openFilterModal = (type: FilterType) => {
    setActiveFilter(type);
    setIsModalOpen(true);
  }

  const handleApplyFilters = (newFilters: { genres: string[]; location: string | null; rating: number; }) => {
    setSelectedGenres(newFilters.genres);
    setSelectedLocation(newFilters.location);
    setMinRating(newFilters.rating);
  };
  
  const activeFilters = {
    genre: selectedGenres.length > 0,
    location: !!selectedLocation,
    rating: minRating > 0
  };

  const handleOpenScout = () => setIsScoutOpen(true);
  const handleCloseScout = () => setIsScoutOpen(false);

  return (
    <div className="text-white min-h-full">
      <DiscoverHeader unreadCount={unreadCount} />
      <AIScoutTrigger onClick={handleOpenScout} />
      <FilterBar onFilterClick={openFilterModal} activeFilters={activeFilters}/>
      {loading ? (
        <div className="pt-20">
            <Spinner />
        </div>
      ) : (
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
          {filteredDJs.length > 0 ? filteredDJs.map(dj => (
            <DJCard key={dj.id} dj={dj} />
          )) : (
            <div className="col-span-1 md:col-span-2 text-center pt-20 text-zinc-400">
                <h3 className="text-lg font-bold text-white">No DJs Found</h3>
                <p>Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeFilter={activeFilter}
        availableGenres={availableGenres}
        availableLocations={availableLocations}
        currentFilters={{ genres: selectedGenres, location: selectedLocation, rating: minRating }}
        onApply={handleApplyFilters}
      />
       <AIDJScout
          isOpen={isScoutOpen}
          onClose={handleCloseScout}
          allDJs={allDJs}
      />
    </div>
  );
};
