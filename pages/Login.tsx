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

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    if (!loginEmail) return;
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="font-orbitron text-4xl font-bold text-[var(--text-primary)] mb-2">DISk_onnctd</h1>
            <p className="text-[var(--accent)] font-semibold">CAPE TOWN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com or use demo"
              className="mt-1 block w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>
          <div>
            <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                    Password
                </label>
                <span className="text-xs text-[var(--text-muted)]">(any password)</span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-[var(--accent-text)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[var(--accent)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--background)] text-[var(--text-secondary)]">Or use a demo account</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button onClick={() => handleLogin('doublex@test.com', 'password')} disabled={loading} className="w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-2 px-4 rounded-md hover:bg-[var(--border)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">Log in as DJ</button>
                <button onClick={() => handleLogin('modular@test.com', 'password')} disabled={loading} className="w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-2 px-4 rounded-md hover:bg-[var(--border)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">Log in as Venue/Event Brand</button>
                 <button onClick={() => handleLogin('listener@test.com', 'password')} disabled={loading} className="w-full bg-[var(--surface-2)] text-[var(--text-primary)] font-bold py-2 px-4 rounded-md hover:bg-[var(--border)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">Log in as Listener</button>
            </div>
        </div>
      </div>
    </div>
  );
};