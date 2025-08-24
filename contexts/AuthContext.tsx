import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';


interface AuthContextType {
  user: FullUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;

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
    theme,
    updateTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
