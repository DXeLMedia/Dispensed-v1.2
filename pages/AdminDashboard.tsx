
import React, { useEffect, useState, useMemo } from 'react';
import { DJ, Business, Gig, Role, UserProfile } from '../types';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { Avatar } from '../components/Avatar';
// FIX: Replaced non-existent IconUsers with IconConnections to resolve import error.
import { IconConnections, IconMusic, IconBuilding, IconBriefcase, IconTrash, IconChevronRight } from '../constants';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { usePersistence } from '../hooks/usePersistence';

const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: string | number, colorClass: string }) => (
    <div className="bg-[var(--surface-1)] p-4 rounded-lg flex items-center gap-4 border border-[var(--border)]">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-orbitron font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-sm text-[var(--text-secondary)]">{title}</p>
        </div>
    </div>
);

const UserTable = ({ users, onDeleteClick }: { users: UserProfile[], onDeleteClick: (user: UserProfile) => void }) => (
    <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="bg-[var(--surface-2)] text-[var(--text-secondary)] uppercase">
                <tr>
                    <th scope="col" className="px-4 py-3">User</th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">Role</th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">Location/Rating</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                        <td className="px-4 py-2">
                            <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                                <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                                <span className="font-bold text-[var(--text-primary)] whitespace-nowrap">{user.name}</span>
                            </Link>
                        </td>
                        <td className="px-4 py-2 text-[var(--text-secondary)] capitalize hidden md:table-cell">{user.role}</td>
                        <td className="px-4 py-2 text-[var(--text-secondary)] hidden md:table-cell">
                            {(user.role === Role.DJ || user.role === Role.Business) ? `${user.location} / ${user.rating.toFixed(1)}⭐` : 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                            <button onClick={() => onDeleteClick(user)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                                <IconTrash size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const GigTable = ({ gigs, venues, onDeleteClick }: { gigs: Gig[], venues: Record<string, Business>, onDeleteClick: (gig: Gig) => void }) => (
     <div className="bg-[var(--surface-1)] rounded-lg border border-[var(--border)] overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="bg-[var(--surface-2)] text-[var(--text-secondary)] uppercase">
                <tr>
                    <th scope="col" className="px-4 py-3">Title</th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">Venue</th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">Date</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {gigs.map(gig => (
                    <tr key={gig.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                        <td className="px-4 py-2 font-bold text-[var(--text-primary)]">{gig.title}</td>
                        <td className="px-4 py-2 text-[var(--text-secondary)] hidden md:table-cell">{venues[gig.business_user_id]?.name || '...'}</td>
                        <td className="px-4 py-2 text-[var(--text-secondary)] hidden md:table-cell">{gig.date}</td>
                        <td className="px-4 py-2"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/50 text-blue-300">{gig.status}</span></td>
                        <td className="px-4 py-2">
                             <button onClick={() => onDeleteClick(gig)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                                <IconTrash size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalDjs: 0, totalVenues: 0, openGigs: 0 });
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [venues, setVenues] = useState<Record<string, Business>>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'gigs'>('users');
    const { showToast } = usePersistence();

    const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [gigToDelete, setGigToDelete] = useState<Gig | null>(null);
    const [isDeletingGig, setIsDeletingGig] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const [djs, businesses, allGigs] = await Promise.all([
            api.getDJs(),
            api.getBusinesses(),
            api.getGigs(),
        ]);
        
        const allUsers = [...djs, ...businesses];
        setUsers(allUsers);
        setGigs(allGigs);
        
        const venueMap = businesses.reduce((acc, v) => {
            acc[v.id] = v;
            return acc;
        }, {} as Record<string, Business>);
        setVenues(venueMap);

        setStats({
            totalUsers: allUsers.length,
            totalDjs: djs.length,
            totalVenues: businesses.length,
            openGigs: allGigs.filter(g => g.status === 'Open').length
        });
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeletingUser(true);
        const success = await api.deleteUser(userToDelete.id);
        if (success) {
            showToast(`User ${userToDelete.name} deleted.`, 'success');
            fetchData();
        } else {
            showToast('Failed to delete user.', 'error');
        }
        setIsDeletingUser(false);
        setUserToDelete(null);
    };
    
    const confirmDeleteGig = async () => {
        if (!gigToDelete) return;
        setIsDeletingGig(true);
        const success = await api.deleteGig(gigToDelete.id);
        if (success) {
            showToast(`Gig ${gigToDelete.title} deleted.`, 'success');
            fetchData();
        } else {
            showToast('Failed to delete gig.', 'error');
        }
        setIsDeletingGig(false);
        setGigToDelete(null);
    };

    if (loading) return <div className="pt-20"><Spinner /></div>

    return (
        <div className="text-[var(--text-primary)] min-h-full p-4 space-y-6">
            <h1 className="font-orbitron text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<IconConnections size={24} />} title="Total Users" value={stats.totalUsers} colorClass="bg-blue-500/20 text-blue-400" />
                <StatCard icon={<IconMusic size={24} />} title="Total DJs" value={stats.totalDjs} colorClass="bg-lime-500/20 text-lime-400" />
                <StatCard icon={<IconBuilding size={24} />} title="Total Venues" value={stats.totalVenues} colorClass="bg-purple-500/20 text-purple-400" />
                <StatCard icon={<IconBriefcase size={24} />} title="Open Gigs" value={stats.openGigs} colorClass="bg-yellow-500/20 text-yellow-400" />
            </div>

            <div>
                <div className="flex border-b border-[var(--border)] mb-4">
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 font-bold ${activeTab === 'users' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>Users</button>
                    <button onClick={() => setActiveTab('gigs')} className={`px-4 py-2 font-bold ${activeTab === 'gigs' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>Gigs</button>
                </div>
                {activeTab === 'users' ? (
                    <UserTable users={users} onDeleteClick={setUserToDelete} />
                ) : (
                    <GigTable gigs={gigs} venues={venues} onDeleteClick={setGigToDelete} />
                )}
            </div>

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message={<>Are you sure you want to permanently delete <strong className="text-[var(--text-primary)]">{userToDelete?.name}</strong>? This will remove all their associated data (gigs, posts, etc.) and cannot be undone.</>}
                isConfirming={isDeletingUser}
            />
            <ConfirmationModal
                isOpen={!!gigToDelete}
                onClose={() => setGigToDelete(null)}
                onConfirm={confirmDeleteGig}
                title="Delete Gig"
                message={<>Are you sure you want to permanently delete the gig <strong className="text-[var(--text-primary)]">{gigToDelete?.title}</strong>? This action cannot be undone.</>}
                isConfirming={isDeletingGig}
            />
        </div>
    )
}
