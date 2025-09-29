

import React from 'react';
import { NavLink, useNavigate, useMatch, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import {
  IconHome,
  IconSearch,
  IconProfile,
  IconMessages,
  IconBriefcase,
  IconTrophy,
  IconMusic,
  IconLogOut,
  IconList,
  IconDashboard,
} from '../constants';
import { Avatar } from './Avatar';


// --- Mobile Bottom Navigation ---

const MobileNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const match = useMatch({ path: to, end: true });
    const className = `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
        match ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;
    
    return (
        <Link to={to} className={className}>
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
};

const DJNavMobile = () => (
  <>
    <MobileNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
    <MobileNavItem to="/gigs" icon={<IconBriefcase size={22} />} label="My Gigs" />
    <MobileNavItem to="/find-gigs" icon={<IconMusic size={22} />} label="Find Gigs" />
    <MobileNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
    <MobileNavItem to="/profile/me" icon={<IconProfile size={22} />} label="Profile" />
  </>
);

const BusinessNavMobile = () => (
    <>
        <MobileNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <MobileNavItem to="/venue/gigs" icon={<IconBriefcase size={22} />} label="Gigs" />
        <MobileNavItem to="/discover" icon={<IconSearch size={22} />} label="Find DJs" />
        <MobileNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <MobileNavItem to="/profile/me" icon={<IconProfile size={22} />} label="Profile" />
    </>
);

const ListenerNavMobile = () => (
    <>
        <MobileNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <MobileNavItem to="/discover" icon={<IconSearch size={22} />} label="Discover" />
        <MobileNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <MobileNavItem to="/leaderboard" icon={<IconTrophy size={22} />} label="Ranks" />
        <MobileNavItem to="/profile/me" icon={<IconProfile size={22} />} label="Profile" />
    </>
)

const AdminNavMobile = () => (
  <>
    <MobileNavItem to="/admin/dashboard" icon={<IconDashboard size={22} />} label="Dashboard" />
    <MobileNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
    <MobileNavItem to="/discover" icon={<IconSearch size={22} />} label="Discover" />
    <MobileNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
    <MobileNavItem to="/profile/me" icon={<IconProfile size={22} />} label="Profile" />
  </>
);


export const BottomNav = () => {
  const { role } = useAuth();

  const renderNav = () => {
      switch (role) {
          case Role.DJ: return <DJNavMobile />;
          case Role.Business: return <BusinessNavMobile />;
          case Role.Listener: return <ListenerNavMobile />;
          case Role.Admin: return <AdminNavMobile />;
          default: return null;
      }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 h-16 bg-[var(--surface-1)] border-t border-[var(--border)] z-50 md:hidden">
      {renderNav()}
    </nav>
  );
};


// --- Tablet/Desktop Side Navigation ---

const DesktopNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => 
            `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] ${
                isActive ? 'bg-[var(--accent)] text-[var(--accent-text)] font-bold' : ''
            }`
        }
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

const DJNavDesktop = () => (
    <>
        <DesktopNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <DesktopNavItem to="/gigs" icon={<IconBriefcase size={22} />} label="My Gigs" />
        <DesktopNavItem to="/media-manager" icon={<IconList size={22} />} label="Media Manager" />
        <DesktopNavItem to="/find-gigs" icon={<IconMusic size={22} />} label="Find Gigs" />
        <DesktopNavItem to="/discover" icon={<IconSearch size={22} />} label="Find DJs" />
        <DesktopNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <DesktopNavItem to="/leaderboard" icon={<IconTrophy size={22} />} label="Leaderboard" />
    </>
);

const BusinessNavDesktop = () => (
    <>
        <DesktopNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <DesktopNavItem to="/venue/gigs" icon={<IconBriefcase size={22} />} label="My Gigs" />
        <DesktopNavItem to="/discover" icon={<IconSearch size={22} />} label="Find DJs" />
        <DesktopNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <DesktopNavItem to="/leaderboard" icon={<IconTrophy size={22} />} label="Leaderboard" />
    </>
);

const ListenerNavDesktop = () => (
    <>
        <DesktopNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <DesktopNavItem to="/discover" icon={<IconSearch size={22} />} label="Discover" />
        <DesktopNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <DesktopNavItem to="/leaderboard" icon={<IconTrophy size={22} />} label="Leaderboard" />
    </>
);

const AdminNavDesktop = () => (
    <>
        <DesktopNavItem to="/admin/dashboard" icon={<IconDashboard size={22} />} label="Dashboard" />
        <DesktopNavItem to="/feed" icon={<IconHome size={22} />} label="Feed" />
        <DesktopNavItem to="/discover" icon={<IconSearch size={22} />} label="Discover" />
        <DesktopNavItem to="/messages" icon={<IconMessages size={22} />} label="Inbox" />
        <DesktopNavItem to="/leaderboard" icon={<IconTrophy size={22} />} label="Leaderboard" />
    </>
);


export const SideNav = () => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNav = () => {
      switch (role) {
          case Role.DJ: return <DJNavDesktop />;
          case Role.Business: return <BusinessNavDesktop />;
          case Role.Listener: return <ListenerNavDesktop />;
          case Role.Admin: return <AdminNavDesktop />;
          default: return null;
      }
  }
  
  return (
    <nav className="hidden md:flex flex-col w-64 bg-[var(--surface-1)] p-4 border-r border-[var(--border)] flex-shrink-0">
      <div className="font-orbitron text-2xl font-bold text-[var(--text-primary)] mb-8 px-2">
        <span className="text-[var(--accent)]">D</span>ISk_onnctd
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        {renderNav()}
      </div>

      {user && (
         <div className="mt-auto">
            <div className="p-3 bg-[var(--surface-2)] rounded-lg flex items-center gap-3">
              <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
              <div className="flex-1 overflow-hidden">
                <NavLink to="/profile/me" className="text-[var(--text-primary)] font-bold text-sm truncate hover:underline">{user.name}</NavLink>
                <p className="text-[var(--text-secondary)] text-xs truncate capitalize">{user.role}</p>
              </div>
            </div>
             <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 mt-2 rounded-lg text-[var(--text-secondary)] hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <IconLogOut size={22} />
                <span className="text-sm font-medium">Logout</span>
             </button>
         </div>
      )}
    </nav>
  );
};