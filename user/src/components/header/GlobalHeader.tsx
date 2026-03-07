import { useState, useEffect, useRef } from 'react';
import { Menu, User, Home, X, LogIn, UserCircle, HelpCircle, LogOut, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '../../config/api';

export default function GlobalHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [userLoginData, setUserLoginData] = useState({ email: '', password: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserLoginModal, setShowUserLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem('userToken');

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };
    loadUserData();
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/stays' || path === '/') return 'stays';
    if (path === '/experiences') return 'experiences';
    if (path === '/offers') return 'offers';
    if (path === '/support') return 'support';
    return null;
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (showUserLoginModal || showSettingsDropdown) {
      document.body.style.overflow = showUserLoginModal ? 'hidden' : 'unset';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showUserLoginModal, showSettingsDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(e.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };
    if (showSettingsDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsDropdown]);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userLoginData.email,
          password: userLoginData.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setShowUserLoginModal(false);
        setUserLoginData({ email: '', password: '' });
        window.location.reload();
      } else {
        const err = await response.json();
        alert(err.message || 'Invalid credentials');
      }
    } catch {
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setShowSettingsDropdown(false);
    window.location.reload();
  };

  const userSettingsMenuItems = isLoggedIn
    ? [
        { id: 'profile', label: 'Profile', icon: UserCircle, link: '/?profile=true' },
        { id: 'dashboard', label: 'My Trips', icon: Home, link: '/dashboard' },
        { id: 'help', label: 'Help & Support', icon: HelpCircle, link: '/support' },
        { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
      ]
    : [
        { id: 'login', label: 'Sign In', icon: LogIn, action: 'login' },
        { id: 'signup', label: 'Sign Up', icon: UserCircle, link: '/signup' },
        { id: 'help', label: 'Help & Support', icon: HelpCircle, link: '/support' },
      ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-beige-light shadow-md border-b border-neutral-border-gray">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.png" alt="EverStays" className="w-10 h-10 object-contain" />
              <span className="text-body text-primary-coral font-medium">EverStays</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-body text-neutral-charcoal transition-colors relative pb-1 ${
                  activeTab === 'stays' ? 'text-primary-coral font-medium' : 'hover:text-primary-coral'
                }`}
              >
                Home page
                {activeTab === 'stays' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral" />}
              </Link>
              <Link
                to="/experiences"
                className={`text-body text-neutral-charcoal transition-colors relative pb-1 ${
                  activeTab === 'experiences' ? 'text-primary-coral font-medium' : 'hover:text-primary-coral'
                }`}
              >
                Experiences
                {activeTab === 'experiences' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral" />}
              </Link>
              <Link
                to="/offers"
                className={`text-body text-neutral-charcoal transition-colors relative pb-1 ${
                  activeTab === 'offers' ? 'text-primary-coral font-medium' : 'hover:text-primary-coral'
                }`}
              >
                Offers
                {activeTab === 'offers' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral" />}
              </Link>
              <Link
                to="/support"
                className={`text-body text-neutral-charcoal transition-colors relative pb-1 ${
                  activeTab === 'support' ? 'text-primary-coral font-medium' : 'hover:text-primary-coral'
                }`}
              >
                Support
                {activeTab === 'support' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral" />}
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-neutral-border-gray bg-white flex items-center justify-center hover:shadow-md transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-neutral-charcoal" /> : <Menu className="w-5 h-5 text-neutral-charcoal" />}
              </button>

              <div className="relative" ref={settingsDropdownRef}>
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="w-10 h-10 rounded-full border border-neutral-border-gray bg-white flex items-center justify-center hover:shadow-md transition-all overflow-hidden"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-neutral-charcoal" />
                  )}
                </button>

                <AnimatePresence>
                  {showSettingsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-border-gray overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {isLoggedIn && currentUser && (
                          <div className="px-4 py-3 border-b border-neutral-border-gray bg-white/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary-coral/10 flex items-center justify-center overflow-hidden">
                                {currentUser.avatar ? (
                                  <img src={currentUser.avatar} alt={currentUser.name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                  <UserCircle className="w-6 h-6 text-primary-coral" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-body font-semibold text-neutral-charcoal truncate">{currentUser.name || 'User'}</h3>
                                <p className="text-caption text-neutral-medium-gray truncate">{currentUser.email}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {userSettingsMenuItems.map((item) => {
                          const Icon = item.icon;
                          if (item.action === 'logout') {
                            return (
                              <button
                                key={item.id}
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-body text-neutral-charcoal hover:bg-beige/30 transition-colors text-left border-t border-neutral-border-gray mt-1"
                              >
                                <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                <span>{item.label}</span>
                              </button>
                            );
                          }
                          if (item.action === 'login') {
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setShowSettingsDropdown(false);
                                  setShowUserLoginModal(true);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-body text-neutral-charcoal hover:bg-beige/30 transition-colors text-left"
                              >
                                <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                <span>{item.label}</span>
                              </button>
                            );
                          }
                          return (
                            <Link
                              key={item.id}
                              to={item.link!}
                              onClick={() => setShowSettingsDropdown(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-body text-neutral-charcoal hover:bg-beige/30 transition-colors"
                            >
                              <Icon className="w-5 h-5 text-neutral-medium-gray" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-neutral-border-gray shadow-lg lg:hidden">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-body py-2 ${activeTab === 'stays' ? 'text-primary-coral font-medium' : 'text-neutral-charcoal hover:text-primary-coral'}`}>Home page</Link>
              <Link to="/experiences" onClick={() => setIsMobileMenuOpen(false)} className={`text-body py-2 ${activeTab === 'experiences' ? 'text-primary-coral font-medium' : 'text-neutral-charcoal hover:text-primary-coral'}`}>Experiences</Link>
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className={`text-body py-2 ${activeTab === 'offers' ? 'text-primary-coral font-medium' : 'text-neutral-charcoal hover:text-primary-coral'}`}>Offers</Link>
              <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className={`text-body py-2 ${activeTab === 'support' ? 'text-primary-coral font-medium' : 'text-neutral-charcoal hover:text-primary-coral'}`}>Support</Link>
              <div className="border-t border-neutral-border-gray pt-4">
                {userSettingsMenuItems.map((item) => {
                  const Icon = item.icon;
                  if (item.action === 'logout') {
                    return (
                      <button key={item.id} onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral text-left">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  if (item.action === 'login') {
                    return (
                      <button key={item.id} onClick={() => { setIsMobileMenuOpen(false); setShowUserLoginModal(true); }} className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral text-left">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link key={item.id} to={item.link!} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      )}

      <AnimatePresence>
        {showUserLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowUserLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 relative"
            >
              <button onClick={() => setShowUserLoginModal(false)} className="absolute top-4 right-4 text-neutral-medium-gray hover:text-neutral-charcoal">
                <X className="w-5 h-5" />
              </button>
              <div className="mb-6">
                <h3 className="text-h1 text-neutral-charcoal mb-2 font-bold">Sign In</h3>
                <p className="text-body text-neutral-medium-gray">Login to access your account</p>
              </div>
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">Email</label>
                  <input
                    type="email"
                    value={userLoginData.email}
                    onChange={(e) => setUserLoginData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userLoginData.password}
                      onChange={(e) => setUserLoginData((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                      className="w-full p-3 pr-12 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium-gray hover:text-neutral-charcoal" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setShowUserLoginModal(false)} className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-beige/30">
                    Cancel
                  </button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 px-4 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold">
                    <span className="flex items-center justify-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </span>
                  </motion.button>
                </div>
                <p className="text-body text-neutral-medium-gray text-center mt-4">
                  Don't have an account? <Link to="/signup" onClick={() => setShowUserLoginModal(false)} className="text-primary-coral font-medium hover:underline">Sign Up</Link>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
