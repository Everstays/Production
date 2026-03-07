import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';

import { API_BASE_URL } from '../config/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        let text = data.message || 'If an account exists with this email, you will receive a password reset link.';
        if (data.resetToken) {
          text += ` For testing, use this link: ${window.location.origin}/reset-password?token=${data.resetToken}`;
        }
        setMessage({ type: 'success', text });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
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
            <h1 className="text-h2 text-neutral-charcoal mb-2">Forgot Password</h1>
            <p className="text-body text-neutral-medium-gray mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-body font-medium mb-2 text-neutral-charcoal">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  autoFocus
                />
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
