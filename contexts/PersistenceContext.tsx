import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { persistenceService } from '../services/persistenceService';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface PersistenceContextType {
  isDirty: boolean;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

export const PersistenceContext = createContext<PersistenceContextType | undefined>(undefined);

interface PersistenceProviderProps {
  children: ReactNode;
}

export const PersistenceProvider: React.FC<PersistenceProviderProps> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(persistenceService.isDirty);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const unsubscribe = persistenceService.subscribe(setIsDirty);
    return () => unsubscribe();
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = {
    isDirty,
    toast,
    showToast,
    hideToast,
  };

  return <PersistenceContext.Provider value={value}>{children}</PersistenceContext.Provider>;
};
