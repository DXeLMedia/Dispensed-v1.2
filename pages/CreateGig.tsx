

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import * as gemini from '../services/geminiService';
import { Spinner } from '../components/Spinner';
import { IconSparkles, IconArrowLeft, IconPhoto, IconX } from '../constants';
import { usePersistence } from '../hooks/usePersistence';

export const CreateGig = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = usePersistence();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [budget, setBudget] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [isGeneratingFlyer, setIsGeneratingFlyer] = useState(false);

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
      showToast("Please fill in Title and select at least one Genre.", 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const generatedDesc = await gemini.generateGigDescription(title, user.name, genres, keywords);
      setDescription(generatedDesc);
    } catch (error) {
      console.error("Failed to generate description:", error);
      showToast("Could not generate description at this time.", 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateFlyer = async () => {
    if (!title || genres.length === 0) {
      showToast("Please provide a Title and at least one Genre.", 'error');
      return;
    }
    setIsGeneratingFlyer(true);
    setFlyerPreview(null); // Clear previous preview
    setFlyerFile(null);

    try {
      const base64Image = await gemini.generateGigFlyer(title, user.name, genres, keywords);
      if (base64Image) {
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'ai-flyer.jpeg', { type: 'image/jpeg' });
        
        setFlyerFile(file);
        setFlyerPreview(dataUrl);
        showToast("AI Flyer generated successfully!", 'success');
      } else {
        throw new Error("AI model did not return an image.");
      }
    } catch (error) {
      console.error("Failed to generate flyer:", error);
      showToast("Could not generate flyer. Please try again.", 'error');
    } finally {
      setIsGeneratingFlyer(false);
    }
  };

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFlyerFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFlyerPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        let uploadedFlyerUrl = '';
        if (flyerFile) {
            uploadedFlyerUrl = await api.uploadFile('Flyers', flyerFile);
        }

        await api.addGig({
            title,
            business_user_id: user.id,
            date,
            time,
            budget: Number(budget),
            genres,
            description,
            flyerUrl: uploadedFlyerUrl,
        });
        showToast('Gig created successfully!', 'success');
        navigate(`/venue/gigs`);
    } catch(err) {
        let message = 'Failed to create gig.';
        if (err instanceof Error && err.message.includes('security policy')) {
            message = 'Gig creation failed due to a storage permission issue. Please contact support.';
        }
        showToast(message, 'error');
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

        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Event Flyer</label>
             <div className="relative aspect-[4/3] w-full bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                {isGeneratingFlyer && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <Spinner />
                    <p className="mt-2 text-sm text-zinc-300">Generating your flyer...</p>
                </div>
                )}
                {flyerPreview ? (
                <>
                    <img src={flyerPreview} alt="Flyer preview" className="w-full h-full object-cover" />
                    <button
                    type="button"
                    onClick={() => { setFlyerPreview(null); setFlyerFile(null); }}
                    className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80 z-10"
                    >
                    <IconX size={18} />
                    </button>
                </>
                ) : (
                !isGeneratingFlyer && (
                    <div className="text-center">
                    <IconPhoto size={32} className="text-zinc-500 mx-auto" />
                    <p className="text-sm text-zinc-400 mt-2">Upload or generate a flyer</p>
                    </div>
                )
                )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <label htmlFor="flyer-upload" className={`cursor-pointer text-center text-sm font-bold bg-zinc-700 text-white py-2.5 rounded-lg hover:bg-zinc-600 transition-colors ${isGeneratingFlyer || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Upload
                </label>
                <input id="flyer-upload" type="file" className="hidden" accept="image/*" onChange={handleFlyerChange} disabled={isGeneratingFlyer || isLoading} />
                <button
                type="button"
                onClick={handleGenerateFlyer}
                disabled={isGeneratingFlyer || isGenerating || isLoading}
                className="flex items-center justify-center gap-2 text-sm font-bold bg-lime-500/20 text-lime-300 py-2.5 rounded-lg hover:bg-lime-500/30 transition-colors disabled:opacity-50"
                >
                <IconSparkles size={16} />
                Generate with AI
                </button>
            </div>
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