import React, { useEffect } from 'react';
import { IconCheckCircle2, IconXCircle } from '../constants';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const successStyles = 'bg-green-600 border-green-500';
  const errorStyles = 'bg-red-600 border-red-500';

  return (
    <div 
        className={`fixed top-5 right-1/2 translate-x-1/2 md:right-5 md:translate-x-0 z-[10000] p-4 rounded-xl text-white shadow-2xl shadow-black/30 border flex items-center gap-3 animate-pop-in ${type === 'success' ? successStyles : errorStyles}`}
        role="alert"
    >
        {type === 'success' ? <IconCheckCircle2 size={24} /> : <IconXCircle size={24} />}
        <span className="font-semibold">{message}</span>
    </div>
  );
};
