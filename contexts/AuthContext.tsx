
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
  signUp: (email: string, password: string, name: string, role: Role) => Promise<void>;
  signInWithGoogle: (role?: Role) => Promise<void>;
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
    // In a real app with session persistence, you'd check for a session token here.
    // For this mock-based app, we just start fresh on every load.
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
    const profile = await api.authenticate(email, password);
    if (profile) {
        setUser(profile as FullUser);
    } else {
        throw new Error('Invalid login credentials');
    }
  };

  const logout = () => {
    closePlayer(); // Reset media player state
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    document.documentElement.className = 'theme-dark'; // Reset to default on logout
  };

  const signUp = async (email: string, password: string, name: string, role: Role) => {
    const { error } = await api.signUpWithEmail(email, password, name, role);
    if (error) {
        throw error;
    }
    // Don't log in automatically; user needs to confirm email.
  };

  const signInWithGoogle = async (role?: Role) => {
    const { error } = await api.signInWithGoogle(role);
    if (error) {
        throw error;
    }
    // Supabase handles the redirect from here.
  };
  
  const updateUser = (updatedUser: FullUser) => {
    setUser(updatedUser);
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
        updateUser(updatedUser as FullUser);
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
    signUp,
    signInWithGoogle,
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
