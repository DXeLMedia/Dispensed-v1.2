import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Role } from '../types';

const GoogleIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="google"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C327 113.7 290.5 96 248 96c-88.8 0-160.1 71.9-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
    />
  </svg>
);

export const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>(Role.DJ);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim(), role);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to sign up. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(role);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to sign in with Google.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Role;
    if (Object.values(Role).includes(value)) {
      setRole(value);
    } else {
      setError('Invalid role selected.');
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-[var(--text-primary)] mb-2">
            Join DISk_onnctd
          </h1>
          <p className="text-[var(--accent)] font-semibold">CAPE TOWN</p>
        </div>

        {success ? (
          <div className="text-center bg-[var(--surface-1)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--accent)]">
              Account Created!
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Please check your email to confirm your account and log in.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block w-full py-2 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--border)]"
            >
              Back to Log In
            </Link>
          </div>
        ) : (
        
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name or DJ Alias"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-[var(--text-secondary)]"
                >
                  I am a...
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                  <option value={Role.DJ}>DJ</option>
                  <option value={Role.Business}>Venue / Event Brand</option>
                  <option value={Role.Listener}>Listener</option>
                </select>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--background)] text-[var(--text-secondary)]">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 text-sm font-medium bg-[var(--surface-2)] text-[var(--text-primary)] rounded-md hover:bg-[var(--border)] transition-colors"
                  >
                  
                  <GoogleIcon /> Sign up with Google
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="text-[var(--text-secondary)]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  Log In
                </Link>
              </p>
            </div>
          
        )};
        
      </div>
    </div>
  );
};
