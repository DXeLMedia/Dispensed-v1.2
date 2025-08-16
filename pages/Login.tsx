import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail: string) => {
    if (!loginEmail) return;
    setError('');
    setLoading(true);
    try {
      await login(loginEmail);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="font-orbitron text-4xl font-bold text-white mb-2">DISPENSED</h1>
            <p className="text-lime-400 font-semibold">CAPE TOWN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com or use demo"
              className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
              required
            />
          </div>
          <div>
            <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                    Password
                </label>
                <span className="text-xs text-zinc-500">(any password)</span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-lime-400 hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-lime-500 disabled:bg-zinc-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-zinc-400">Or use a demo account</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button onClick={() => handleLogin('doublex@test.com')} disabled={loading} className="w-full bg-zinc-800 text-white font-bold py-2 px-4 rounded-md hover:bg-zinc-700 transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">Log in as DJ</button>
                <button onClick={() => handleLogin('modular@test.com')} disabled={loading} className="w-full bg-zinc-800 text-white font-bold py-2 px-4 rounded-md hover:bg-zinc-700 transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">Log in as Venue/Event Brand</button>
                 <button onClick={() => handleLogin('listener@test.com')} disabled={loading} className="w-full bg-zinc-800 text-white font-bold py-2 px-4 rounded-md hover:bg-zinc-700 transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60">Log in as Listener</button>
            </div>
        </div>
      </div>
    </div>
  );
};