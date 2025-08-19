import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { IconArrowLeft, IconPalette, IconLogOut, IconChevronRight, IconProfile, IconDownload, IconBriefcase } from '../constants';
import * as api from '../services/mockApi';
import { Spinner } from '../components/Spinner';
import { usePersistence } from '../hooks/usePersistence';

const SettingRow = ({ icon, title, subtitle, onClick, disabled = false }: { icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void, disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center p-4 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed">
        <div className="mr-4 text-[var(--accent)]">{icon}</div>
        <div className="flex-1">
            <p className="text-[var(--text-primary)] font-bold">{title}</p>
            {subtitle && <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
        <IconChevronRight className="text-[var(--text-muted)]" size={20}/>
    </button>
)

export const Settings = () => {
    const { logout, user, theme, updateTheme } = useAuth();
    const { showToast } = usePersistence();
    const navigate = useNavigate();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleEditProfile = () => {
        navigate('/profile/me?edit=true');
    }

    const handleDownloadUsers = () => {
        const userList = api.userList;
        const headers = ['id', 'name', 'email', 'role'];
        const csvRows = [
            headers.join(','), 
            ...userList.map(user => 
                [user.id, `"${user.name.replace(/"/g, '""')}"`, user.email, user.role].join(',')
            )
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'user_list.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSeedDatabase = async () => {
        if (window.confirm("Are you sure you want to seed the database? This will delete all existing data in the 'djs', 'businesses', 'tracks', and 'playlists' tables and replace it with mock data.")) {
            setIsSeeding(true);
            try {
                await api.seedDatabase();
                showToast('Database seeded! Your data is now published.');
            } catch (error) {
                console.error("Seeding failed:", error);
                showToast(`Seeding failed: ${(error as Error).message}`, 'error');
            } finally {
                setIsSeeding(false);
            }
        }
    };

    return (
        <div className="text-[var(--text-primary)] min-h-full">
            <div className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-sm p-4 flex items-center border-b border-[var(--border)]">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold">Settings</h1>
            </div>

            <div className="p-4 space-y-6">
                 <div className="space-y-2">
                    <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase px-2">Profile</h2>
                     <SettingRow 
                        icon={<IconProfile size={24} />}
                        title="Edit Profile"
                        subtitle="Update your name, bio, socials, and avatar"
                        onClick={handleEditProfile}
                    />
                     <Link to="/profile/me" className="w-full flex items-center p-4 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] rounded-lg transition-colors text-left">
                        <div className="mr-4 text-[var(--accent)]"><IconProfile size={24}/></div>
                        <div className="flex-1">
                            <p className="text-[var(--text-primary)] font-bold">View My Profile</p>
                        </div>
                        <IconChevronRight className="text-[var(--text-muted)]" size={20}/>
                     </Link>
                </div>

                 <div className="space-y-2">
                    <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase px-2">Appearance</h2>
                    <div className="p-4 bg-[var(--surface-1)] rounded-lg">
                        <p className="text-[var(--text-primary)] font-bold mb-3 flex items-center gap-2"><IconPalette size={20} /> Theme</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => updateTheme('electric_blue')} 
                                className={`p-3 font-bold rounded-lg border-2 transition-colors ${theme !== 'cyber_glow' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'}`}>
                                Dark
                            </button>
                            <button 
                                onClick={() => updateTheme('cyber_glow')} 
                                className={`p-3 font-bold rounded-lg border-2 transition-colors ${theme === 'cyber_glow' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'}`}>
                                Light
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase px-2">Developer</h2>
                    <SettingRow
                        icon={isSeeding ? <Spinner /> : <IconBriefcase size={24} />}
                        title={isSeeding ? "Seeding Database..." : "Seed Database"}
                        subtitle="Populate DB with mock data. Deletes existing data."
                        onClick={handleSeedDatabase}
                        disabled={isSeeding}
                    />
                     <SettingRow 
                        icon={<IconDownload size={24} />}
                        title="Export User List"
                        subtitle="Download a CSV of all 400+ mock users with their login emails for easy testing."
                        onClick={handleDownloadUsers}
                    />
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase px-2">Account</h2>
                     <SettingRow 
                        icon={<IconLogOut size={24} />}
                        title="Logout"
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
};
