import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import * as gemini from '../services/geminiService';
import { Spinner } from '../components/Spinner';
import { IconSparkles, IconArrowLeft } from '../constants';

export const CreateGig = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [budget, setBudget] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) {
      navigate('/login');
      return null;
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setGenres(prev => [...prev, value]);
    } else {
      setGenres(prev => prev.filter(g => g !== value));
    }
  };

  const handleGenerateDescription = async () => {
    if (!title || !user.name || genres.length === 0) {
      alert("Please fill in Title and select at least one Genre to generate a description.");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedDesc = await gemini.generateGigDescription(title, user.name, genres, keywords);
      setDescription(generatedDesc);
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Could not generate description at this time.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await api.addGig({
            title,
            venueId: user.id,
            date,
            time,
            budget: Number(budget),
            genres,
            description,
        });
        alert('Gig created successfully!');
        navigate(`/profile/me`);
    } catch(err) {
        alert('Failed to create gig.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const availableGenres = ['Techno', 'Deep House', 'Afro Tech', 'Minimal', 'Dub-Techno', 'Deep-Tech', 'Break-Dub', 'House'];

  return (
    <div className="text-white min-h-full pb-20">
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
        <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
        <h1 className="font-orbitron text-xl font-bold text-white">Create New Gig</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Gig Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
            </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Budget (ZAR)</label>
          <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., 10000" className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Genres</label>
          <div className="grid grid-cols-3 gap-2">
            {availableGenres.map(genre => (
              <label key={genre} className={`p-2 text-center rounded-lg text-sm cursor-pointer border ${genres.includes(genre) ? 'bg-lime-400 text-black border-lime-400' : 'bg-zinc-800 border-zinc-700'}`}>
                <input type="checkbox" value={genre} onChange={handleGenreChange} className="sr-only" />
                {genre}
              </label>
            ))}
          </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Vibe & Keywords (for AI)</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., high-energy, underground, melodic" className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" />
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-zinc-300">Description</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-1 text-sm text-lime-400 hover:text-lime-300 disabled:text-zinc-500">
                    {isGenerating ? <Spinner /> : <IconSparkles size={16} />}
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required></textarea>
        </div>

        <button type="submit" disabled={isLoading} className="w-full p-4 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600">
            {isLoading ? 'Creating Gig...' : 'Create Gig'}
        </button>
      </form>
    </div>
  );
};