import { useContext } from 'react';
import { PersistenceContext } from '../contexts/PersistenceContext';

export const usePersistence = () => {
  const context = useContext(PersistenceContext);
  if (context === undefined) {
    throw new Error('usePersistence must be used within a PersistenceProvider');
  }
  return context;
};
