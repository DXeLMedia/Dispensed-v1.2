import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, DJ, Business, Notification } from '../types';
import * as api from '../services/mockApi'; // Keep for non-auth features like notifications
import { createClient } from '@supabase/supabase-js';

// --- Supabase Initialization ---
const supabaseUrl = 'https://lkxebvjbbskdbhkfgdip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreGVidmpiYnNrZGJoa2ZnZGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTE3NjIsImV4cCI6MjA2OTUyNzc2Mn0.GBZ3yCa17dTAT-yDMgKfLuIQEtbB8qYENab9ppN4224';
const supabase = createClient(supabaseUrl, supabaseKey);


type FullUser = (User | DJ | Business) & { user_type?: Role, needsRoleSelection?: boolean };

const API_URL = ''; // Use relative paths for Vercel deployment

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  googleSignIn: () => Promise<void>;
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
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
             const { data: profile } = await supabase
                .from('user_profile_view')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setUser(profile as FullUser);
        }
        setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        if (currentUser) {
            const { data: profile } = await supabase
                .from('user_profile_view')
                .select('*')
                .eq('id', currentUser.id)
                .single();
            setUser(profile as FullUser);
        } else {
            setUser(null);
        }
        setIsLoading(false); // Also keep here for live updates
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const signup = async (name: string, email: string, password: string, role: Role) => {
    const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, redirectTo: window.location.origin }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
    }
    // Auth state change will handle setting the user.
    alert('Sign up successful! Please check your email to verify your account.');
  };

  const login = async (email: string, password?: string) => {
      // Allow demo login without password (legacy)
      if (!password) {
          const authenticatedUser = await api.authenticate(email);
          if (authenticatedUser) {
              setUser(authenticatedUser);
          } else {
              throw new Error('User not found');
          }
          return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      // Auth state change will handle setting the user.
  };

  const googleSignIn = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
              redirectTo: window.location.origin,
          },
      });
      if (error) throw new Error('Could not sign in with Google');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };
  
  const updateUser = (updatedUser: FullUser) => {
    setUser(updatedUser);
  };
  
  const markNotificationsAsRead = async () => {
    if (user && unreadCount > 0) {
        await api.markAllAsRead(user.id);
        await refreshNotifications();
    }
  };

  const value = {
    user,
    role: user?.user_type ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    googleSignIn,
    updateUser,
    notifications,
    unreadCount,
    refreshNotifications,
    markNotificationsAsRead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};