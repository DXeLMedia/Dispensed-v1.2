
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, DJ, Business, Notification, UserSettings, Listener } from '../types';
import * as api from '../services/mockApi';
import { useMediaPlayer } from './MediaPlayerContext';
import { supabase } from '../services/supabaseClient';

type FullUser = User | DJ | Business | Listener;

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  const fetchUserProfile = useCallback(async (authUser: any): Promise<FullUser | null> => {
    if (!authUser) return null;

    // Step 1: Fetch the full user profile from the view via our simplified api call.
    let fullProfile: FullUser | undefined = await api.getUserById(authUser.id);

    // Step 2: If profile is missing, retry after a delay (for slow DB triggers/view updates).
    if (!fullProfile) {
        console.warn(`Profile not found for user ${authUser.id}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        fullProfile = await api.getUserById(authUser.id);
    }

    // Step 3: If still missing, attempt to "self-heal" by creating it from auth metadata.
    if (!fullProfile && authUser.user_metadata?.user_type) {
        console.warn(`Profile for ${authUser.id} is missing. Attempting self-healing.`);
        const createdBaseProfile = await api.createUserProfile(authUser);
        if (createdBaseProfile) {
            console.log(`Successfully self-healed profile for user ${authUser.id}. Refetching...`);
            // Wait for view to update
            await new Promise(resolve => setTimeout(resolve, 1500));
            fullProfile = await api.getUserById(authUser.id);
        }
    }

    // Step 4: If no profile exists after all attempts, the user cannot proceed.
    if (!fullProfile) {
        console.error(`FATAL: Could not find or create a user profile for ${authUser.id}.`);
        await supabase.auth.signOut();
        return null;
    }

    // Step 5: Success. Attach email from auth session and return the complete profile.
    // The view should already provide the email, but this is a safe fallback.
    if (!fullProfile.email) {
      fullProfile.email = authUser.email;
    }
    
    return fullProfile;
  }, []);


  useEffect(() => {
    // Run once on mount to get current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
        }
        setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
            setUser(null);
        } else if (session && (!user || user.id !== session.user.id)) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [user, fetchUserProfile]);


  useEffect(() => {
    const currentTheme = user?.settings?.theme || 'electric_blue';
    setTheme(currentTheme);
    document.documentElement.className = currentTheme === 'cyber_glow' ? 'theme-light' : 'theme-dark';
  }, [user]);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
    }

    if (!data.user) {
        throw new Error("Authentication failed. Please check your credentials.");
    }

    // Use the existing self-healing fetcher. This also handles the fatal error case.
    const profile = await fetchUserProfile(data.user);

    if (profile) {
      setUser(profile);
    } else {
      // fetchUserProfile will sign the user out, but we need to throw the error
      // to the login form to display a message.
      throw new Error('Login successful, but your profile could not be found. Please contact support.');
    }
  };

  const logout = async () => {
    closePlayer(); // Reset media player state
    await supabase.auth.signOut();
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirect the user back to the page they were on.
        // The onAuthStateChange listener will handle the session.
        redirectTo: window.location.origin,
        data: role ? { user_type: role } : undefined,
      } as any,
    });
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
