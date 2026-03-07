import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';

import { API_BASE_URL } from '../config/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session_expired') === '1';

  const isSignUpRoute = location.pathname === '/signup' || location.pathname === '/register';
  
  const [isLogin, setIsLogin] = useState(!isSignUpRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update mode when route changes
  useEffect(() => {
    setIsLogin(!isSignUpRoute);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  }, [isSignUpRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin && (!email.trim() || !password)) {
      setError('Please enter your email and password.');
      return;
    }
    if (!isLogin && (!email.trim() || !password || !name.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6 && !isLogin) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        let data: { accessToken?: string; user?: { role?: string }; message?: string } = {};
        try {
          data = await response.json();
        } catch {
          data = { message: 'Invalid response from server' };
        }

        if (response.ok) {
          localStorage.setItem('userToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user?.role === 'admin') {
            window.location.href = 'http://localhost:5174';
          } else {
            const redirect = new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirect);
          }
        } else {
          setError(data.message || 'Invalid credentials. Please try again.');
        }
      } else {
        // Register
        const registerData: any = {
          email,
          password,
          name,
        };

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });

        let data: { accessToken?: string; user?: { role?: string }; message?: string } = {};
        try {
          data = await response.json();
        } catch {
          data = { message: 'Invalid response from server' };
        }

        if (response.ok) {
          localStorage.setItem('userToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user?.role === 'admin') {
            window.location.href = 'http://localhost:5174';
          } else {
            const redirect = new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirect);
          }
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
      <GlobalHeader />
      
      <div className="flex items-center justify-center min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-neutral-border-gray/40">
          <div className="text-center mb-8">
            <h1 className="text-h1 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-body text-neutral-medium-gray">
              {isLogin ? 'Sign in to continue to EverStays' : 'Sign up to start booking amazing stays'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {sessionExpired && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
                Your session expired. Please sign in again to continue.
              </div>
            )}
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
                    className="w-full pl-10 pr-4 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral focus:outline-none focus:ring-2 focus:ring-primary-coral transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                    autoComplete="name"
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral focus:outline-none focus:ring-2 focus:ring-primary-coral transition-all"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-body font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral focus:outline-none focus:ring-2 focus:ring-primary-coral transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium-gray hover:text-neutral-charcoal"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-caption text-neutral-medium-gray">Remember me</span>
                </label>
                <div className="flex items-center gap-3">
                  <Link
                    to="/forgot-password"
                    className="text-caption text-primary-coral hover:underline"
                  >
                    Forgot password?
                  </Link>
                  <button
                    type="button"
                    disabled
                    title="Mobile OTP login coming soon"
                    className="text-caption text-neutral-medium-gray cursor-default hover:no-underline"
                  >
                    Login with OTP
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-body text-neutral-medium-gray">
              {isLogin 
                ? "Don't have an account? "
                : 'Already have an account? '}
              {isLogin ? (
                <Link
                  to="/signup"
                  className="text-primary-coral font-medium hover:underline"
                >
                  Sign Up
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="text-primary-coral font-medium hover:underline"
                >
                  Sign In
                </Link>
              )}
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-border-gray" />
              </div>
              <div className="relative flex justify-center text-caption">
                <span className="px-2 bg-white text-neutral-medium-gray">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              disabled
              title="Google sign-in coming soon"
              className="mt-4 w-full py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium text-neutral-medium-gray cursor-not-allowed opacity-60"
            >
              Google (Coming soon)
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
