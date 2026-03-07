import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';

import { API_BASE_URL } from '../config/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const [token, setToken] = useState(tokenFromUrl || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!token.trim()) {
      setMessage({ type: 'error', text: 'Reset token is required.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Password has been reset. You can now sign in.' });
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid or expired reset token.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GlobalHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-8">
            <h1 className="text-h2 text-neutral-charcoal mb-2">Reset Password</h1>
            <p className="text-body text-neutral-medium-gray mb-6">
              Enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!tokenFromUrl && (
                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">Reset Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the token from your email"
                    className="w-full p-3 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-body font-medium mb-2 text-neutral-charcoal">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full p-3 pr-12 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium-gray hover:text-neutral-charcoal" aria-label={showNewPassword ? 'Hide' : 'Show'}>
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-body font-medium mb-2 text-neutral-charcoal">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full p-3 pr-12 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium-gray hover:text-neutral-charcoal" aria-label={showConfirmPassword ? 'Hide' : 'Show'}>
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {message && (
                <div
                  className={`p-3 rounded-lg text-body ${
                    message.type === 'success' ? 'bg-accent-teal/10 text-accent-teal' : 'bg-white border border-neutral-border-gray text-neutral-charcoal'
                  }`}
                >
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/signin" className="text-body text-primary-coral hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
