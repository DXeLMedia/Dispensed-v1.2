import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const VerifyEmail = () => {
  const { user, verifyUser } = useAuth(); // Assuming verifyUser will be added to AuthContext
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (user) {
      try {
        await verifyUser(user.id);
        alert('Verification successful! You can now log in.');
        navigate('/login');
      } catch (error) {
        alert('Verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-sm">
        <h1 className="font-orbitron text-3xl font-bold text-white mb-4">Verify Your Email</h1>
        <p className="text-zinc-300 mb-6">
          A verification email has been sent to <span className="text-lime-400">{user?.email || 'your email address'}</span>.
          Please check your inbox.
        </p>
        <p className="text-zinc-400 mb-8">
          (This is a simulation. Click the button below to verify your account instantly.)
        </p>
        <button
          onClick={handleVerification}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-lime-400 hover:bg-lime-300"
        >
          Simulate Email Verification Click
        </button>
      </div>
    </div>
  );
};
