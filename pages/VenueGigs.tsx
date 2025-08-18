

import React, { useState, useEffect } from 'react';
import { Gig, DJ } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
import { IconArrowLeft, IconConnections, IconCalendar, IconCheckCircle2, IconStar, IconPlus } from '../constants';
import { useNavigate, Link } from 'react-router-dom';
import { RatingModal } from '../components/RatingModal';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex items-center border-b border-[var(--border)]">
            <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
            <h1 className="font-orbitron text-xl font-bold text-[var(--text-primary)]">Manage Gigs</h1>
        </div>
    );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: 'open' | 'booked' | 'completed') => void }) => (
    <div className="flex p-1 bg-[var(--surface-2)] rounded-lg mx-4 my-2">
        <button
            onClick={() => setActiveTab('open')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'open' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
        >
            Open
        </button>
        <button
            onClick={() => setActiveTab('booked')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'booked' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
        >
            Booked
        </button>
         <button
            onClick={() => setActiveTab('completed')}
            className={`w-1/3 p-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'completed' ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
        >
            Completed
        </button>
    </div>
);

const GigManagementCard = ({ gig, onRateClick }: { gig: Gig & { bookedDjName?: string }; onRateClick: (gig: Gig & { bookedDjName?: string }) => void; }) => {

    const cardContent = (
         <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-lg overflow-hidden transition-colors duration-200 hover:border-[var(--accent)]">
            {gig.flyerUrl && (
                <img src={gig.flyerUrl} alt={gig.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-orbitron text-lg font-bold text-[var(--text-primary)]">{gig.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                            <IconCalendar size={14} />
                            {new Date(gig.date).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                     <div className="text-right">
                        {gig.status === 'Open' ? (
                            <div className="flex items-center gap-2 bg-[var(--surface-2)] px-3 py-1 rounded-full">
                                <IconConnections size={16} className="text-[var(--accent)]" />
                                <span className="font-bold text-[var(--text-primary)]">{gig.interestCount}</span>
                                <span className="text-[var(--text-secondary)] text-sm">Applicants</span>
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
                    <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                        <p className="text-sm text-[var(--text-secondary)]">DJ: <Link to={`/profile/${gig.bookedDjId}`} className="font-bold text-[var(--text-primary)] hover:underline">{gig.bookedDjName}</Link></p>
                        {gig.status === 'Completed' && (
                            <button onClick={() => onRateClick(gig)} className="flex items-center gap-1.5 text-sm bg-yellow-400/20 text-yellow-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-400/40">
                                <IconStar size={16} /> Rate DJ
                            </button>
                        )}
                    </div>
                 )}
             </div>
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
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [gigToRate, setGigToRate] = useState<(Gig & { bookedDjName?: string }) | null>(null);

    const fetchGigs = async () => {
        if(!user) return;
        setLoading(true);
        const data = await api.getGigsForVenue(user.id);
        setAllGigs(data as (Gig & { bookedDjName?: string })[]);
        setLoading(false);
    }

    useEffect(() => {
        if (!user || user.role !== 'business') {
            navigate('/login');
            return;
        }
        fetchGigs();
    }, [user, navigate]);

    const handleRateClick = (gig: Gig & { bookedDjName?: string }) => {
        setGigToRate(gig);
        setIsRatingModalOpen(true);
    };

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!gigToRate || !gigToRate.bookedDjId || !user) return;
        await api.submitReview({
            authorId: user.id,
            targetId: gigToRate.bookedDjId,
            rating,
            comment,
            gigId: gigToRate.id,
        });
        alert("Review submitted!");
        // Optionally refetch gigs or update state to hide the button
    };

    const filteredGigs = allGigs.filter(gig => gig.status.toLowerCase() === activeTab);

    return (
        <div className="text-[var(--text-primary)] min-h-full">
            <Header />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? (
                <div className="pt-20">
                    <Spinner />
                </div>
            ) : (
                 <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-24">
                    {filteredGigs.length > 0 ? (
                        filteredGigs.map(gig => <GigManagementCard key={gig.id} gig={gig} onRateClick={handleRateClick} />)
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center text-[var(--text-secondary)] pt-10">
                            <p>No {activeTab} gigs found.</p>
                             {activeTab === 'open' && (
                                <Link to="/create-gig" className="mt-4 inline-block bg-[var(--accent)] text-[var(--accent-text)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                                    Create Your First Gig
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
            <Link to="/create-gig" title="Create New Gig" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[var(--accent)] text-[var(--accent-text)] p-4 rounded-full shadow-lg shadow-[var(--accent)]/30 z-30 hover:bg-[var(--accent-hover)] transition-all transform hover:scale-110">
                <IconPlus size={28} />
            </Link>
            
            {gigToRate && (
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    onSubmit={handleSubmitReview}
                    targetName={gigToRate.bookedDjName || 'DJ'}
                    targetType="DJ"
                />
            )}
        </div>
    );
};
