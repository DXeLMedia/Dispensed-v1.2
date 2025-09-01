
import React from 'react';
import { IconX, IconTrash } from '../constants';
import { Spinner } from './Spinner';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    isConfirming?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isConfirming = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-[var(--surface-1)] border-2 border-red-500 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-red-500/20 animate-pop-in text-center"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <IconTrash size={32} className="text-red-500" />
                    </div>
                </div>
                <h2 className="font-orbitron text-xl text-[var(--text-primary)]">{title}</h2>
                <div className="text-[var(--text-secondary)] my-4">{message}</div>
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] font-bold hover:bg-[var(--border)] transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isConfirming} className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:bg-red-900/50 disabled:cursor-not-allowed">
                        {isConfirming ? <div className="h-6 flex items-center justify-center"><Spinner/></div> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
