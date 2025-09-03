import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined
);

interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isDemoMode') === 'true';
    }
    return false;
  });

  const toggleDemoMode = useCallback(() => {
    const newIsDemoMode = !isDemoMode;
    localStorage.setItem('isDemoMode', String(newIsDemoMode));
    setIsDemoMode(newIsDemoMode);
  }, [isDemoMode]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isDemoMode') {
        setIsDemoMode(event.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
};
