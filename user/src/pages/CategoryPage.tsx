import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/header/GlobalHeader';
import BackButton from '../components/common/BackButton';
import PropertyGrid from '../components/property/PropertyGrid';
import { useWishlist } from '../hooks/useWishlist';
import Footer from '../components/common/Footer';
import { Home, Filter, MapPin, Calendar, DollarSign, Star, ChevronDown } from 'lucide-react';
import type { Property } from '../types';

import { API_BASE_URL } from '../config/api';
import AppImage from '../components/common/AppImage';
import { mapApiPropertyToFrontend } from '../utils/propertyUtils';

// Map category names to their display names
const categoryDisplayNames: Record<string, string> = {
  'stays': 'Stays',
  'villas': 'Villas & Homes',
  'experiences': 'Experiences',
  'adventure': 'Adventure',
  'workation': 'Workation',
  'long-stays': 'Long Stays',
  'food-dining': 'Food & Dining',
};

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; description: string; image: string } | null>(null);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'location' | 'newest'>('newest');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterPriceRange, setFilterPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  const displayName = categoryName ? categoryDisplayNames[categoryName] || categoryName : 'Category';

  useEffect(() => {
    const fetchCategoryAndProperties = async () => {
      setIsLoading(true);
      setCategoryError(null);
      setCategoryInfo(null);
      setProperties([]);
      setFilteredProperties([]);

      try {
        let category: any = null;

        // Fetch category info
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories?isActive=true`);
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          const categories = Array.isArray(data) ? data : (data?.categories || data?.data || []);
          category = categories.find((c: any) => {
            const normalizedName = c.name?.toLowerCase().replace(/\s+/g, '-') || '';
            return c.link === `/${categoryName}` ||
              c.link === `/category/${categoryName}` ||
              normalizedName === categoryName ||
              (categoryName === 'stays' && (c.link === '/stays' || c.name?.toLowerCase() === 'stays'));
          }) || null;

          if (category) {
            setCategoryInfo({
              name: category.name,
              description: category.description,
              image: category.image,
            });
          }
        }

        // Fetch properties - use categoryId when we have a property category
        const categoryId = category?.id;
        const isPropertyCategory = categoryName !== 'experiences' && categoryName !== 'adventure';
        const propertiesUrl = categoryId && isPropertyCategory
          ? `${API_BASE_URL}/properties?limit=100&categoryId=${categoryId}`
          : `${API_BASE_URL}/properties?limit=100`;
        const propertiesResponse = await fetch(propertiesUrl);
        
        if (propertiesResponse.ok) {
          const data = await propertiesResponse.json();
          let allProperties: Property[] = [];
          
          if (Array.isArray(data)) {
            allProperties = data.map((p: any) => mapApiPropertyToFrontend(p));
          } else if (data && Array.isArray(data.properties)) {
            allProperties = data.properties.map((p: any) => mapApiPropertyToFrontend(p));
          }

          if (categoryName === 'experiences' || categoryName === 'adventure') {
            setProperties([]);
            setFilteredProperties([]);
          } else {
            setProperties(allProperties);
            setFilteredProperties(allProperties);
            const uniqueCities = [...new Set(allProperties.map(p => p.city).filter(Boolean))];
            setCities(uniqueCities.sort());
          }
        } else {
          setCategoryError('Failed to load properties. Please try again.');
          setProperties([]);
          setFilteredProperties([]);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        setCategoryError('Unable to load category. Please try again.');
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryAndProperties();
    }
  }, [categoryName]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...properties];

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
        filtered = filtered.filter(p => p.pricePerNight >= minPrice);
      }
    }
    if (filterPriceRange.max) {
      const maxPrice = parseFloat(filterPriceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(p => p.pricePerNight <= maxPrice);
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
          return (b.hostRating || 0) - (a.hostRating || 0);
        case 'location':
          return (a.city || '').localeCompare(b.city || '');
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    setFilteredProperties(filtered);
  }, [properties, sortBy, filterLocation, filterPriceRange]);

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />

      {/* Category Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton label="Back to Home" onClick={() => navigate('/')} />

          {categoryInfo && (
            <div className="relative h-64 overflow-hidden mb-8">
              <AppImage
                src={categoryInfo.image}
                alt={categoryInfo.name}
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-light-gray mb-2">
                  {categoryInfo.name}
                </h1>
                <p className="text-lg text-neutral-light-gray/90">{categoryInfo.description}</p>
              </div>
            </div>
          )}

          {!categoryInfo && (
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-charcoal mb-2">
                {displayName}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Properties Section */}
      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Sort Section */}
          {!isLoading && properties.length > 0 && (
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
                      {cities.map((city) => (
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
                  Showing {filteredProperties.length} of {properties.length} properties
                  {filterLocation && ` in ${filterLocation}`}
                </p>
              </div>
            </div>
          )}

          {categoryError ? (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <div className="max-w-md mx-auto">
                <p className="text-body text-neutral-medium-gray mb-6">{categoryError}</p>
                <button
                  onClick={() => {
                    setCategoryError(null);
                    if (categoryName) window.location.reload();
                  }}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-coral mb-4"></div>
              <p className="text-body text-neutral-medium-gray">Loading properties...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <PropertyGrid properties={filteredProperties} wishlistIds={wishlistIds} onWishlistToggle={toggleWishlist} />
          ) : properties.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <div className="max-w-md mx-auto">
                <Filter className="w-16 h-16 text-primary-coral mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-neutral-charcoal mb-3">
                  No properties match your filters
                </h2>
                <p className="text-body text-neutral-medium-gray mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={() => {
                    setFilterLocation('');
                    setFilterPriceRange({ min: '', max: '' });
                    setShowFilters(false);
                  }}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-primary-coral" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-charcoal mb-3">
                  No property added for {displayName}
                </h2>
                <p className="text-body text-neutral-medium-gray mb-6">
                  There are currently no properties available in this category. Check back soon or explore other categories.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Explore Other Categories
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
