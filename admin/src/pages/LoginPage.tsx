import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import AdminFooter from '../components/common/AdminFooter';

import { API_BASE_URL } from '../config/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        let data: { accessToken?: string; user?: { role?: string }; message?: string } = {};
        try {
          data = await response.json();
        } catch {
          data = { message: 'Invalid response from server' };
        }

        if (response.ok) {
          localStorage.setItem('userToken', data.accessToken || '');
          localStorage.setItem('user', JSON.stringify(data.user || {}));
          if (data.user?.role === 'admin') {
            navigate('/');
          } else {
            setError('This account is not authorized for admin access. Please use an admin account.');
          }
        } else {
          setError(data.message || 'Invalid credentials. Please try again.');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role: 'admin' }),
        });
        let data: { accessToken?: string; user?: object; message?: string } = {};
        try {
          data = await response.json();
        } catch {
          data = { message: 'Invalid response from server' };
        }

        if (response.ok) {
          localStorage.setItem('userToken', data.accessToken || '');
          localStorage.setItem('user', JSON.stringify(data.user || {}));
          navigate('/');
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen pt-24 px-4 pb-20">
        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-neutral-border-gray/40">
            <div className="text-center mb-8">
              <h1 className="text-h1 mb-2">{isLogin ? 'Admin Login' : 'Admin Sign Up'}</h1>
              <p className="text-body text-neutral-medium-gray">
                {isLogin ? 'Login to access the admin dashboard' : 'Sign up to manage properties and bookings'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-body font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-coral"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-body font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-coral"
                    placeholder="admin@everstays.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-body font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-coral"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

          </div>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
}
