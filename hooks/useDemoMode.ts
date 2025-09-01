import { useContext } from 'react';
import { DemoModeContext } from '../contexts/DemoModeContext';

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};