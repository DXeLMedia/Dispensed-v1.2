import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';


type FullUser = (User | DJ | Business) & { user_type?: Role, needsRoleSelection?: boolean };

const API_URL = ''; // Use relative paths for Vercel deployment

interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

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
    refreshNotifications();
  }, [user, refreshNotifications]);


    }
    // Auth state change will handle setting the user.
    alert('Sign up successful! Please check your email to verify your account.');
  


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
