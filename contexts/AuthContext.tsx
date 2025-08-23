import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, Role, DJ, Business, Notification, Message, Review, Post } from '../types';
import * as api from '../services/mockApi';
import { useMediaPlayer } from './MediaPlayerContext';

type FullUser = UserProfile; // Simplified for now
type Theme = 'electric_blue' | 'cyber_glow';

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
  theme: Theme;
  updateTheme: (newTheme: Theme) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { closePlayer } = useMediaPlayer();
  const [theme, setTheme] = useState<Theme>('electric_blue');

  const refreshNotifications = useCallback(async () => {
    if (user) {
        const notifs = await api.getNotifications(user.user_id);
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.is_read).length);
    } else {
        setNotifications([]);
        setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    // In a real app, you would check for a session here.
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Theme is now a UI-only feature
    document.documentElement.className = theme === 'cyber_glow' ? 'theme-light' : 'theme-dark';
  }, [theme]);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const login = async (email: string, password: string) => {
    const profile = await api.authenticate(email, password);
    if (profile) {
        setUser(profile);
    } else {
        throw new Error('Invalid login credentials');
    }
  };

  const logout = () => {
    closePlayer();
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    document.documentElement.className = 'theme-dark';
  };
  
  const updateUser = (updatedUser: FullUser) => {
    setUser(updatedUser);
  };

  const updateTheme = async (newTheme: Theme) => {
    // This is now a UI-only feature as the backend does not support user settings.
    setTheme(newTheme);
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
