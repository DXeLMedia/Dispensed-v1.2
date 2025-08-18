
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, DJ, Business, Notification, UserSettings, Listener } from '../types';
import * as api from '../services/mockApi';
import { useMediaPlayer } from './MediaPlayerContext';

type FullUser = User | DJ | Business | Listener;

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: FullUser) => void;
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  theme: UserSettings['theme'];
  updateTheme: (newTheme: UserSettings['theme']) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getLeanUser = (user: FullUser): FullUser => {
    if (user.role === Role.DJ) {
        // Create a copy and remove large arrays to prevent localStorage quota issues.
        // These are fetched on-demand in the profile/media manager pages anyway.
        const leanDJ = { ...user };
        delete (leanDJ as Partial<DJ>).tracks;
        delete (leanDJ as Partial<DJ>).mixes;
        return leanDJ;
    }
    return user;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { closePlayer } = useMediaPlayer();
  const [theme, setTheme] = useState<UserSettings['theme']>('electric_blue');

  const refreshNotifications = useCallback(async () => {
    if (user) {
        const notifs = await api.getNotifications(user.id);
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
    } else {
        setNotifications([]);
        setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('dispensed-dj-user');
    if (storedUser) {
      try {
        if (storedUser === 'undefined') {
          throw new Error('Stored user is the literal string "undefined"');
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('dispensed-dj-user');
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage, clearing invalid data:", error);
        localStorage.removeItem('dispensed-dj-user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const currentTheme = user?.settings?.theme || 'electric_blue';
    setTheme(currentTheme);
    document.documentElement.className = currentTheme === 'cyber_glow' ? 'theme-light' : 'theme-dark';
  }, [user]);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const login = async (email: string, password: string) => {
    const authenticatedUser = await api.authenticate(email, password);
    if (authenticatedUser) {
      const leanUser = getLeanUser(authenticatedUser);
      setUser(leanUser);
      localStorage.setItem('dispensed-dj-user', JSON.stringify(leanUser));
    } else {
      throw new Error('User not found');
    }
  };

  const logout = () => {
    closePlayer(); // Reset media player state
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('dispensed-dj-user');
    document.documentElement.className = 'theme-dark'; // Reset to default on logout
  };
  
  const updateUser = (updatedUser: FullUser) => {
    const leanUser = getLeanUser(updatedUser);
    setUser(leanUser);
    localStorage.setItem('dispensed-dj-user', JSON.stringify(leanUser));
  };

  const updateTheme = async (newTheme: UserSettings['theme']) => {
    if (user) {
        setTheme(newTheme);
        document.documentElement.className = newTheme === 'cyber_glow' ? 'theme-light' : 'theme-dark';
        await api.updateUserSettings(user.id, { theme: newTheme });
        const updatedUser = { 
            ...user, 
            settings: { ...user.settings, theme: newTheme } as UserSettings
        };
        updateUser(updatedUser);
    }
  };
  
  const markNotificationsAsRead = async () => {
    if (user && unreadCount > 0) {
        await api.markAllAsRead(user.id);
        await refreshNotifications();
    }
  };


  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    notifications,
    unreadCount,
    refreshNotifications,
    markNotificationsAsRead,
    theme,
    updateTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};