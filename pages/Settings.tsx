import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { IconArrowLeft, IconPalette, IconLogOut, IconChevronRight, IconProfile } from '../constants';

const SettingRow = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] rounded-lg transition-colors text-left">
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
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleEditProfile = () => {
        navigate('/profile/me?edit=true');
    }

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