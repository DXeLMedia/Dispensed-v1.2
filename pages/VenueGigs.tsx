
import React, { useState, useEffect } from 'react';
import { Gig } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
import { IconArrowLeft, IconConnections, IconCalendar, IconCheckCircle2, IconStar, IconPlus } from '../constants';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
            <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
            <h1 className="font-orbitron text-xl font-bold text-white">Manage Gigs</h1>
        </div>
    );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'open' | 'booked' | 'completed') => void }) => (
    <div className="flex p-1 bg-zinc-800 rounded-lg mx-4 my-2">
        <button
            onClick={() => setActiveTab('open')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'open' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
        >
            Open
        </button>
        <button
            onClick={() => setActiveTab('booked')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'booked' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
        >
            Booked
        </button>
         <button
            onClick={() => setActiveTab('completed')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'completed' ? 'bg-lime-400 text-black' : 'text-zinc-300'}`}
        >
            Completed
        </button>
    </div>
);

const GigManagementCard = ({ gig }: { gig: Gig & { bookedDjName?: string } }) => {
    const handleRateDJ = () => {
        alert(`Rating flow for ${gig.bookedDjName} would start here.`);
    }

    const cardContent = (
         <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 transition-colors duration-200 hover:border-lime-400">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-orbitron text-lg font-bold text-white">{gig.title}</h3>
                    <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                        <IconCalendar size={14} />
                        {new Date(gig.date).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' })}
                    </p>
                </div>
                 <div className="text-right">
                    {gig.status === 'Open' ? (
                        <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-full">
                            <IconConnections size={16} className="text-lime-400" />
                            <span className="font-bold text-white">{gig.interestCount}</span>
                            <span className="text-zinc-400 text-sm">Applicants</span>
                        </div>
                    ) : (
                         <div className={`flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full ${gig.status === 'Booked' ? 'text-blue-300 bg-blue-900/50' : 'text-purple-300 bg-purple-900/50'}`}>
                            <IconCheckCircle2 size={16} />
                            <span>{gig.status}</span>
                        </div>
                    )}
                </div>
            </div>
             {(gig.status === 'Booked' || gig.status === 'Completed') && gig.bookedDjName && (
                <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <p className="text-sm text-zinc-300">DJ: <Link to={`/profile/${gig.bookedDjId}`} className="font-bold text-white hover:underline">{gig.bookedDjName}</Link></p>
                    {gig.status === 'Completed' && (
                        <button onClick={handleRateDJ} className="flex items-center gap-1.5 text-sm bg-yellow-400/20 text-yellow-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-400/40">
                            <IconStar size={16} /> Rate DJ
                        </button>
                    )}
                </div>
             )}
        </div>
    );

    if (gig.status === 'Open') {
        return <Link to={`/venue/gigs/${gig.id}/applicants`}>{cardContent}</Link>;
    }

    return cardContent;
}


export const VenueGigs = () => {
    const [activeTab, setActiveTab] = useState<'open' | 'booked' | 'completed'>('open');
    const [allGigs, setAllGigs] = useState<(Gig & { bookedDjName?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'business') {
            navigate('/login');
            return;
        }

        const fetchGigs = async () => {
            setLoading(true);
            const data = await api.getGigsForVenue(user.id);
            setAllGigs(data as (Gig & { bookedDjName?: string })[]);
            setLoading(false);
        }

        fetchGigs();

    }, [user, navigate]);

    const filteredGigs = allGigs.filter(gig => gig.status.toLowerCase() === activeTab);

    return (
        <div className="text-white min-h-full">
            <Header />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? (
                <div className="pt-20">
                    <Spinner />
                </div>
            ) : (
                 <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-24">
                    {filteredGigs.length > 0 ? (
                        filteredGigs.map(gig => <GigManagementCard key={gig.id} gig={gig} />)
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center text-zinc-400 pt-10">
                            <p>No {activeTab} gigs found.</p>
                             {activeTab === 'open' && (
                                <Link to="/create-gig" className="mt-4 inline-block bg-lime-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-lime-300 transition-colors">
                                    Create Your First Gig
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
            <Link to="/create-gig" title="Create New Gig" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-lime-400 text-black p-4 rounded-full shadow-lg shadow-lime-500/30 z-30 hover:bg-lime-300 transition-all transform hover:scale-110">
                <IconPlus size={28} />
            </Link>
        </div>
    );
};
