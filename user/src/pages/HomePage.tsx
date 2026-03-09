import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, MapPin, Home, Umbrella, Menu, User, X, UserCheck, Car, Clock, Navigation, LogIn, RotateCcw, CheckCircle, FileText, CreditCard, Bell, Shield, HelpCircle, LogOut, UserCircle, AlertCircle, ChevronDown, Heart, Star, Settings, Download, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import CityDiscovery from '../components/city/CityDiscovery';
import FeaturedCategories from '../components/common/FeaturedCategories';
import PropertyGrid from '../components/property/PropertyGrid';
import { useWishlist } from '../hooks/useWishlist';
import OffersSection from '../components/offers/OffersSection';
import PlanMyTrip from '../components/common/PlanMyTrip';
import WhyStayHub from '../components/common/WhyStayHub';
import Footer from '../components/common/Footer';
import DatePicker from '../components/common/DatePicker';
import type { Property } from '../types';

import { API_BASE_URL } from '../config/api';
import { mapApiPropertyToFrontend } from '../utils/propertyUtils';

export default function HomePage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [featuredPropertiesError, setFeaturedPropertiesError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('stays');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCabRequestModal, setShowCabRequestModal] = useState(false);
  const [cabRequest, setCabRequest] = useState({
    pickupLocation: '',
    dropLocation: '',
    travelDate: '',
    travelTime: '',
    seatsPreference: '5 or 7',
    numberOfPeople: 1,
    propertyId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
  });
  const [cabRequestSubmitting, setCabRequestSubmitting] = useState(false);
  const [cabRequestSuccess, setCabRequestSuccess] = useState(false);
  const [cabRequestError, setCabRequestError] = useState('');
  const [cabProperties, setCabProperties] = useState<Property[]>([]);
  const [cabPropertiesLoading, setCabPropertiesLoading] = useState(false);
  const [showUserLoginModal, setShowUserLoginModal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [userLoginData, setUserLoginData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  
  // Search state
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');
  const [searchCheckIn, setSearchCheckIn] = useState<Date | null>(null);
  const [searchCheckOut, setSearchCheckOut] = useState<Date | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'checkin' | 'checkout' | null>(null);
  const [cities, setCities] = useState<Array<{ id: string; name: string; icon?: string; propertyCount: number }>>([]);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const checkOutButtonRef = useRef<HTMLButtonElement>(null);
  const [datePickerPosition, setDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [accountPhone, setAccountPhone] = useState('');
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [saveAccountMessage, setSaveAccountMessage] = useState('');

  // Hire a Guide search state
  const [guideLocation, setGuideLocation] = useState('');
  const [guideDate, setGuideDate] = useState<Date | null>(null);
  const [showGuideLocationDropdown, setShowGuideLocationDropdown] = useState(false);
  const [showGuideDatePicker, setShowGuideDatePicker] = useState(false);
  const [guideDatePickerPosition, setGuideDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const guideLocationDropdownRef = useRef<HTMLDivElement>(null);
  const guideDateButtonRef = useRef<HTMLButtonElement>(null);
  
  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
    
    // Listen for storage changes
    window.addEventListener('storage', loadUserData);
    
return () => {
    window.removeEventListener('storage', loadUserData);
    };
  }, []);

  // Prefill cab request guest details when modal opens and user is logged in
  useEffect(() => {
    if (showCabRequestModal && currentUser) {
      setCabRequest((p) => ({
        ...p,
        guestName: currentUser.name || p.guestName,
        guestEmail: currentUser.email || p.guestEmail,
      }));
    }
  }, [showCabRequestModal, currentUser?.id]);

  // Fetch all active properties for cab request dropdown (so newly added properties appear)
  useEffect(() => {
    if (!showCabRequestModal) return;
    setCabPropertiesLoading(true);
    fetch(`${API_BASE_URL}/properties?limit=200`)
      .then((res) => res.ok ? res.json() : { properties: [] })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.properties || data.data || []);
        setCabProperties(list.map((p: any) => mapApiPropertyToFrontend(p)));
      })
      .catch(() => setCabProperties([]))
      .finally(() => setCabPropertiesLoading(false));
  }, [showCabRequestModal]);

  // Fetch featured properties
  const fetchFeaturedProperties = async () => {
    setIsLoadingFeatured(true);
    setFeaturedPropertiesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/properties/featured?limit=12`);
      if (response.ok) {
        const data = await response.json();
        let raw: any[] = [];
        if (Array.isArray(data)) raw = data;
        else if (data && Array.isArray(data.properties)) raw = data.properties;
        setFeaturedProperties(raw.map((p: any) => mapApiPropertyToFrontend(p)));
      } else {
        setFeaturedPropertiesError('Unable to load featured properties. Please try again.');
        setFeaturedProperties([]);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setFeaturedPropertiesError('Unable to load featured properties. Please try again.');
      setFeaturedProperties([]);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  // Fetch cities for search dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cities`);
        if (response.ok) {
          const data = await response.json();
          setCities(Array.isArray(data) ? data : []);
        } else {
          console.error('Error fetching cities: HTTP', response.status, response.statusText);
          // Set empty array as fallback
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Set empty array as fallback so the UI doesn't break
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  // Handle search
  const handleSearch = async () => {
    // Clear previous errors
    setSearchError('');

    // Validate required fields
    if (!searchCity || searchCity.trim() === '') {
      setSearchError('Please select a destination');
      setShowCityDropdown(true);
      return;
    }

    if (!searchCheckIn) {
      setSearchError('Please select a check-in date');
      // Open date picker for check-in
      const checkInButton = checkInButtonRef.current;
      if (checkInButton) {
        const rect = checkInButton.getBoundingClientRect();
        setDatePickerPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
        setShowDatePicker('checkin');
      }
      return;
    }

    if (!searchCheckOut) {
      setSearchError('Please select a check-out date');
      // Open date picker for check-out
      const checkOutButton = checkOutButtonRef.current;
      if (checkOutButton) {
        const rect = checkOutButton.getBoundingClientRect();
        setDatePickerPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
        setShowDatePicker('checkout');
      }
      return;
    }

    // Validate date range
    if (searchCheckOut <= searchCheckIn) {
      setSearchError('Check-out date must be after check-in date');
      return;
    }

    // Close any open pickers/modals
    setShowDatePicker(null);
    setDatePickerPosition(null);
    setShowCityDropdown(false);

    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity.trim());
    if (searchCheckIn) params.set('checkIn', format(searchCheckIn, 'yyyy-MM-dd'));
    if (searchCheckOut) params.set('checkOut', format(searchCheckOut, 'yyyy-MM-dd'));
    
    // Navigate to /stays (SearchResultsPage) with search params
    const queryString = params.toString();
    const targetPath = `/stays${queryString ? `?${queryString}` : ''}`;
    
    // Navigate to dedicated search results page
    navigate(targetPath);
  };

  const handleGuideSearch = () => {
    const params = new URLSearchParams();
    if (guideLocation.trim()) params.set('location', guideLocation.trim());
    if (guideDate) params.set('date', format(guideDate, 'yyyy-MM-dd'));
    navigate(`/guides${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const isLoggedIn = !!localStorage.getItem('userToken');

  // Auto-open profile modal if profile query param is present
  useEffect(() => {
    if (searchParams.get('profile') === 'true' && isLoggedIn) {
      setShowUserProfileModal(true);
      // Remove the query param from URL
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, isLoggedIn, navigate, location.pathname]);

  // Load search params from URL (for initial state, but search happens on SearchResultsPage)
  useEffect(() => {
    if (location.pathname === '/') {
      const cityParam = searchParams.get('city');
      const checkInParam = searchParams.get('checkIn');
      const checkOutParam = searchParams.get('checkOut');
      
      if (cityParam) setSearchCity(cityParam);
      if (checkInParam) setSearchCheckIn(new Date(checkInParam));
      if (checkOutParam) setSearchCheckOut(new Date(checkOutParam));
    }
  }, [location.pathname, searchParams]);

  // Open cab tab when coming from /transport with ?section=cab
  useEffect(() => {
    if (searchParams.get('section') === 'cab') {
      setActiveTab('cab-facility');
    }
  }, [searchParams]);

  // Open Hire a Guide tab when coming from /guides with ?section=hire-guide
  useEffect(() => {
    if (searchParams.get('section') === 'hire-guide') {
      setActiveTab('hire-guide');
    }
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (guideLocationDropdownRef.current && !guideLocationDropdownRef.current.contains(event.target as Node)) {
        setShowGuideLocationDropdown(false);
      }
      if (showDatePicker) {
        // Close date picker if clicking outside
        const target = event.target as HTMLElement;
        if (!target.closest('[data-date-picker]') && 
            !checkInButtonRef.current?.contains(target) && 
            !checkOutButtonRef.current?.contains(target)) {
          setShowDatePicker(null);
          setDatePickerPosition(null);
        }
      }
      if (showGuideDatePicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-date-picker]') && !guideDateButtonRef.current?.contains(target)) {
          setShowGuideDatePicker(false);
          setGuideDatePickerPosition(null);
        }
      }
    };

    if (showCityDropdown || showDatePicker || showGuideLocationDropdown || showGuideDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Close date picker on scroll
    const handleScroll = () => {
      if (showDatePicker) {
        setShowDatePicker(null);
        setDatePickerPosition(null);
      }
      if (showGuideDatePicker) {
        setShowGuideDatePicker(false);
        setGuideDatePickerPosition(null);
      }
    };

    if (showDatePicker || showGuideDatePicker) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showCityDropdown, showDatePicker, showGuideDatePicker]);


  // Determine active nav based on current route
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/stays' || path === '/') return 'stays';
    if (path === '/experiences') return 'experiences';
    if (path === '/offers') return 'offers';
    if (path === '/support') return 'support';
    return 'stays';
  };

  const activeNav = getActiveNav();

  // Handle scroll for header background - switch to common header colour when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll(); // Check initial scroll position
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user login
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Refresh to update UI
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    if (showUserLoginModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showUserLoginModal]);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsDropdown]);

  // Fetch account profile when Account modal opens
  useEffect(() => {
    if (showUserProfileModal && isLoggedIn) {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      fetch(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((user) => {
          if (user) {
            setCurrentUser(user);
            setAccountPhone(user.phone || '');
          }
        })
        .catch(() => {});
    }
  }, [showUserProfileModal, isLoggedIn]);

  const handleSaveAccount = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setIsSavingAccount(true);
    setSaveAccountMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: accountPhone }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setSaveAccountMessage('Changes saved successfully!');
        setTimeout(() => setSaveAccountMessage(''), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveAccountMessage(err?.message || 'Failed to save. Please try again.');
      }
    } catch {
      setSaveAccountMessage('Network error. Please try again.');
    } finally {
      setIsSavingAccount(false);
    }
  };

  // User settings menu items - show login/signup when not logged in, otherwise show settings
  const userSettingsMenuItems = isLoggedIn ? [
    { id: 'profile', label: 'Account', icon: UserCircle, action: 'openProfile', subtitle: 'Settings & preferences' },
    { id: 'dashboard', label: 'My Trips', icon: Home, link: '/dashboard', subtitle: 'Bookings, saved properties & reviews' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, link: '/support' },
    { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
  ] : [
    { id: 'login', label: 'Sign In', icon: LogIn, action: 'login' },
    { id: 'signup', label: 'Sign Up', icon: UserCircle, link: '/signup' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, link: '/support' },
  ];

  const baseTabs = [
    { id: 'stays', label: 'Stays', icon: Home },
    { id: 'hire-guide', label: 'Hire a Guide', icon: UserCheck },
    { id: 'cab-facility', label: 'Request a cab', icon: Car },
  ];
  const tabIds = ['stays', 'hire-guide', 'cab-facility'];
  const [tabBadges, setTabBadges] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch(`${API_BASE_URL}/offers`)
      .then((r) => r.ok ? r.json() : [])
      .then((offers: Array<{ discount: number; discountType?: string }>) => {
        const arr = Array.isArray(offers) ? offers : [];
        const top5 = arr.slice(0, 5);
        const map: Record<string, string> = {};
        top5.forEach((o, i) => {
          if (i < tabIds.length) {
            const text = (o.discountType === 'percentage')
              ? `Upto ${o.discount}% Off`
              : `Up to ₹${Number(o.discount).toLocaleString()} OFF`;
            map[tabIds[i]] = text;
          }
        });
        setTabBadges(map);
      })
      .catch(() => {});
  }, []);
  const tabs = baseTabs.map((t) => ({ ...t, badge: tabBadges[t.id] || null }));

  return (
    <div>
      {/* Combined Hero + City Discovery Background - Flowing Design */}
      <div className="relative overflow-hidden">
        {/* Background Image with Cities - Extended to cover Hero + City Discovery sections */}
        <div className="absolute top-0 inset-x-0 h-[900px]">
          <img
            src="/kerala-background.png"
            alt="Kerala hill station - lush green mountains and winding road"
            className="w-full h-full object-cover"
          />
          {/* Flowing Gradient Overlay - Lighter for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-coral/5 via-transparent to-accent-teal/5"></div>
          {/* No solid block at bottom - landscape continues; FeaturedCategories below provides clean white transition */}
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-coral/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl"></div>
        </div>

      {/* Header Navigation - Common header colour (beige-light) when scrolled */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-beige-light shadow-md border-b border-neutral-border-gray'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EverStays" className="w-10 h-10 object-contain" />
              <span className="text-base sm:text-xl font-semibold text-primary-coral transition-colors">
                EverStays
              </span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {location.pathname === '/' ? (
                <span
                  className={`text-body transition-colors relative pb-1 cursor-default ${
                    activeNav === 'stays'
                      ? isScrolled
                        ? 'text-primary-coral font-semibold'
                        : 'text-primary-coral font-semibold drop-shadow-md'
                      : isScrolled
                      ? 'text-neutral-charcoal'
                      : 'text-neutral-light-gray drop-shadow-md'
                  }`}
                >
                  Home page
                  {activeNav === 'stays' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral"></span>
                  )}
                </span>
              ) : (
                <Link
                  to="/"
                  className={`text-body transition-colors relative pb-1 ${
                    activeNav === 'stays'
                      ? isScrolled
                        ? 'text-primary-coral font-semibold'
                        : 'text-primary-coral font-semibold drop-shadow-md'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-light-gray drop-shadow-md hover:text-primary-coral/80'
                  }`}
                >
                  Home page
                  {activeNav === 'stays' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral"></span>
                  )}
                </Link>
              )}
              <Link
                to="/experiences"
                className={`text-body transition-colors relative pb-1 ${
                  activeNav === 'experiences'
                    ? isScrolled
                      ? 'text-primary-coral font-semibold'
                      : 'text-primary-coral font-semibold drop-shadow-md'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-light-gray drop-shadow-md hover:text-primary-coral/80'
                }`}
              >
                Experiences
                {activeNav === 'experiences' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral"></span>
                )}
              </Link>
              <Link
                to="/offers"
                className={`text-body transition-colors relative pb-1 ${
                  activeNav === 'offers'
                    ? isScrolled
                      ? 'text-primary-coral font-semibold'
                      : 'text-primary-coral font-semibold drop-shadow-md'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-light-gray drop-shadow-md hover:text-primary-coral/80'
                }`}
              >
                Offers
                {activeNav === 'offers' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral"></span>
                )}
              </Link>
              <Link
                to="/support"
                className={`text-body transition-colors relative pb-1 ${
                  activeNav === 'support'
                    ? isScrolled
                      ? 'text-primary-coral font-semibold'
                      : 'text-primary-coral font-semibold drop-shadow-md'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-light-gray drop-shadow-md hover:text-primary-coral/80'
                }`}
              >
                Support
                {activeNav === 'support' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-coral"></span>
                )}
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden w-10 h-10 rounded-full border flex items-center justify-center hover:shadow-md transition-all ${
                  isScrolled
                    ? 'border-neutral-border-gray bg-white'
                    : 'border-white/50 bg-transparent backdrop-blur-sm'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-5 h-5 transition-colors ${
                    isScrolled ? 'text-neutral-charcoal' : 'text-neutral-light-gray'
                  }`} />
                ) : (
                  <Menu className={`w-5 h-5 transition-colors ${
                    isScrolled ? 'text-neutral-charcoal' : 'text-neutral-light-gray'
                  }`} />
                )}
              </button>
              
              {/* User Icon with Settings Dropdown */}
              <div className="relative" ref={settingsDropdownRef}>
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center hover:shadow-md transition-all overflow-hidden ${
                    isScrolled
                      ? 'border-neutral-border-gray bg-white'
                      : 'border-white/50 bg-transparent backdrop-blur-sm'
                  }`}
                >
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className={`w-5 h-5 transition-colors ${
                      isScrolled ? 'text-neutral-charcoal' : 'text-neutral-light-gray'
                    }`} />
                  )}
                </button>
                
                {/* Settings Dropdown Menu */}
                <AnimatePresence>
                  {showSettingsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-border-gray overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {/* User Info Header */}
                        {isLoggedIn && currentUser ? (
                          <div className="px-4 py-3 border-b border-neutral-border-gray bg-white/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary-coral/10 flex items-center justify-center overflow-hidden">
                                {currentUser.avatar ? (
                                  <img 
                                    src={currentUser.avatar} 
                                    alt={currentUser.name || 'User'} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCircle className="w-6 h-6 text-primary-coral" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-body font-semibold text-neutral-charcoal truncate">
                                  {currentUser.name || 'User'}
                                </h3>
                                <p className="text-caption text-neutral-medium-gray truncate">
                                  {currentUser.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-2 border-b border-neutral-border-gray">
                            <h3 className="text-body font-semibold text-neutral-charcoal">Settings</h3>
                          </div>
                        )}
                        {userSettingsMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isLogout = item.action === 'logout';
                          const isOpenProfile = item.action === 'openProfile';
                          const isLogin = item.action === 'login';
                          
                          if (isLogin) {
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setShowSettingsDropdown(false);
                                  setShowUserLoginModal(true);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-body text-neutral-charcoal hover:bg-white transition-colors text-left"
                              >
                                <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                <span>{item.label}</span>
                              </button>
                            );
                          }
                          if (isLogout) {
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setShowSettingsDropdown(false);
                                  localStorage.removeItem('userToken');
                                  localStorage.removeItem('user');
                                  setCurrentUser(null);
                                  navigate('/');
                                  window.location.reload();
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-body text-neutral-charcoal hover:bg-white transition-colors text-left border-t border-neutral-border-gray mt-1"
                              >
                                <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                <span>{item.label}</span>
                              </button>
                            );
                          }
                          
                          if (isOpenProfile) {
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setShowSettingsDropdown(false);
                                  setShowUserProfileModal(true);
                                }}
                                className="w-full flex flex-col items-start space-y-0.5 px-4 py-3 text-body text-neutral-charcoal hover:bg-white transition-colors text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {item.subtitle && (
                                  <p className="text-caption text-neutral-medium-gray pl-8">{item.subtitle}</p>
                                )}
                              </button>
                            );
                          }
                          
                          if (item.link) {
                            return (
                              <Link
                                key={item.id}
                                to={item.link}
                                onClick={() => {
                                  setShowSettingsDropdown(false);
                                }}
                                className="flex flex-col items-start space-y-0.5 px-4 py-3 text-body text-neutral-charcoal hover:bg-white transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-5 h-5 text-neutral-medium-gray" />
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {item.subtitle && (
                                  <p className="text-caption text-neutral-medium-gray pl-8">{item.subtitle}</p>
                                )}
                              </Link>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`fixed top-16 left-0 right-0 z-40 border-b shadow-lg lg:hidden transition-all ${
          isScrolled ? 'bg-white border-neutral-border-gray' : 'bg-white backdrop-blur-sm border-white/20'
        }`}>
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {location.pathname === '/' ? (
                <span
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-body py-2 transition-colors cursor-default ${
                    activeNav === 'stays'
                      ? 'text-primary-coral font-semibold'
                      : 'text-neutral-charcoal'
                  }`}
                >
                  Home page
                </span>
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-body py-2 transition-colors ${
                    activeNav === 'stays'
                      ? 'text-primary-coral font-semibold'
                      : isScrolled
                      ? 'text-neutral-charcoal hover:text-primary-coral'
                      : 'text-neutral-charcoal hover:text-primary-coral'
                  }`}
                >
                  Home page
                </Link>
              )}
              <Link
                to="/experiences"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-body py-2 transition-colors ${
                  activeNav === 'experiences'
                    ? 'text-primary-coral font-semibold'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-charcoal hover:text-primary-coral'
                }`}
              >
                Experiences
              </Link>
              <Link
                to="/offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-body py-2 transition-colors ${
                  activeNav === 'offers'
                    ? 'text-primary-coral font-semibold'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-charcoal hover:text-primary-coral'
                }`}
              >
                Offers
              </Link>
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-body py-2 transition-colors ${
                  activeNav === 'support'
                    ? 'text-primary-coral font-semibold'
                    : isScrolled
                    ? 'text-neutral-charcoal hover:text-primary-coral'
                    : 'text-neutral-charcoal hover:text-primary-coral'
                }`}
              >
                Support
              </Link>
              
              {/* Settings Menu - Mobile */}
              <div className="border-t border-neutral-border-gray pt-4">
                <h3 className="text-body font-semibold text-neutral-charcoal mb-2 px-2">Settings</h3>
                {userSettingsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isLogout = item.action === 'logout';
                  const isLogin = item.action === 'login';
                  const isOpenProfile = item.action === 'openProfile';
                  if (isOpenProfile) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowUserProfileModal(true);
                        }}
                        className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral text-left"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  if (isLogin) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowUserLoginModal(true);
                        }}
                        className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral text-left"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  if (isLogout) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          localStorage.removeItem('userToken');
                          localStorage.removeItem('user');
                          navigate('/');
                          window.location.reload();
                        }}
                        className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral transition-colors text-left border-t border-neutral-border-gray mt-1"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  if (item.link) {
                    return (
                      <Link
                        key={item.id}
                        to={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral transition-colors text-left"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-2 py-2 text-body text-neutral-charcoal hover:text-primary-coral transition-colors"
                    >
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

      {/* Hero Section with Search Card - Yatra Style */}
      <section className="relative pb-8 sm:pb-12 pt-16 sm:pt-20">

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Main Search Card - Classy & Refined */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-border-gray/40 overflow-hidden"
          >
            {/* Service Tabs - Horizontal, Refined */}
            <div className="flex items-center border-b border-neutral-border-gray/20 bg-white px-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 transition-all relative flex-shrink-0 ${
                      isActive
                        ? 'text-primary-coral border-b-2 border-primary-coral'
                        : 'text-neutral-medium-gray hover:text-neutral-charcoal'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-caption font-medium whitespace-nowrap">{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold ${isActive ? 'bg-primary-coral/10 text-primary-coral' : 'bg-white text-neutral-medium-gray'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Form - Refined Proportions */}
            <div className="p-3 sm:p-5">
              {/* Error Message */}
              {searchError && (
                <div className="mb-3 p-3 bg-white border-2 border-neutral-border-gray rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-neutral-charcoal flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-charcoal flex-1">{searchError}</p>
                  <button
                    onClick={() => setSearchError('')}
                    className="text-neutral-charcoal hover:text-primary-coral"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {activeTab === 'stays' ? (
                <div className="flex flex-col gap-3">
                  {/* Top Row - Location and Search Button on Mobile */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* City/Location */}
                    <div className="flex-1 min-w-0 relative" ref={cityDropdownRef}>
                      <button
                        onClick={() => {
                          setShowCityDropdown(!showCityDropdown);
                          if (searchError && searchError.includes('destination')) {
                            setSearchError('');
                          }
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white backdrop-blur-sm ${
                          searchError && searchError.includes('destination')
                            ? 'border-neutral-charcoal'
                            : 'border-primary-coral/50 hover:border-primary-coral'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <MapPin className="w-4 h-4 text-primary-coral flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-caption text-neutral-medium-gray mb-0.5">Where</p>
                            <p className="text-body font-medium text-neutral-charcoal truncate text-sm sm:text-base">
                              {searchCity || 'Search destinations'}
                            </p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-neutral-medium-gray" />
                        </div>
                      </button>
                      {showCityDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-neutral-border-gray z-50 max-h-60 overflow-y-auto">
                          {cities.map((city) => (
                            <button
                              key={city.id}
                              onClick={() => {
                                setSearchCity(city.name);
                                setShowCityDropdown(false);
                                if (searchError && searchError.includes('destination')) {
                                  setSearchError('');
                                }
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white transition-colors flex items-center space-x-2"
                            >
                              {city.icon && <span>{city.icon}</span>}
                              <span className="text-body text-neutral-charcoal">{city.name}</span>
                              {city.propertyCount > 0 && (
                                <span className="text-caption text-neutral-medium-gray ml-auto">
                                  {city.propertyCount} properties
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Search Button - Mobile */}
                    <button
                      onClick={handleSearch}
                      className="sm:hidden bg-primary-coral text-neutral-light-gray rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all font-semibold text-sm shadow-sm hover:shadow"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Bottom Row - Dates (Hidden on Mobile, Shown on Desktop) */}
                  <div className="hidden sm:flex md:flex-row gap-3 items-end">
                    {/* Check-in Date */}
                    <div className="flex-1 min-w-0 relative">
                      <button
                        ref={checkInButtonRef}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showDatePicker === 'checkin') {
                            setShowDatePicker(null);
                            setDatePickerPosition(null);
                          } else {
                            const buttonRect = e.currentTarget.getBoundingClientRect();
                            setDatePickerPosition({
                              top: buttonRect.bottom + window.scrollY + 8,
                              left: buttonRect.left + window.scrollX
                            });
                            setShowDatePicker('checkin');
                          }
                        }}
                        className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white backdrop-blur-sm ${
                          searchError && searchError.includes('check-in')
                            ? 'border-neutral-charcoal'
                            : showDatePicker === 'checkin' 
                            ? 'border-primary-coral shadow-md' 
                            : 'border-primary-coral/50 hover:border-primary-coral'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary-coral flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-caption text-neutral-medium-gray mb-0.5">Check in</p>
                            <p className="text-body font-medium text-neutral-charcoal">
                              {searchCheckIn ? format(searchCheckIn, 'MMM dd, yyyy') : 'Add dates'}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Check-out Date */}
                    <div className="flex-1 min-w-0 relative">
                      <button
                        ref={checkOutButtonRef}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showDatePicker === 'checkout') {
                            setShowDatePicker(null);
                            setDatePickerPosition(null);
                          } else {
                            const buttonRect = e.currentTarget.getBoundingClientRect();
                            setDatePickerPosition({
                              top: buttonRect.bottom + window.scrollY + 8,
                              left: buttonRect.left + window.scrollX
                            });
                            setShowDatePicker('checkout');
                          }
                        }}
                        className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white backdrop-blur-sm ${
                          searchError && searchError.includes('check-out')
                            ? 'border-neutral-charcoal'
                            : showDatePicker === 'checkout' 
                            ? 'border-primary-coral shadow-md' 
                            : 'border-primary-coral/50 hover:border-primary-coral'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary-coral flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-caption text-neutral-medium-gray mb-0.5">Check out</p>
                            <p className="text-body font-medium text-neutral-charcoal">
                              {searchCheckOut ? format(searchCheckOut, 'MMM dd, yyyy') : 'Add dates'}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Search Button - Desktop */}
                    <button
                      onClick={handleSearch}
                      className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all font-semibold text-body whitespace-nowrap h-[52px] shadow-sm hover:shadow"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              ) : activeTab === 'hire-guide' ? (
                <div className="flex flex-col gap-3">
                  {/* Top Row - Location and Search Button on Mobile */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Location */}
                    <div className="flex-1 min-w-0 relative" ref={guideLocationDropdownRef}>
                      <button
                        onClick={() => setShowGuideLocationDropdown(!showGuideLocationDropdown)}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral hover:shadow-md transition-all bg-white backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <MapPin className="w-4 h-4 text-primary-coral flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-caption text-neutral-medium-gray mb-0.5">Location</p>
                            <p className="text-body font-medium text-neutral-charcoal truncate text-sm sm:text-base">
                              {guideLocation || 'Where do you need a guide?'}
                            </p>
                          </div>
                        </div>
                      </button>
                      {showGuideLocationDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-primary-coral/50 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {cities.length > 0 ? (
                            cities.map((city) => (
                              <button
                                key={city.id}
                                onClick={() => {
                                  setGuideLocation(city.name);
                                  setShowGuideLocationDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-primary-coral/10 transition-colors"
                              >
                                {city.name}
                              </button>
                            ))
                          ) : (
                            ['Kochi', 'Munnar', 'Alappuzha', 'Wayanad', 'Thekkady', 'Kovalam'].map((city) => (
                              <button
                                key={city}
                                onClick={() => {
                                  setGuideLocation(city);
                                  setShowGuideLocationDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-primary-coral/10 transition-colors"
                              >
                                {city}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {/* Search Button - Mobile */}
                    <button
                      onClick={handleGuideSearch}
                      className="sm:hidden bg-primary-coral text-neutral-light-gray rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all font-semibold text-sm shadow-sm hover:shadow"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Bottom Row - Date (Hidden on Mobile, Shown on Desktop) */}
                  <div className="hidden sm:flex md:flex-row gap-3 items-end">
                    {/* Date */}
                    <div className="flex-1 min-w-0">
                      <button
                        ref={guideDateButtonRef}
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                          setGuideDatePickerPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
                          setShowGuideDatePicker(true);
                        }}
                        className="w-full text-left px-4 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral hover:shadow-md transition-all bg-white backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary-coral flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-caption text-neutral-medium-gray mb-0.5">Date</p>
                            <p className="text-body font-medium text-neutral-charcoal">
                              {guideDate ? format(guideDate, 'MMM dd, yyyy') : 'Select date'}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Search Button - Desktop */}
                    <button
                      onClick={handleGuideSearch}
                      className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all font-semibold text-body whitespace-nowrap h-[52px] shadow-sm hover:shadow"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Date row - Mobile: show date + search if date visible */}
                  <div className="flex sm:hidden gap-3">
                    <button
                      ref={guideDateButtonRef}
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                        setGuideDatePickerPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
                        setShowGuideDatePicker(true);
                      }}
                      className="flex-1 text-left px-3 py-2.5 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral bg-white"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary-coral flex-shrink-0" />
                        <p className="text-body font-medium text-neutral-charcoal truncate">
                          {guideDate ? format(guideDate, 'MMM dd') : 'Select date'}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : activeTab === 'cab-facility' ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-white backdrop-blur-sm rounded-xl border border-primary-coral/30">
                  <p className="text-body text-neutral-charcoal flex-1">
                    Need a cab? Add where, when and how many—the property will assign a driver and they’ll contact you.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCabRequestModal(true)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-primary-coral/90 transition-colors"
                  >
                    <Car className="w-4 h-4" />
                    Request cab
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guide Date Picker Portal */}
      {showGuideDatePicker && guideDatePickerPosition && (
        <div
          className="fixed z-[9999]"
          style={{
            top: `${guideDatePickerPosition.top}px`,
            left: `${guideDatePickerPosition.left}px`
          }}
          data-date-picker
        >
          <DatePicker
            value={guideDate}
            onChange={(date) => {
              setGuideDate(date);
              setShowGuideDatePicker(false);
              setGuideDatePickerPosition(null);
            }}
            minDate={new Date()}
            onClose={() => {
              setShowGuideDatePicker(false);
              setGuideDatePickerPosition(null);
            }}
          />
        </div>
      )}

      {/* Date Picker Portal - Rendered outside overflow container */}
      {showDatePicker && datePickerPosition && (
        <div 
          className="fixed z-[9999]" 
          style={{
            top: `${datePickerPosition.top}px`,
            left: `${datePickerPosition.left}px`
          }}
          data-date-picker
        >
          <DatePicker
            value={showDatePicker === 'checkin' ? searchCheckIn : searchCheckOut}
            onChange={(date) => {
              if (showDatePicker === 'checkin') {
                setSearchCheckIn(date);
                if (searchError && searchError.includes('check-in')) {
                  setSearchError('');
                }
              } else {
                setSearchCheckOut(date);
                if (searchError && (searchError.includes('check-out') || searchError.includes('after check-in'))) {
                  setSearchError('');
                }
              }
              setShowDatePicker(null);
              setDatePickerPosition(null);
            }}
            minDate={showDatePicker === 'checkin' 
              ? new Date() 
              : searchCheckIn 
                ? new Date(searchCheckIn.getTime() + 86400000) 
                : new Date()}
            onClose={() => {
              setShowDatePicker(null);
              setDatePickerPosition(null);
            }}
          />
        </div>
      )}

      {/* Under Construction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-primary-coral border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-h3 text-neutral-charcoal mb-2">Under Construction</h3>
              <p className="text-body text-neutral-medium-gray mb-6">
                This feature is currently under development. We're working hard to bring you an amazing experience. Please check back soon!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 text-body font-semibold hover:bg-opacity-90 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cab Request / Enquiry Modal */}
      {showCabRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8 p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowCabRequestModal(false);
                setCabRequestError('');
                setCabRequestSuccess(false);
              }}
              className="absolute top-4 right-4 text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {cabRequestSuccess ? (
              <div className="text-center pt-8 pb-4">
                <div className="w-16 h-16 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-teal" />
                </div>
                <h3 className="text-h3 text-neutral-charcoal mb-2">Request sent</h3>
                <p className="text-body text-neutral-medium-gray mb-6">
                  Your cab request has been sent to the property. The property will assign a driver who will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCabRequestModal(false);
                    setCabRequestSuccess(false);
                    setCabRequest({ pickupLocation: '', dropLocation: '', travelDate: '', travelTime: '', seatsPreference: '5 or 7', numberOfPeople: 1, propertyId: '', guestName: '', guestPhone: '', guestEmail: '' });
                  }}
                  className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-h2 text-neutral-charcoal mb-1">Request a cab</h3>
                <p className="text-caption text-neutral-medium-gray mb-6">
                  Add your details. The property will receive your request and assign a driver who will contact you.
                </p>
                {cabRequestError && (
                  <div className="mb-4 p-3 bg-white border-2 border-neutral-border-gray text-neutral-charcoal rounded-lg text-sm">{cabRequestError}</div>
                )}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!cabRequest.propertyId || !cabRequest.pickupLocation || !cabRequest.dropLocation || !cabRequest.travelDate || !cabRequest.travelTime || !cabRequest.guestName || !cabRequest.guestPhone) {
                      setCabRequestError('Please fill pickup, drop, date, time, your name and phone.');
                      return;
                    }
                    setCabRequestSubmitting(true);
                    setCabRequestError('');
                    try {
                      const token = localStorage.getItem('userToken');
                      const res = await fetch(`${API_BASE_URL}/cab-requests`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({
                          pickupLocation: cabRequest.pickupLocation,
                          dropLocation: cabRequest.dropLocation,
                          travelDate: cabRequest.travelDate,
                          travelTime: cabRequest.travelTime,
                          seatsPreference: cabRequest.seatsPreference,
                          numberOfPeople: cabRequest.numberOfPeople,
                          propertyId: cabRequest.propertyId,
                          guestName: cabRequest.guestName,
                          guestPhone: cabRequest.guestPhone,
                          guestEmail: cabRequest.guestEmail || undefined,
                        }),
                      });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || 'Failed to submit request');
                      }
                      setCabRequestSuccess(true);
                    } catch (err: any) {
                      setCabRequestError(err.message || 'Something went wrong. Please try again.');
                    } finally {
                      setCabRequestSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-caption text-neutral-medium-gray mb-1">Property (request goes to this property)</label>
                    <select
                      required
                      value={cabRequest.propertyId}
                      onChange={(e) => setCabRequest((p) => ({ ...p, propertyId: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none text-neutral-charcoal"
                    >
                      <option value="">
                        {cabPropertiesLoading ? 'Loading properties…' : 'Select property'}
                      </option>
                      {cabProperties.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} – {p.location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Pickup</label>
                      <input
                        type="text"
                        value={cabRequest.pickupLocation}
                        onChange={(e) => setCabRequest((p) => ({ ...p, pickupLocation: e.target.value }))}
                        placeholder="Pickup location"
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Drop</label>
                      <input
                        type="text"
                        value={cabRequest.dropLocation}
                        onChange={(e) => setCabRequest((p) => ({ ...p, dropLocation: e.target.value }))}
                        placeholder="Drop location"
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Date</label>
                      <input
                        type="date"
                        value={cabRequest.travelDate}
                        onChange={(e) => setCabRequest((p) => ({ ...p, travelDate: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Time</label>
                      <input
                        type="time"
                        value={cabRequest.travelTime}
                        onChange={(e) => setCabRequest((p) => ({ ...p, travelTime: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Seats</label>
                      <select
                        value={cabRequest.seatsPreference}
                        onChange={(e) => setCabRequest((p) => ({ ...p, seatsPreference: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                      >
                        <option value="5 or 7">5 or 7 seat</option>
                        <option value="5">5 seat</option>
                        <option value="7">7 seat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-caption text-neutral-medium-gray mb-1">Number of people</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={cabRequest.numberOfPeople}
                        onChange={(e) => setCabRequest((p) => ({ ...p, numberOfPeople: parseInt(e.target.value, 10) || 1 }))}
                        className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-caption text-neutral-medium-gray mb-1">Your name</label>
                    <input
                      type="text"
                      value={cabRequest.guestName}
                      onChange={(e) => setCabRequest((p) => ({ ...p, guestName: e.target.value }))}
                      placeholder="Full name"
                      className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-caption text-neutral-medium-gray mb-1">Phone (driver will contact you)</label>
                    <input
                      type="tel"
                      value={cabRequest.guestPhone}
                      onChange={(e) => setCabRequest((p) => ({ ...p, guestPhone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-caption text-neutral-medium-gray mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={cabRequest.guestEmail}
                      onChange={(e) => setCabRequest((p) => ({ ...p, guestEmail: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowCabRequestModal(false); setCabRequestError(''); }}
                      className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={cabRequestSubmitting}
                      className="flex-1 px-4 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 disabled:opacity-70"
                    >
                      {cabRequestSubmitting ? 'Sending…' : 'Submit enquiry'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* City Discovery - Part of flowing background */}
      <div className="relative z-10">
        <CityDiscovery
          onCitySelect={(city) => {
            navigate(`/stays?city=${encodeURIComponent(city.name)}`);
          }}
        />
      </div>
      </div>

      {/* Featured Categories - Starts after background fade */}
      <div className="relative z-10">
        <FeaturedCategories />
      </div>

      {/* Featured Properties */}
      <div className="relative z-10">
        {isLoadingFeatured ? (
          <section className="py-8 sm:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">Featured Properties</h2>
                <p className="text-sm sm:text-body text-neutral-medium-gray">Handpicked stays for an unforgettable experience</p>
              </div>
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
              </div>
            </div>
          </section>
        ) : featuredPropertiesError ? (
          <section className="py-8 sm:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">Featured Properties</h2>
                <p className="text-sm sm:text-body text-neutral-medium-gray mb-6">Handpicked stays for an unforgettable experience</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
                <p className="text-body text-neutral-medium-gray mb-6">{featuredPropertiesError}</p>
                <button
                  onClick={fetchFeaturedProperties}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        ) : featuredProperties.length > 0 ? (
          <PropertyGrid
            properties={featuredProperties}
            title="Featured Properties"
            subtitle="Handpicked stays for an unforgettable experience"
            wishlistIds={wishlistIds}
            onWishlistToggle={toggleWishlist}
          />
        ) : null}
      </div>

      {/* Offers Section */}
      <OffersSection />

      {/* Plan My Trip */}
      <PlanMyTrip />

      {/* Why EverStays Section */}
      <WhyStayHub />

      {/* Footer */}
      <Footer />

      {/* User Login Modal */}
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
              <button
                onClick={() => setShowUserLoginModal(false)}
                className="absolute top-4 right-4 text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-h1 text-neutral-charcoal mb-2 font-bold">User Login</h3>
                <p className="text-body text-neutral-medium-gray">
                  Login to access your account
                </p>
              </div>

              <form onSubmit={handleUserLogin} className="space-y-4">
                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userLoginData.email}
                    onChange={(e) => setUserLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={userLoginData.password}
                      onChange={(e) => setUserLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                      className="w-full p-3 pr-12 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium-gray hover:text-neutral-charcoal" aria-label={showLoginPassword ? 'Hide password' : 'Show password'}>
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-caption text-neutral-medium-gray">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    onClick={() => setShowUserLoginModal(false)}
                    className="text-caption text-primary-coral hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserLoginModal(false);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </span>
                  </motion.button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-body text-neutral-medium-gray">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      onClick={() => setShowUserLoginModal(false)}
                      className="text-primary-coral font-medium hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Modal - Settings & preferences only. Bookings, saved properties & reviews are in My Trips. */}
      <AnimatePresence>
        {showUserProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowUserProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-border-gray flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h1 text-neutral-charcoal mb-1 font-bold">Account</h2>
                    <p className="text-body text-neutral-medium-gray">
                      Manage your settings and preferences
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUserProfileModal(false)}
                    className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setShowUserProfileModal(false)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-coral/10 text-primary-coral rounded-lg text-body font-medium hover:bg-primary-coral/20 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  My Trips — Bookings, saved properties & reviews
                </Link>
              </div>

              {/* Content - Account settings only */}
              <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
                <div>
                    <h3 className="text-h2 mb-6 text-neutral-charcoal font-semibold">Account Settings</h3>
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray">
                        <h4 className="text-h3 mb-4 text-neutral-charcoal">Profile Information</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-body font-medium mb-2 text-neutral-charcoal">Username</label>
                            <input
                              type="text"
                              value={currentUser?.name || ''}
                              readOnly
                              className="w-full p-3 border-2 border-neutral-border-gray rounded-lg bg-white cursor-not-allowed text-neutral-medium-gray"
                              placeholder="Username"
                            />
                          </div>
                          <div>
                            <label className="block text-body font-medium mb-2 text-neutral-charcoal">Email</label>
                            <input
                              type="email"
                              value={currentUser?.email || ''}
                              readOnly
                              className="w-full p-3 border-2 border-neutral-border-gray rounded-lg bg-white cursor-not-allowed text-neutral-medium-gray"
                              placeholder="Email"
                            />
                          </div>
                          <div>
                            <label className="block text-body font-medium mb-2 text-neutral-charcoal">Phone</label>
                            <input
                              type="tel"
                              value={accountPhone}
                              onChange={(e) => setAccountPhone(e.target.value)}
                              className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray">
                        <h4 className="text-h3 mb-4 text-neutral-charcoal">Payment Methods</h4>
                        <p className="text-body text-neutral-medium-gray">
                          Payment method is chosen at checkout. Saved payment methods coming soon.
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray">
                        <h4 className="text-h3 mb-4 text-neutral-charcoal">Notifications</h4>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" defaultChecked />
                            <span className="text-body text-neutral-charcoal">Email notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" defaultChecked />
                            <span className="text-body text-neutral-charcoal">Booking confirmations</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-body text-neutral-charcoal">Promotional emails</span>
                          </label>
                        </div>
                      </div>

                      {saveAccountMessage && (
                        <div className={`p-4 rounded-lg ${
                          saveAccountMessage.includes('success')
                            ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30'
                            : 'bg-white border-2 border-neutral-border-gray text-neutral-charcoal'
                        }`}>
                          {saveAccountMessage}
                        </div>
                      )}

                      <button
                        onClick={handleSaveAccount}
                        disabled={isSavingAccount}
                        className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingAccount ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
