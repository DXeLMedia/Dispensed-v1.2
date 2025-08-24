
import React, { useEffect, useState } from 'react';
import { Gig, Business, Role } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { IconMapPin, IconClock } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GigCard = ({ gig, onInterestSent }: { gig: Gig; onInterestSent: (gigId: string) => void; }) => {
  const [venue, setVenue] = useState<Business | undefined>(undefined);
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  useEffect(() => {
    api.getBusinessById(gig.venueId).then(setVenue);
  }, [gig.venueId]);

  const handleExpressInterest = async () => {
    if (!user || user.role !== Role.DJ || isSending || interestSent) return;

    setIsSending(true);
    const success = await api.expressInterestInGig(gig.id, user.id);
    setIsSending(false);

    if (success) {
      setInterestSent(true);
      // Wait for animation before removing from list
      setTimeout(() => {
        onInterestSent(gig.id);
      }, 1500);
    } else {
      alert("Failed to express interest. Please try again.");
    }
  };

  if (!venue) {
      return <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-64 animate-pulse" />;
  }

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-lime-400 transition-colors duration-200 relative overflow-hidden ${interestSent ? 'animate-fade-out-slow' : 'animate-pop-in'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-orbitron text-lg font-bold text-white">{gig.title}</h3>
           <Link to={`/profile/${venue.id}`} className="text-sm text-lime-400 font-semibold hover:underline">{venue.venueName}</Link>
        </div>
        <div className="text-right">
            <p className="text-lg font-bold text-white">R{gig.budget.toLocaleString()}</p>
            <p className="text-xs text-zinc-400">Budget</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-zinc-300">
        <div className="flex items-center gap-2">
          <IconMapPin size={16} className="text-zinc-500" />
          <span>{venue.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconClock size={16} className="text-zinc-500" />
          <span>{new Date(gig.date).toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })} at {gig.time}</span>
        </div>
        <div className="pt-2">
          <p className="text-zinc-400 text-sm leading-relaxed">{gig.description}</p>
        </div>
      </div>
       <div className="mt-4 flex flex-wrap gap-2">
            {gig.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-zinc-800 text-lime-300 text-xs font-semibold rounded-full">{genre}</span>
            ))}
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-800">
            <button
                onClick={handleExpressInterest}
                className="w-full bg-lime-400 text-black font-bold py-2.5 rounded-lg hover:bg-lime-300 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                disabled={isSending || interestSent}
            >
                {isSending ? 'Sending...' : interestSent ? 'Interest Sent!' : 'Express Interest'}
            </button>
        </div>
    </div>
  );
};

const Header = () => (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 border-b border-zinc-800">
      <h1 className="font-orbitron text-xl font-bold text-white text-center">Available Gigs</h1>
    </div>
);


export const Gigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (user?.id) {
        Promise.all([
            api.getGigs(),
            api.getInterestedGigsForDj(user.id),
            api.getBookedGigsForDj(user.id),
        ]).then(([allGigs, interestedGigs, bookedGigs]) => {
            const openGigs = allGigs.filter(g => g.status === 'Open');
            const interestedIds = interestedGigs.map(g => g.id);
            const bookedIds = bookedGigs.map(g => g.id);
            // Don't show gigs the user is already interested in or booked for.
            const gigsToShow = openGigs.filter(g => !interestedIds.includes(g.id) && !bookedIds.includes(g.id));
            setGigs(gigsToShow);
            setLoading(false);
        });
    }
  }, [user]);

  const handleInterestSent = (gigIdToRemove: string) => {
      setGigs(currentGigs => currentGigs.filter(g => g.id !== gigIdToRemove));
  };

  return (
    <div className="text-white min-h-full">
      <Header />
      {loading ? (
        <div className="pt-20">
          <Spinner />
        </div>
      ) : (
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
          {gigs.length > 0 ? (
            gigs.map(gig => <GigCard key={gig.id} gig={gig} onInterestSent={handleInterestSent} />)
          ) : (
            <p className="col-span-1 md:col-span-2 text-center text-zinc-400 pt-10">No new gigs available right now. Check back soon!</p>
          )}
        </div>
      )}
    </div>
  );
};
