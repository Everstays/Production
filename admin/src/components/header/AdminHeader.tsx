import { useState, useEffect, useRef } from 'react';
import { Menu, User, X, LogOut, UserCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { USER_APP_URL } from '../../config/api';

export default function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem('userToken');

  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        setCurrentUser(userStr ? JSON.parse(userStr) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setShowDropdown(false);
    window.location.href = '/login';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-beige-light shadow-md border-b border-neutral-border-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EverStays Admin" className="w-10 h-10 object-contain" />
              <span className="text-body text-primary-coral font-medium">EverStays Admin</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-neutral-border-gray bg-white flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full border border-neutral-border-gray bg-white flex items-center justify-center overflow-hidden hover:shadow-md"
                  >
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-neutral-charcoal" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-border-gray py-2"
                      >
                        {currentUser && (
                          <div className="px-4 py-3 border-b border-neutral-border-gray">
                            <p className="text-body font-semibold truncate">{currentUser.name || 'Admin'}</p>
                            <p className="text-caption text-neutral-medium-gray truncate">{currentUser.email}</p>
                          </div>
                        )}
                        <Link to="/" className="flex items-center space-x-3 px-4 py-3 hover:bg-beige/30" onClick={() => setShowDropdown(false)}>
                          <UserCircle className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                        <a href={`${USER_APP_URL}/support`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-4 py-3 hover:bg-beige/30" onClick={() => setShowDropdown(false)}>
                          <HelpCircle className="w-5 h-5" />
                          <span>Support</span>
                        </a>
                        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-beige/30 text-left border-t">
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-beige-light border-b border-neutral-border-gray shadow-lg lg:hidden">
          <nav className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">Dashboard</Link>
            <a href={`${USER_APP_URL}/support`} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="block py-2">Support</a>
            {isLoggedIn && <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="block py-2 text-left w-full">Logout</button>}
          </nav>
        </div>
      )}
    </>
  );
}
