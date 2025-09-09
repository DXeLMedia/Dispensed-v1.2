
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useDemoMode } from '../hooks/useDemoMode';
import { Role } from '../types';

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C327 113.7 290.5 96 248 96c-88.8 0-160.1 71.9-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
    </svg>
);

const DemoModeToggle = () => {
    const { isDemoMode, toggleDemoMode } = useDemoMode();
    return (
        <div className="flex items-center justify-center my-6">
            <label htmlFor="demo-toggle" className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-[var(--text-secondary)]">Live Mode</span>
                <div className="relative">
                    <input id="demo-toggle" type="checkbox" className="sr-only" checked={isDemoMode} onChange={toggleDemoMode} />
                    <div className="block bg-[var(--surface-2)] w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-[var(--accent)] w-6 h-6 rounded-full transition-transform ${isDemoMode ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-[var(--accent)]">Demo Mode</span>
            </label>
        </div>
    )
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle, demoLogin } = useAuth();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(); // No role needed on login
      // User will be redirected by Supabase
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: Role) => {
    setError('');
    setLoading(true);
    try {
        await demoLogin(role);
        navigate('/');
    } catch (err: any) {
        setError(err.message || 'Failed to perform demo login.');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="font-orbitron text-4xl font-bold text-[var(--text-primary)] mb-2">DISk_onnctd</h1>
            <p className="text-[var(--accent)] font-semibold">CAPE TOWN</p>
        </div>

        <DemoModeToggle />

        {isDemoMode ? (
            <div className="space-y-4 animate-fade-in">
                <p className="text-center text-sm text-[var(--text-secondary)]">Log in with a demo account to explore the app.</p>
                <button onClick={() => handleDemoLogin(Role.DJ)} disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Enter as Demo DJ'}
                </button>
                <button onClick={() => handleDemoLogin(Role.Business)} disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-50">
                     {loading ? 'Logging in...' : 'Enter as Demo Venue'}
                </button>
                 <button onClick={() => handleDemoLogin(Role.Listener)} disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-50">
                     {loading ? 'Logging in...' : 'Enter as Demo Listener'}
                </button>
                <button onClick={() => handleDemoLogin(Role.Admin)} disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-50">
                     {loading ? 'Logging in...' : 'Enter as Demo Admin'}
                </button>
            </div>
        ) : (
            <div className="animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@email.com" required className="mt-1 block w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
                </form>
                
                <div className="mt-6">
                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-[var(--background)] text-[var(--text-secondary)]">Or continue with</span></div></div>
                    <div className="mt-4">
                        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 text-sm font-medium bg-[var(--surface-2)] text-[var(--text-primary)] rounded-md hover:bg-[var(--border)] transition-colors">
                            <GoogleIcon /> Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        )}
        

        <div className="mt-8 text-center text-sm">
            <p className="text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Sign Up</Link>
            </p>
        </div>
      </div>
    </div>
  );
};
