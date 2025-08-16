
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconSearch } from '../constants';

export const Search = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    return (
        <div className="text-white min-h-full">
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">Search</h1>
            </div>
            <div className="p-4">
                <div className="relative">
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search DJs, Venues, Tracks..."
                        className="w-full p-3 pl-10 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                </div>
                <div className="text-center pt-20 text-zinc-500">
                    <p>Search results will appear here.</p>
                </div>
            </div>
        </div>
    );
}
