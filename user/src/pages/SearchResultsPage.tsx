import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import GlobalHeader from '../components/header/GlobalHeader';
import PropertyGrid from '../components/property/PropertyGrid';
import { useWishlist } from '../hooks/useWishlist';
import Footer from '../components/common/Footer';
import DatePicker from '../components/common/DatePicker';
import { Search, X, MapPin, Calendar, Users, ChevronDown, Filter, DollarSign } from 'lucide-react';
import type { Property } from '../types';

import { API_BASE_URL } from '../config/api';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [filteredResults, setFilteredResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'location' | 'newest'>('newest');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterPriceRange, setFilterPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  // Extract search parameters from URL
  const searchCity = searchParams.get('city') || '';
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  const searchCheckIn = checkInParam ? new Date(checkInParam) : null;
  const searchCheckOut = checkOutParam ? new Date(checkOutParam) : null;
  const searchGuests = guestsParam ? parseInt(guestsParam, 10) : 1;

  // Search form state (always visible)
  const [editCity, setEditCity] = useState(searchCity);
  const [editCheckIn, setEditCheckIn] = useState<Date | null>(searchCheckIn);
  const [editCheckOut, setEditCheckOut] = useState<Date | null>(searchCheckOut);
  const [editAdults, setEditAdults] = useState(Math.max(1, searchGuests));
  const [editChildren, setEditChildren] = useState(0);
  const editGuests = editAdults + editChildren;
  const editRoomCount = Math.max(1, Math.ceil(editGuests / 3));
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'checkin' | 'checkout' | null>(null);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [cities, setCities] = useState<Array<{ id: string; name: string; icon?: string; propertyCount: number }>>([]);
  const [datePickerPosition, setDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [guestsPickerPosition, setGuestsPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const checkInButtonRef = useRef<HTMLButtonElement>(null);
  const checkOutButtonRef = useRef<HTMLButtonElement>(null);
  const guestsButtonRef = useRef<HTMLButtonElement>(null);

  // Redirect to home only when user has partial/invalid search params
  // City-only is valid (browse by city); full search needs city + dates
  const hasCityOnly = searchCity?.trim() && !checkInParam && !checkOutParam;
  const hasFullSearchParams = searchCity?.trim() && checkInParam && checkOutParam &&
    searchCheckIn && searchCheckOut && searchCheckOut > searchCheckIn;
  const hasValidSearchParams = hasCityOnly || hasFullSearchParams;
  const hasInvalidPartialParams = (checkInParam || checkOutParam) && !hasFullSearchParams;
  const hasAnySearchParams = searchCity || checkInParam || checkOutParam || guestsParam;
  useEffect(() => {
    if (hasAnySearchParams && hasInvalidPartialParams) {
      navigate('/', { replace: true });
    }
  }, [hasInvalidPartialParams, hasAnySearchParams, navigate]);

  // Perform search when component mounts or params change
  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      setError('');

      try {
        // City-only is valid (browse properties by city)
        // Full search needs city + valid dates
        const hasCityOnly = searchCity && searchCity.trim() && !checkInParam && !checkOutParam;
        const hasFullSearch = searchCity && searchCity.trim() && checkInParam && checkOutParam &&
          searchCheckIn && searchCheckOut && searchCheckOut > searchCheckIn;
        const hasValidSearchParams = hasCityOnly || hasFullSearch;
        const hasAnySearchParams = searchCity || checkInParam || checkOutParam || guestsParam;

        // Invalid: partial date params (e.g. only checkIn, or checkOut <= checkIn)
        const hasInvalidDates = (checkInParam || checkOutParam) && !hasFullSearch;
        if (hasAnySearchParams && hasInvalidDates) {
          setError('');
          if (searchCheckOut && searchCheckIn && searchCheckOut <= searchCheckIn) {
            setError('Check-out date should be after your check-in date');
          } else if (checkInParam && !checkOutParam) {
            setError('Please select check-out date');
          } else if (checkOutParam && !checkInParam) {
            setError('Please select check-in date');
          }
          setSearchResults([]);
          setFilteredResults([]);
          setIsSearching(false);
          return;
        }

        const params = new URLSearchParams();
        
        // Only add parameters if they have valid values
        if (searchCity && searchCity.trim()) {
          params.set('city', searchCity.trim());
        }
        if (checkInParam) {
          params.set('checkIn', checkInParam);
        }
        if (checkOutParam) {
          params.set('checkOut', checkOutParam);
        }
        if (guestsParam && !isNaN(parseInt(guestsParam, 10))) {
          const guestsNum = parseInt(guestsParam, 10);
          if (guestsNum > 0) {
            params.set('guests', guestsParam);
          }
        }
        
        // Set valid numeric parameters for pagination
        params.set('limit', '100');
        params.set('page', '1');

        const queryString = params.toString();
        // When no search params, use featured endpoint for browse experience
        const url = !hasAnySearchParams
          ? `${API_BASE_URL}/properties/featured?limit=100`
          : `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ''}`;
        
        console.log('Fetching properties from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          // Handle both response formats: { properties: [] } or direct array
          let properties: Property[] = [];
          
          if (Array.isArray(data)) {
            properties = data;
          } else if (data && Array.isArray(data.properties)) {
            properties = data.properties;
          } else if (data && data.data && Array.isArray(data.data)) {
            properties = data.data;
          }
          
          setSearchResults(properties);
          setFilteredResults(properties);
          
          // Extract unique cities for filter
          const uniqueCities = [...new Set(properties.map(p => p.city).filter(Boolean))];
          setAvailableCities(uniqueCities.sort());
          
          // Clear error - empty results are not an error, they're just "no properties found"
          setError('');
        } else {
          // Only show error for actual API/validation errors (400, 500, etc.)
          // A 400 status means the backend rejected the request (validation error)
          let errorMessage = 'We couldn\'t load the search results. Please try again.';
          
          try {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            
            // Use helper function to get user-friendly error message
            errorMessage = getUserFriendlyError(errorData, response.status);
          } catch (e) {
            // If response is not JSON, use status-based message
            console.error('Error parsing error response:', e);
            errorMessage = getUserFriendlyError(null, response.status);
          }
          
          console.error('Search failed:', response.status, response.statusText);
          
          // Set a user-friendly error message only for actual errors
          setError(errorMessage);
          setSearchResults([]);
          setFilteredResults([]);
        }
      } catch (err) {
        console.error('Error searching properties:', err);
        // Check if it's a network error
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('We can\'t connect to our servers right now. Please check your internet connection and try again.');
        } else if (err instanceof Error) {
          setError('Something went wrong while searching. Please try again in a moment.');
        } else {
          setError('An unexpected error occurred. Please refresh the page and try again.');
        }
        setSearchResults([]);
        setFilteredResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [searchParams, searchCity, checkInParam, checkOutParam, guestsParam]);

  // Fetch cities for dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cities`);
        if (response.ok) {
          const data = await response.json();
          setCities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Update search form when URL params change
  useEffect(() => {
    setEditCity(searchCity);
    setEditCheckIn(searchCheckIn);
    setEditCheckOut(searchCheckOut);
    const validGuests = searchGuests && searchGuests >= 1 && !isNaN(searchGuests) ? searchGuests : 1;
    setEditAdults(validGuests);
    setEditChildren(0);
  }, [searchCity, checkInParam, checkOutParam, guestsParam, searchGuests]);
  
  // Clear guest-related errors when guests are updated
  useEffect(() => {
    if (error && error.includes('guest') && editGuests >= 1) {
      setError('');
    }
  }, [editGuests]);

  // Apply filters and sorting to search results
  useEffect(() => {
    let filtered = [...searchResults];

    // Filter by location
    if (filterLocation) {
      filtered = filtered.filter(p => 
        p.city?.toLowerCase().includes(filterLocation.toLowerCase()) ||
        p.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Filter by price range
    if (filterPriceRange.min) {
      const minPrice = parseFloat(filterPriceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(p => (p.pricePerNight || 0) >= minPrice);
      }
    }
    if (filterPriceRange.max) {
      const maxPrice = parseFloat(filterPriceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(p => (p.pricePerNight || 0) <= maxPrice);
      }
    }

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.pricePerNight || 0) - (b.pricePerNight || 0);
        case 'price-high':
          return (b.pricePerNight || 0) - (a.pricePerNight || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'location':
          return (a.city || '').localeCompare(b.city || '');
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    setFilteredResults(filtered);
  }, [searchResults, sortBy, filterLocation, filterPriceRange]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (showDatePicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-date-picker]') && 
            !checkInButtonRef.current?.contains(target) && 
            !checkOutButtonRef.current?.contains(target)) {
          setShowDatePicker(null);
          setDatePickerPosition(null);
        }
      }
      if (showGuestsPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-guests-picker]') && 
            !guestsButtonRef.current?.contains(target)) {
          setShowGuestsPicker(false);
          setGuestsPickerPosition(null);
        }
      }
    };

    if (showCityDropdown || showDatePicker || showGuestsPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCityDropdown, showDatePicker, showGuestsPicker]);

  const handleUpdateSearch = () => {
    // Validate required fields with simple, clear messages
    if (!editCity || editCity.trim() === '') {
      setError('Please choose a destination city');
      setShowCityDropdown(true);
      return;
    }

    // If dates are provided, validate both are present and valid
    if (editCheckIn || editCheckOut) {
      if (!editCheckIn) {
        setError('Please select when you want to check in');
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
      if (!editCheckOut) {
        setError('Please select when you want to check out');
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
      if (editCheckOut <= editCheckIn) {
        setError('Check-out date should be after your check-in date');
        return;
      }
    }

    // Guests validation
    if (!editGuests || editGuests < 1 || isNaN(editGuests)) {
      setError('Please select at least 1 guest');
      const guestsButton = guestsButtonRef.current;
      if (guestsButton) {
        const rect = guestsButton.getBoundingClientRect();
        setGuestsPickerPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
        setShowGuestsPicker(true);
      }
      return;
    }

    // Clear any errors before proceeding
    setError('');

    const params = new URLSearchParams();
    params.set('city', editCity.trim());
    if (editCheckIn) params.set('checkIn', format(editCheckIn, 'yyyy-MM-dd'));
    if (editCheckOut) params.set('checkOut', format(editCheckOut, 'yyyy-MM-dd'));
    params.set('guests', editGuests.toString());

    // Update URL which will trigger the search useEffect
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    navigate('/');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(date, 'MMM dd, yyyy');
  };

  // Helper function to convert backend errors to user-friendly messages
  const getUserFriendlyError = (errorData: any, status: number): string => {
    // Network or connection errors
    if (status === 0 || status >= 500) {
      return 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.';
    }

    // Not found errors
    if (status === 404) {
      return 'We couldn\'t find what you\'re looking for. Please try a different search.';
    }

    // Validation errors - provide specific, simple messages
    if (errorData?.message) {
      const message = Array.isArray(errorData.message) 
        ? errorData.message.join(' ') 
        : errorData.message;

      // Check for specific validation issues
      if (message.includes('checkIn') || message.includes('check-in') || message.includes('check in')) {
        return 'Please select a valid check-in date.';
      }
      if (message.includes('checkOut') || message.includes('check-out') || message.includes('check out')) {
        return 'Please select a valid check-out date.';
      }
      if (message.includes('city') || message.includes('location')) {
        return 'Please enter a valid city or location name.';
      }
      if (message.includes('guests') || message.includes('guest')) {
        return 'Please select the number of guests (at least 1).';
      }
      if (message.includes('date') || message.includes('Date')) {
        return 'Please make sure your dates are valid. Check-out date should be after check-in date.';
      }
      if (message.includes('must not be less than') || message.includes('must be a number')) {
        return 'Something went wrong with your search. Please try again.';
      }
    }

    // Default user-friendly message
    return 'Something went wrong with your search. Please check your dates and location, then try again.';
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />

      {/* Search Results Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Filters - Always Visible */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-charcoal mb-6">
              {searchCity ? `Search Results in ${searchCity}` : 'Search Results'}
            </h1>
            
            {/* Search Form - Always Visible */}
            <div className="space-y-4">
              {/* Error Message - Simple inline */}
              {error && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3">
                  <p className="text-sm text-amber-800">{error}</p>
                  <button onClick={() => setError('')} className="text-amber-600 hover:text-amber-900 shrink-0" aria-label="Dismiss">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search Criteria Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div className="flex-1 min-w-0 relative" ref={cityDropdownRef}>
                  <button
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown);
                      if (error && error.includes('destination')) {
                        setError('');
                      }
                    }}
                    className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white ${
                      error && error.includes('destination')
                        ? 'border-neutral-charcoal'
                        : 'border-primary-coral/50 hover:border-primary-coral'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-primary-coral flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-neutral-medium-gray mb-0.5">Where</p>
                        <p className="text-body font-medium text-neutral-charcoal truncate">
                          {editCity || 'Search destinations'}
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
                            setEditCity(city.name);
                            setShowCityDropdown(false);
                            if (error && error.includes('destination')) {
                              setError('');
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
                      setShowGuestsPicker(false);
                    }}
                    className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white ${
                      error && error.includes('check-in')
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
                          {editCheckIn ? format(editCheckIn, 'MMM dd, yyyy') : 'Add dates'}
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
                      setShowGuestsPicker(false);
                    }}
                    className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white ${
                      error && error.includes('check-out')
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
                          {editCheckOut ? format(editCheckOut, 'MMM dd, yyyy') : 'Add dates'}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Guests */}
                <div className="flex-1 min-w-0 relative">
                  <button
                    ref={guestsButtonRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setGuestsPickerPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX,
                      });
                      setShowGuestsPicker(!showGuestsPicker);
                      setShowDatePicker(null);
                      setDatePickerPosition(null);
                    }}
                    className={`w-full text-left px-4 py-3 border-2 rounded-lg hover:shadow-md transition-all bg-white ${
                      error && error.includes('guest')
                        ? 'border-neutral-charcoal'
                        : showGuestsPicker 
                        ? 'border-primary-coral shadow-md' 
                        : 'border-primary-coral/50 hover:border-primary-coral'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-primary-coral flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-neutral-medium-gray mb-0.5">Guests</p>
                        <p className="text-body font-medium text-neutral-charcoal">
                          {editAdults} adult{editAdults !== 1 ? 's' : ''}, {editChildren} child{editChildren !== 1 ? 'ren' : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateSearch}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Update Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sort and Filter Options */}
          {!isSearching && !error && filteredResults.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <label className="text-body font-medium text-neutral-charcoal flex items-center space-x-2">
                    <span>Sort by:</span>
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors text-body"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="location">Location (A-Z)</option>
                  </select>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral transition-colors text-body font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-neutral-border-gray grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary-coral" />
                      <span>Location</span>
                    </label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors text-body"
                    >
                      <option value="">All Locations</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-primary-coral" />
                      <span>Min Price (₹)</span>
                    </label>
                    <input
                      type="number"
                      value={filterPriceRange.min}
                      onChange={(e) => setFilterPriceRange({ ...filterPriceRange, min: e.target.value })}
                      placeholder="Min"
                      min="0"
                      className="w-full px-4 py-2 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors text-body"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-primary-coral" />
                      <span>Max Price (₹)</span>
                    </label>
                    <input
                      type="number"
                      value={filterPriceRange.max}
                      onChange={(e) => setFilterPriceRange({ ...filterPriceRange, max: e.target.value })}
                      placeholder="Max"
                      min="0"
                      className="w-full px-4 py-2 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors text-body"
                    />
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-neutral-border-gray">
                <p className="text-body text-neutral-medium-gray">
                  Showing {filteredResults.length} of {searchResults.length} properties
                  {filterLocation && ` in ${filterLocation}`}
                </p>
              </div>
            </div>
          )}

          {/* Date Picker Modal */}
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
                value={showDatePicker === 'checkin' ? editCheckIn : editCheckOut}
                onChange={(date) => {
                  if (showDatePicker === 'checkin') {
                    setEditCheckIn(date);
                    if (error && error.includes('check-in')) {
                      setError('');
                    }
                  } else {
                    setEditCheckOut(date);
                    if (error && (error.includes('check-out') || error.includes('after check-in'))) {
                      setError('');
                    }
                  }
                  setShowDatePicker(null);
                  setDatePickerPosition(null);
                }}
                minDate={showDatePicker === 'checkin' 
                  ? new Date() 
                  : editCheckIn 
                  ? new Date(editCheckIn.getTime() + 86400000) 
                  : new Date()}
                onClose={() => {
                  setShowDatePicker(null);
                  setDatePickerPosition(null);
                }}
              />
            </div>
          )}

          {/* Guests Picker Modal */}
          {showGuestsPicker && guestsPickerPosition && (
            <div 
              className="fixed z-[9999]" 
              style={{
                top: `${guestsPickerPosition.top}px`,
                left: `${guestsPickerPosition.left}px`
              }}
              data-guests-picker
            >
              <div className="bg-white rounded-lg shadow-xl border-2 border-primary-coral/50 p-4 min-w-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-body font-medium text-neutral-charcoal">Guests</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGuestsPicker(false);
                      setGuestsPickerPosition(null);
                    }}
                    className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-body text-neutral-charcoal">Adults</span>
                  <div className="flex items-center">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditAdults(Math.max(1, editAdults - 1)); if (error?.includes('guest')) setError(''); }} className="w-8 h-8 rounded-full border-2 border-primary-coral/50 flex items-center justify-center hover:bg-primary-coral/10 disabled:opacity-50" disabled={editAdults <= 1}><span className="text-primary-coral text-lg">−</span></button>
                    <span className="text-h3 font-semibold text-neutral-charcoal px-4 w-8 text-center">{editAdults}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditAdults(Math.min(20, editAdults + 1)); if (error?.includes('guest')) setError(''); }} className="w-8 h-8 rounded-full border-2 border-primary-coral/50 flex items-center justify-center hover:bg-primary-coral/10 disabled:opacity-50" disabled={editGuests >= 20}><span className="text-primary-coral text-lg">+</span></button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body text-neutral-charcoal">Children</span>
                  <div className="flex items-center">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditChildren(Math.max(0, editChildren - 1)); if (error?.includes('guest')) setError(''); }} className="w-8 h-8 rounded-full border-2 border-primary-coral/50 flex items-center justify-center hover:bg-primary-coral/10 disabled:opacity-50" disabled={editChildren <= 0}><span className="text-primary-coral text-lg">−</span></button>
                    <span className="text-h3 font-semibold text-neutral-charcoal px-4 w-8 text-center">{editChildren}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditChildren(Math.min(19, editChildren + 1)); if (error?.includes('guest')) setError(''); }} className="w-8 h-8 rounded-full border-2 border-primary-coral/50 flex items-center justify-center hover:bg-primary-coral/10 disabled:opacity-50" disabled={editGuests >= 20}><span className="text-primary-coral text-lg">+</span></button>
                  </div>
                </div>
                <p className="text-caption text-neutral-medium-gray">{editRoomCount} room{editRoomCount !== 1 ? 's' : ''} recommended</p>
              </div>
            </div>
          )}


          {/* Loading State */}
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-coral mb-4"></div>
              <p className="text-body text-neutral-medium-gray">Searching properties...</p>
            </div>
          )}

          {/* Error State - Simple inline message only; search form above lets user fix */}
          {error && !isSearching && (
            <div className="py-6 text-center">
              <p className="text-body text-neutral-medium-gray">{error}</p>
              <p className="text-sm text-neutral-charcoal mt-2">Update your search above and click Update Search.</p>
            </div>
          )}

          {/* Results - Show when we have properties */}
          {!isSearching && !error && filteredResults.length > 0 && (
            <PropertyGrid
              properties={filteredResults}
              wishlistIds={wishlistIds}
              onWishlistToggle={toggleWishlist}
            />
          )}

          {/* Empty State - Show when filters applied but no matches */}
          {!isSearching && !error && filteredResults.length === 0 && searchResults.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-10 h-10 text-primary-coral" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-charcoal mb-3">
                  No properties match your filters
                </h2>
                <p className="text-body text-neutral-medium-gray mb-6">
                  Try adjusting your filters or clearing them to see more results.
                </p>
                <button
                  onClick={() => {
                    setFilterLocation('');
                    setFilterPriceRange({ min: '', max: '' });
                    setSortBy('newest');
                  }}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Empty State - Show when search is valid but no properties found */}
          {!isSearching && !error && searchResults.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary-coral" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-charcoal mb-3">
                  No properties available
                </h2>
                <p className="text-body text-neutral-medium-gray mb-6">
                  {searchCity 
                    ? `We don't have any properties available in ${searchCity} for your selected dates. Try searching for different dates or a different location.`
                    : "We don't have any properties matching your search. Try adjusting your dates, location, or number of guests."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      // Scroll to top to edit search
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Change Search
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-semibold hover:bg-white transition-colors"
                  >
                    Browse All Properties
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
