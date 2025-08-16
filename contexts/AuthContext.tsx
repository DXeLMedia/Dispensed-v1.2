
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, DJ, Business, Notification } from '../types';
import * as api from '../services/mockApi';

type FullUser = User | DJ | Business;

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: FullUser) => void;
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
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
    refreshNotifications();
  }, [user, refreshNotifications]);

  const login = async (email: string) => {
    const authenticatedUser = await api.authenticate(email);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem('dispensed-dj-user', JSON.stringify(authenticatedUser));
    } else {
      throw new Error('User not found');
    }
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('dispensed-dj-user');
  };
  
  const updateUser = (updatedUser: FullUser) => {
    setUser(updatedUser);
    localStorage.setItem('dispensed-dj-user', JSON.stringify(updatedUser));
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};