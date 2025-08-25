

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Gig, Role, Business } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { PageSpinner } from '../components/Spinner';
import { IconMoreVertical, IconChevronLeft, IconChevronRight, IconCalendar, IconClock, IconStickyNote, IconSearch } from '../constants';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const GigCard = ({ gig, venue, isHighlighted, highlightedRef }: { gig: Gig; venue?: Business; isHighlighted?: boolean; highlightedRef?: React.RefObject<HTMLDivElement> }) => {
    let statusText: string;
    let statusStyle: string;

    switch(gig.status) {
        case 'Booked':
            statusText = 'Confirmed';
            statusStyle = 'bg-lime-900/50 border-lime-500/30 text-lime-300';
            break;
        case 'Completed':
            statusText = 'Completed';
            statusStyle = 'bg-purple-900/50 border-purple-500/30 text-purple-300';
            break;
        default: // 'Open' for interested gigs
            statusText = 'Pending';
            statusStyle = 'bg-yellow-900/50 border-yellow-500/30 text-yellow-300';
    }

    return (
        <div ref={highlightedRef} className={`p-4 rounded-xl bg-zinc-900 transition-all duration-500 ${isHighlighted ? 'ring-2 ring-lime-400 shadow-lg shadow-lime-400/20' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                {venue ? (
                    <Link to={`/profile/${venue.id}`}>
                        <h3 className="font-bold text-lg text-white hover:underline">{venue.venueName}</h3>
                    </Link>
                ) : (
                    <h3 className="font-bold text-lg text-white">...</h3>
                )}
                <div className={`px-3 py-1 text-xs font-bold rounded-full border ${statusStyle}`}>
                    {statusText}
                </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                <IconClock size={16} />
                <span>{gig.time}</span>
            </div>

            {gig.description && gig.description !== 'Past gig.' && (
                <div className="flex items-start gap-2 text-sm text-amber-300 bg-amber-900/40 px-3 py-2 rounded-lg mb-4">
                    <IconStickyNote size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{gig.description}</span>
                </div>
            )}

            <div className="flex justify-end items-center">
                 <p className="font-orbitron text-xl font-bold text-lime-400">R{gig.budget.toLocaleString()}</p>
            </div>
        </div>
    );
};


export const MyGigs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const highlightedRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date('2025-08-01'));
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
    
    const [bookedGigs, setBookedGigs] = useState<Gig[]>([]);
    const [interestedGigs, setInterestedGigs] = useState<Gig[]>([]);
    const [completedGigs, setCompletedGigs] = useState<Gig[]>([]);
    const [venues, setVenues] = useState<Record<string, Business>>({});

    const highlightedGigId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('highlight');
    }, [location.search]);

    useEffect(() => {
        if (!user || user.role !== Role.DJ) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const [booked, interested, completed] = await Promise.all([
                api.getBookedGigsForDj(user.id),
                api.getInterestedGigsForDj(user.id),
                api.getCompletedGigsForDj(user.id),
            ]);
            setBookedGigs(booked);
            setInterestedGigs(interested);
            setCompletedGigs(completed);

            const allGigs = [...booked, ...interested, ...completed];
            const venueIds = [...new Set(allGigs.map(g => g.venueId))];
            if (venueIds.length > 0) {
                 const venueData = await Promise.all(venueIds.map(id => api.getBusinessById(id)));
                 const venueMap = venueData.reduce((acc, v) => {
                    if (v) acc[v.id] = v;
                    return acc;
                }, {} as Record<string, Business>);
                setVenues(venueMap);
            }
            
            setLoading(false);
        };
        fetchData();
    }, [user, navigate]);

    const monthGigs = useMemo(() => {
        const interestedWithStatus = interestedGigs.map(g => ({ ...g, status: 'Open' as const }));
        const bookedWithStatus = bookedGigs.map(g => ({ ...g, status: 'Booked' as const }));
        const completedWithStatus = completedGigs.map(g => ({ ...g, status: 'Completed' as const }));
        
        return [...interestedWithStatus, ...bookedWithStatus, ...completedWithStatus].filter(gig => {
            const gigDate = new Date(gig.date);
            return gigDate.getFullYear() === currentMonth.getFullYear() &&
                   gigDate.getMonth() === currentMonth.getMonth();
        });
    }, [bookedGigs, interestedGigs, completedGigs, currentMonth]);
    
    const filteredMonthGigs = useMemo(() => {
        if (filter === 'all') return monthGigs;
        if (filter === 'confirmed') return monthGigs.filter(g => g.status === 'Booked' || g.status === 'Completed');
        if (filter === 'pending') return monthGigs.filter(g => g.status === 'Open');
        return [];
    }, [monthGigs, filter]);

    const stats = useMemo(() => {
        const confirmedGigs = monthGigs.filter(g => g.status === 'Booked' || g.status === 'Completed');
        const pendingGigs = monthGigs.filter(g => g.status === 'Open');
        
        const confirmedEarnings = confirmedGigs.reduce((sum, gig) => sum + gig.budget, 0);
        const potentialEarnings = pendingGigs.reduce((sum, gig) => sum + gig.budget, 0);

        let earnings: number;
        let earningsLabel: string;
        let earningsColor: string;

        if (filter === 'pending') {
            earnings = potentialEarnings;
            earningsLabel = 'Potential';
            earningsColor = 'text-yellow-400';
        } else if (filter === 'confirmed') {
            earnings = confirmedEarnings;
            earningsLabel = 'Confirmed';
            earningsColor = 'text-green-400';
        } else { // filter === 'all'
            earnings = confirmedEarnings + potentialEarnings;
            earningsLabel = 'Total Projected';
            earningsColor = 'text-white';
        }

        return {
            total: monthGigs.length,
            confirmed: confirmedGigs.length,
            pending: pendingGigs.length,
            earnings,
            earningsLabel,
            earningsColor,
        };
    }, [monthGigs, filter]);

    const groupedGigs = useMemo(() => {
        const sorted = [...filteredMonthGigs].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.reduce((acc, gig) => {
            const date = new Date(gig.date).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(gig);
            return acc;
        }, {} as Record<string, Gig[]>);
    }, [filteredMonthGigs]);

    useEffect(() => {
        if (highlightedGigId && highlightedRef.current) {
            // Small delay to ensure the element is painted and in the DOM
            setTimeout(() => {
                highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [highlightedGigId, groupedGigs]); // Depend on groupedGigs to re-run if data changes

    const changeMonth = (amount: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const monthYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

    if (loading) return <PageSpinner />;
    
    return (
        <div className="text-white min-h-full bg-black">
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <button onClick={() => changeMonth(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white"><IconChevronLeft size={24} /></button>
                    <h2 className="font-orbitron text-2xl font-bold tracking-wider">{monthYearFormat.format(currentMonth).toUpperCase()}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 -mr-2 text-zinc-400 hover:text-white"><IconChevronRight size={24} /></button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 divide-y-0 md:divide-x divide-zinc-700 text-center">
                    <div className="pr-2 col-span-1">
                        <p className="font-orbitron text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-zinc-400">Total Gigs</p>
                    </div>
                    <div className="md:px-2 col-span-1">
                        <p className="font-orbitron text-2xl font-bold text-lime-400">{stats.confirmed}</p>
                        <p className="text-xs text-zinc-400">Confirmed</p>
                    </div>
                    <div className="md:px-2 col-span-1">
                        <p className="font-orbitron text-2xl font-bold text-yellow-400">{stats.pending}</p>
                        <p className="text-xs text-zinc-400">Pending</p>
                    </div>
                    <div className="md:pl-2 col-span-1">
                        <p className={`font-orbitron text-2xl font-bold ${stats.earningsColor}`}>R{stats.earnings.toLocaleString()}</p>
                        <p className="text-xs text-zinc-400">{stats.earningsLabel}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    { (['all', 'pending', 'confirmed'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`flex-1 p-2.5 rounded-full font-bold text-sm transition-colors duration-200 ${filter === f ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                           <span className="capitalize">{f}</span> <span className={`text-xs opacity-75 px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-black/20' : 'bg-zinc-700'}`}>{f === 'all' ? stats.total : f === 'pending' ? stats.pending : stats.confirmed}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-4 pb-20">
                    {Object.entries(groupedGigs).map(([dateStr, gigsOnDate]) => (
                        <div key={dateStr}>
                             <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-zinc-300">{new Date(dateStr+'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                                <div className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full flex items-center gap-1.5">
                                    <IconCalendar size={12} /> {gigsOnDate.length} {gigsOnDate.length === 1 ? 'gig' : 'gigs'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {gigsOnDate.map(gig => (
                                    <GigCard 
                                        key={gig.id} 
                                        gig={gig} 
                                        venue={venues[gig.venueId]}
                                        isHighlighted={gig.id === highlightedGigId}
                                        highlightedRef={gig.id === highlightedGigId ? highlightedRef : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                     {Object.keys(groupedGigs).length === 0 && !loading && (
                        <div className="text-center pt-8">
                            <p className="text-zinc-500">No {filter !== 'all' ? filter : ''} gigs for {monthYearFormat.format(currentMonth)}.</p>
                        </div>
                     )}
                </div>
            </div>
            <Link to="/find-gigs" title="Find New Gigs" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-lime-400 text-black p-4 rounded-full shadow-lg shadow-lime-500/30 z-30 hover:bg-lime-300 transition-all transform hover:scale-110">
                <IconSearch size={28} />
            </Link>
        </div>
    );
};
