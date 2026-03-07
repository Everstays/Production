import { useState, useEffect } from 'react';
import { Navigation, X } from 'lucide-react';
import type { City } from '../../types';

import { API_BASE_URL } from '../../config/api';

interface CityDiscoveryProps {
  onCitySelect?: (city: City) => void;
}

export default function CityDiscovery({ onCitySelect }: CityDiscoveryProps) {
  const [showAllCities, setShowAllCities] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch(`${API_BASE_URL}/cities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Cities data received:', data);
        
        // Handle both array and object responses
        const citiesArray = Array.isArray(data) ? data : (data.cities || []);
        
        // Filter cities that have properties (propertyCount > 0)
        const citiesWithProperties = citiesArray.filter((city: City) => 
          city && city.propertyCount > 0
        );
        
        console.log('Cities with properties:', citiesWithProperties.length);
        setCities(citiesWithProperties);
        
        // Clear error if successful (even if empty)
        setError('');
      } catch (err: any) {
        console.error('Error fetching cities:', err);
        // Only show error if it's a network/API error, not if it's just empty
        if (err.message && err.message.includes('Failed to fetch')) {
          setError(`Cannot connect to server. Ensure the backend is running at ${API_BASE_URL}. Open this app at http://localhost:5173 and click Retry.`);
        } else {
          setError('Failed to load cities. ' + (err.message || ''));
        }
        // Set empty array on error to prevent crashes
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Get popular cities (top 12 for hero strip; always single row + horizontal scroll)
  const popularCities = cities.slice(0, 12);
  const allCities = cities;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by your browser');
      setTimeout(() => setLocationError(''), 4000);
      return;
    }
    setIsLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `${API_BASE_URL}/cities/geocode/reverse?lat=${latitude}&lon=${longitude}`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (!res.ok) throw new Error('Geocoding failed');
          const data = await res.json();
          const cityName = data?.city || '';
          if (!cityName) {
            setLocationError('Could not determine your city');
            setTimeout(() => setLocationError(''), 4000);
            return;
          }
          const match = cities.find(
            (c) => c.name.toLowerCase().includes(cityName.toLowerCase()) ||
              cityName.toLowerCase().includes(c.name.toLowerCase())
          );
          if (match && onCitySelect) {
            onCitySelect(match);
          } else if (onCitySelect) {
            onCitySelect({ id: '', name: cityName, icon: '📍', propertyCount: 0 });
          } else {
            setLocationError(`No properties found near ${cityName}`);
            setTimeout(() => setLocationError(''), 4000);
          }
        } catch {
          setLocationError('Could not find your location. Please select a city manually.');
          setTimeout(() => setLocationError(''), 4000);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        if (err.code === 1) {
          setLocationError('Location permission denied. Please enable it in your browser.');
        } else if (err.code === 2) {
          setLocationError('Location unavailable. Please try again.');
        } else if (err.code === 3) {
          setLocationError('Location request timed out. Please try again.');
        } else {
          setLocationError('Could not get your location. Please select a city manually.');
        }
        setTimeout(() => setLocationError(''), 5000);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAllCities) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAllCities]);

  return (
    <>
      <section className="py-12 bg-transparent relative pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2 font-bold drop-shadow-sm">Explore by City</h2>
              <p className="text-sm sm:text-body text-neutral-dark-gray font-medium drop-shadow-sm">
                Discover amazing stays in popular destinations
              </p>
            </div>
            {allCities.length > popularCities.length && (
              <button
                onClick={() => setShowAllCities(true)}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-body text-primary-coral font-medium hover:bg-white hover:shadow-md transition-all"
              >
                <span>View All Cities</span>
                <span>→</span>
              </button>
            )}
          </div>

        {/* Use my location */}
        <div className="mb-6">
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-primary-coral/50 rounded-full text-body text-neutral-charcoal hover:bg-primary-coral/10 hover:border-primary-coral transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLocating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-primary-coral border-t-transparent rounded-full animate-spin" />
                <span>Getting location...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-primary-coral" />
                <span>Use my location</span>
              </>
            )}
          </button>
          {locationError && (
            <p className="mt-2 text-sm text-neutral-charcoal max-w-md">{locationError}</p>
          )}
        </div>

        {/* City Grid - Horizontal Scroll on Mobile */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            <p className="ml-4 text-body text-neutral-medium-gray">Loading cities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-white border-2 border-neutral-border-gray rounded-lg p-4 max-w-md mx-auto shadow-sm">
              <p className="text-body text-neutral-charcoal mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-primary-coral hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : popularCities.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">🏘️</div>
            <p className="text-body text-neutral-charcoal font-medium mb-2">No cities with properties yet</p>
            <p className="text-sm text-neutral-medium-gray">Be the first host to add a property!</p>
          </div>
        ) : (
          <div className="flex flex-nowrap gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {popularCities.map((city) => (
              <button
                key={city.id}
                onClick={() => onCitySelect?.(city)}
                className="flex flex-shrink-0 flex-col items-center space-y-3 group cursor-pointer min-w-[120px] sm:min-w-[140px] snap-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary-coral/50 flex items-center justify-center text-3xl sm:text-4xl bg-white shadow-md hover:shadow-lg group-hover:border-primary-coral group-hover:scale-105 transition-all flex-shrink-0">
                  {city.icon || '🏘️'}
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm w-full min-h-[56px] flex flex-col items-center justify-center">
                  <p
                    className="font-semibold text-neutral-charcoal group-hover:text-primary-coral transition-colors leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm"
                    title={city.name}
                  >
                    {city.name}
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-neutral-dark-gray mt-0.5 whitespace-nowrap">
                    {city.propertyCount} {city.propertyCount === 1 ? 'property' : 'properties'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* View All Button - Mobile (only when there are more cities than shown) */}
        {allCities.length > popularCities.length && (
          <div className="md:hidden mt-6 text-center">
            <button
              onClick={() => setShowAllCities(true)}
              className="text-body text-primary-coral font-medium hover:underline"
            >
              View All Cities ({allCities.length}) →
            </button>
          </div>
        )}
      </div>
    </section>

    {/* All Cities Modal */}
    {showAllCities && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-border-gray">
            <div>
              <h3 className="text-xl sm:text-h1 text-neutral-charcoal font-bold">All Cities in Kerala</h3>
              <p className="text-sm sm:text-body text-neutral-medium-gray mt-1">
                Explore amazing stays across {allCities.length} {allCities.length === 1 ? 'destination' : 'destinations'}
              </p>
            </div>
            <button
              onClick={() => setShowAllCities(false)}
              className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cities Grid */}
          <div className="overflow-y-auto p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
              </div>
            ) : allCities.length === 0 ? (
              <div className="text-center py-12 text-neutral-medium-gray">
                <p>No cities with properties yet.</p>
              </div>
            ) : (
              <div
                className={
                  allCities.length <= 4
                    ? 'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto'
                    : allCities.length <= 9
                      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5'
                      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'
                }
              >
                {allCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onCitySelect?.(city);
                    setShowAllCities(false);
                  }}
                  className="flex flex-col items-center space-y-3 group cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary-coral/50 flex items-center justify-center text-2xl sm:text-3xl group-hover:border-primary-coral group-hover:scale-110 transition-all bg-white shadow-md hover:shadow-lg">
                    {city.icon || '🏘️'}
                  </div>
                  <div className="text-center bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm w-full min-h-[60px] flex flex-col items-center justify-center">
                    <p 
                      className="text-xs sm:text-sm font-semibold text-neutral-charcoal group-hover:text-primary-coral transition-colors leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      title={city.name}
                    >
                      {city.name}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-neutral-dark-gray mt-1 whitespace-nowrap">
                      {city.propertyCount} properties
                    </p>
                  </div>
                </button>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
