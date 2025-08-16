import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';

export const SelectRole = () => {
  const [role, setRole] = useState<Role>(Role.Listener);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, selectRole } = useAuth(); // selectRole will be added to AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('No user session found. Please log in again.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await selectRole(user.id, role);
      navigate('/'); // Redirect to home page after role selection
    } catch (err: any) {
      setError(err.message || 'Failed to select role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="font-orbitron text-3xl font-bold text-white mb-2">One Last Step</h1>
            <p className="text-lime-400 font-semibold">CHOOSE YOUR ROLE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-center text-zinc-300 mb-4">Welcome, {user?.name}! To complete your profile, please select your role on the platform.</p>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-400">I am a...</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              <option value={Role.Listener}>Listener</option>
              <option value={Role.DJ}>DJ</option>
              <option value={Role.Business}>Venue/Event Brand</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-lime-400 hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-lime-500 disabled:bg-zinc-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};
