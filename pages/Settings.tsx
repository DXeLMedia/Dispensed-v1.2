import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconPalette, IconLogOut, IconChevronRight } from '../constants';

const SettingRow = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-left">
        <div className="mr-4 text-lime-400">{icon}</div>
        <div className="flex-1">
            <p className="text-white font-bold">{title}</p>
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
        <IconChevronRight className="text-zinc-500" size={20}/>
    </button>
)

export const Settings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleThemeSelect = () => {
        alert("Theme selection coming soon!");
    }

    return (
        <div className="text-white min-h-full">
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-4"><IconArrowLeft size={22} /></button>
                <h1 className="font-orbitron text-xl font-bold text-white">Settings</h1>
            </div>

            <div className="p-4 space-y-4">
                 <div className="space-y-2">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase px-2">Appearance</h2>
                    <SettingRow
                        icon={<IconPalette size={24} />}
                        title="Theme"
                        subtitle="Electric Blue"
                        onClick={handleThemeSelect}
                    />
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase px-2">Account</h2>
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
