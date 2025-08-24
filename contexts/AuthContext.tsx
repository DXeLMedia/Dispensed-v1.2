import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, DJ, Business, Notification } from '../types';
import * as api from '../services/mockApi'; // Keep for non-auth features like notifications

type FullUser = (User | DJ | Business) & { needsRoleSelection?: boolean };

const API_URL = '';

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  googleLogin: (name: string, email: string) => Promise<void>;
  selectRole: (userId: string, role: Role) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
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
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('dispensed-dj-user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const handleAuthResponse = (authenticatedUser: FullUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('dispensed-dj-user', JSON.stringify(authenticatedUser));
  };

  const signup = async (name: string, email: string, password: string, role: Role) => {
    const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
    }

    const newUser = await response.json();
    // Set user in state so VerifyEmail page can access their info
    setUser(newUser);
  };

  const login = async (email: string, password?: string) => {
      // Allow demo login without password
      if (!password) {
          const authenticatedUser = await api.authenticate(email);
          if (authenticatedUser) {
              handleAuthResponse(authenticatedUser);
              return;
          } else {
              throw new Error('User not found');
          }
      }

      const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
      }

      const authenticatedUser = await response.json();
      handleAuthResponse(authenticatedUser);
  };

  const googleLogin = async (name: string, email: string) => {
      const response = await fetch(`${API_URL}/api/google-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
      });

       if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Google Sign-Up failed');
      }

      const authenticatedUser = await response.json();
      handleAuthResponse(authenticatedUser);
  }

  const selectRole = async (userId: string, role: Role) => {
    const response = await fetch(`${API_URL}/api/users/${userId}/select-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
    });

     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to select role');
    }

    const updatedUser = await response.json();
    handleAuthResponse(updatedUser);
  };

  const verifyUser = async (userId: string) => {
      const response = await fetch(`${API_URL}/api/users/${userId}/verify`, {
          method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
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
    isAuthenticated: !!user && !user.needsRoleSelection,
    isLoading,
    login,
    logout,
    signup,
    googleLogin,
    selectRole,
    verifyUser,
    updateUser,
    notifications,
    unreadCount,
    refreshNotifications,
    markNotificationsAsRead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};