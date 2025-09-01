import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => localStorage.getItem('isDemoMode') === 'true');
  
  const toggleDemoMode = useCallback(() => {
    const newIsDemoMode = !isDemoMode;
    localStorage.setItem('isDemoMode', String(newIsDemoMode));
    setIsDemoMode(newIsDemoMode);

    // This is a bit of a hack to force a logout if the user toggles off demo mode while "logged in"
    // A better solution would involve a shared state or event bus.
    if (!newIsDemoMode) {
        // When switching to live mode, we should ensure no demo user is active.
        // We can't call useAuth().logout() here directly due to hook rules.
        // The AuthContext will listen for this change and handle the logout.
    }
  }, [isDemoMode]);

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'isDemoMode') {
            setIsDemoMode(event.newValue === 'true');
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, [])

  const value = {
    isDemoMode,
    toggleDemoMode,
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};