

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { Gig, DJ, Role } from '../types';
import { PageSpinner } from '../components/Spinner';
import { IconArrowLeft, IconStar, IconCheckCircle2, IconX } from '../constants';
import { Avatar } from '../components/Avatar';

const Header = ({ title }: { title: string }) => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-20 bg-[var(--background)] p-4 flex items-center border-b border-[var(--border)]">
            <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
            <div className='overflow-hidden'>
                <p className="text-xs text-[var(--text-secondary)]">Applicants for</p>
                <h1 className="font-orbitron text-lg font-bold text-[var(--text-primary)] truncate">{title}</h1>
            </div>
        </div>
    );
};

interface ApplicantCardProps {
    dj: DJ;
    isBooked: boolean;
    isGigOpen: boolean;
    onBook: (djId: string) => void;
    isBooking: boolean;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ dj, isBooked, isGigOpen, onBook, isBooking }) => {
    return (
        <div className={`bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-3 transition-all animate-pop-in ${isBooked ? 'border-[var(--accent)]' : ''}`}>
            <div className="flex items-center gap-3">
                 <Link to={`/profile/${dj.id}`}>
                    <Avatar src={dj.avatarUrl} alt={dj.name} />
                </Link>
                <div className="flex-1 overflow-hidden">
                    <Link to={`/profile/${dj.id}`} className="font-bold text-[var(--text-primary)] truncate hover:underline">{dj.name}</Link>
                    <div className="flex items-center gap-2 mt-1">
                        <IconStar className="text-lime-400" size={14} fill="currentColor" />
                        <span className="text-[var(--text-primary)] font-semibold text-sm">{dj.rating.toFixed(1)}</span>
                        <span className="text-[var(--text-muted)] text-xs">({dj.reviewsCount} reviews)</span>
                    </div>
                </div>
                {isGigOpen ? (
                    <button 
                        onClick={() => onBook(dj.id)}
                        disabled={isBooking}
                        className="bg-[var(--accent)] text-[var(--accent-text)] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:bg-[var(--surface-2)] disabled:cursor-not-allowed w-28 h-9 flex items-center justify-center"
                    >
                       {isBooking ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div> : 'Book DJ'}
                    </button>
                ) : (
                    isBooked && (
                         <div className="flex items-center gap-2 text-green-400 bg-green-900/50 px-3 py-1 rounded-full">
                            <IconCheckCircle2 size={16} />
                            <span className="font-semibold text-sm">Booked</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};


interface ConfirmationModalProps {
    dj: DJ;
    onConfirm: () => void;
    onCancel: () => void;
    isBooking: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ dj, onConfirm, onCancel, isBooking }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in">
        <div className="bg-[var(--surface-1)] border-2 border-[var(--accent)] rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-[var(--accent)]/20 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end">
                <button onClick={onCancel} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><IconX size={20}/></button>
            </div>
            <h2 className="font-orbitron text-xl text-[var(--text-primary)] -mt-4">Confirm Booking</h2>
            <p className="text-[var(--text-secondary)] my-4">
                Are you sure you want to book <span className="font-bold text-[var(--text-primary)]">{dj.name}</span> for this gig?
            </p>
            <Avatar src={dj.avatarUrl} alt={dj.name} size="lg" className="mx-auto mb-6" />
            <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 py-3 px-4 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] font-bold hover:bg-[var(--border)] transition-colors">
                    Cancel
                </button>
                <button onClick={onConfirm} disabled={isBooking} className="flex-1 py-3 px-4 rounded-lg bg-[var(--accent)] text-[var(--accent-text)] font-bold hover:bg-[var(--accent-hover)] transition-colors disabled:bg-[var(--surface-2)] disabled:cursor-not-allowed">
                    {isBooking ? 'Booking...' : 'Confirm'}
                </button>
            </div>
        </div>
    </div>
);


export const GigApplicants = () => {
    const { gigId } = useParams<{ gigId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [gig, setGig] = useState<(Gig & { bookedDjName?: string }) | null>(null);
    const [applicants, setApplicants] = useState<DJ[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingDjId, setBookingDjId] = useState<string | null>(null);
    const [confirmingDj, setConfirmingDj] = useState<DJ | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchGigData = useCallback(async () => {
        if (!gigId) return;
        try {
            const gigData = await api.getGigById(gigId) as (Gig & { bookedDjName?: string });
            let applicantsData = await api.getInterestedDJsForGig(gigId);
            
            if (gigData?.status === 'Booked' && gigData.bookedDjId) {
                const isBookedDjInList = applicantsData.some(dj => dj.id === gigData.bookedDjId);
                if (!isBookedDjInList) {
                    const bookedDjProfile = await api.getDJById(gigData.bookedDjId);
                    if (bookedDjProfile) {
                        applicantsData.unshift(bookedDjProfile);
                    }
                }
            }

            setGig(gigData);
            setApplicants(applicantsData);
        } catch (error) {
            console.error("Failed to fetch gig data", error);
            setError("Could not load gig details.");
            setGig(null);
        } finally {
             setLoading(false);
        }
    }, [gigId]);

    useEffect(() => {
        if (!user || user.role !== Role.Business) {
            navigate('/login');
            return;
        }
        setLoading(true);
        fetchGigData();
    }, [gigId, user, navigate, fetchGigData]);
    
    const handleOpenConfirmation = (djId: string) => {
        const djToConfirm = applicants.find(dj => dj.id === djId);
        if (djToConfirm) {
            setConfirmingDj(djToConfirm);
        }
    };

    const handleConfirmBooking = async () => {
        if (!gigId || !confirmingDj || !gig) return;

        setBookingDjId(confirmingDj.id);
        setError(null);
        setConfirmingDj(null); // Close modal

        try {
            const success = await api.bookDJForGig(gigId, confirmingDj.id, gig.budget);
            if (success) {
                // Optimistic update
                setGig(prevGig => prevGig ? {
                    ...prevGig,
                    status: 'Booked',
                    bookedDjId: confirmingDj.id,
                    bookedDjName: confirmingDj.name,
                } : null);
            } else {
                setError("Failed to book DJ. The gig might already be booked or another error occurred.");
            }
        } catch (e) {
             console.error("Booking failed", e);
             setError("An unexpected error occurred during booking.");
        } finally {
            setBookingDjId(null);
        }
    }


    if (loading) return <PageSpinner />;
    if (!gig) return <div className="text-center text-red-500 p-8">Gig not found.</div>;

    return (
        <div className="text-[var(--text-primary)] min-h-full pb-20">
            <Header title={gig.title} />

            <div className="p-4 space-y-4">
                 {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-center">
                        <p>{error}</p>
                    </div>
                 )}
                 {gig.status === 'Booked' && (
                    <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-lg text-center">
                        <p>This gig has been booked. <span className="font-bold">{gig.bookedDjName || '...'}</span> is confirmed.</p>
                    </div>
                 )}

                <h2 className="font-orbitron text-lg font-bold text-[var(--text-primary)]">
                   {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
                </h2>

                {applicants.length > 0 ? (
                    <div className="space-y-2">
                        {applicants.map(dj => (
                            <ApplicantCard
                                key={dj.id}
                                dj={dj}
                                isBooked={gig.bookedDjId === dj.id}
                                isGigOpen={gig.status === 'Open'}
                                onBook={handleOpenConfirmation}
                                isBooking={bookingDjId === dj.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[var(--text-muted)] pt-10">
                        <p>No one has expressed interest in this gig yet.</p>
                    </div>
                )}
            </div>
            
            {confirmingDj && (
                <ConfirmationModal 
                    dj={confirmingDj}
                    onConfirm={handleConfirmBooking}
                    onCancel={() => setConfirmingDj(null)}
                    isBooking={bookingDjId === confirmingDj.id}
                />
            )}
        </div>
    );
};