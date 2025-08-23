

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Notification as NotificationType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
import { IconArrowLeft, IconBookOpen, IconMessages, IconUserPlus, IconCalendar, IconCheckCircle2, IconXCircle, IconComment, IconRepeat } from '../constants';

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'booking_request':
            return <IconBookOpen className="text-lime-400 mt-1" size={20}/>;
        case 'message':
            return <IconMessages className="text-blue-400 mt-1" size={20}/>;
        case 'new_follower':
            return <IconUserPlus className="text-pink-400 mt-1" size={20}/>;
        case 'event_update':
             return <IconCalendar className="text-purple-400 mt-1" size={20}/>;
        case 'booking_confirmed':
             return <IconCheckCircle2 className="text-green-400 mt-1" size={20}/>;
        case 'gig_filled':
             return <IconXCircle className="text-red-400 mt-1" size={20}/>;
        case 'new_comment':
             return <IconComment className="text-teal-400 mt-1" size={20}/>;
        case 'repost':
            return <IconRepeat className="text-green-400 mt-1" size={20}/>;
        default:
            return <IconBookOpen className="text-gray-400 mt-1" size={20}/>;
    }
}

const getLinkForNotification = (notif: NotificationType): string => {
    switch(notif.notification_type) {
        case 'message':
            return notif.related_id ? `/messages/${notif.related_id}` : '/messages';
        case 'new_follower':
             return notif.related_id ? `/profile/${notif.related_id}` : '/feed';
        case 'booking_request': // For Venues
             return notif.related_id ? `/venue/gigs/${notif.related_id}/applicants` : '/venue/gigs';
        case 'booking_confirmed': // For DJs
            return notif.related_id ? `/gigs?highlight=${notif.related_id}` : '/gigs';
        case 'gig_filled': // For DJs
            return '/discover'; // Go back to finding gigs
        case 'new_comment':
        case 'repost':
            return notif.related_id ? `/post/${notif.related_id}` : '/feed';
        default:
            return '#';
    }
}

export const Notifications = () => {
    const navigate = useNavigate();
    const { notifications, isLoading, unreadCount, markNotificationsAsRead, refreshNotifications } = useAuth();

    useEffect(() => {
        // Initial fetch is handled by AuthContext, but we might want to refresh
        // when navigating to this page to get the latest.
        refreshNotifications();

        // When the user views the page, mark notifications as read after a short delay.
        const timer = setTimeout(() => {
            if (unreadCount > 0) {
                markNotificationsAsRead();
            }
        }, 1000);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="text-white min-h-full">
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">Notifications</h1>
            </div>
            {isLoading && notifications.length === 0 ? <div className="pt-20"><Spinner /></div> : (
                <div className="divide-y divide-zinc-800">
                    {notifications.length > 0 ? notifications.map(notif => (
                        <Link to={getLinkForNotification(notif)} key={notif.id} className={`p-4 flex gap-4 hover:bg-zinc-800 transition-colors ${!notif.read ? 'bg-lime-900/40' : ''}`}>
                            <NotificationIcon type={notif.type} />
                            <div className="flex-1">
                                <p className="text-zinc-200">{notif.text}</p>
                                <p className="text-xs text-zinc-400 mt-1">{notif.timestamp}</p>
                            </div>
                        </Link>
                    )) : <p className="text-center text-zinc-500 pt-20">No notifications yet.</p>}
                </div>
            )}
        </div>
    );
}