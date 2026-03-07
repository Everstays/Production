import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import {
  Heart,
  Star,
  MapPin,
  Wifi,
  Car,
  UtensilsCrossed,
  Snowflake,
  Tv,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import type { Property } from '../../types';
import BookingCard from '../booking/BookingCard';
import { mapApiPropertyToFrontend } from '../../utils/propertyUtils';
import AppImage from '../common/AppImage';

import { API_BASE_URL } from '../../config/api';
import { useGlobalLoader } from '../../context/GlobalLoaderContext';

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Parking: Car,
  Kitchen: UtensilsCrossed,
  AC: Snowflake,
  TV: Tv,
  Security: Shield,
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { setLoading: setGlobalLoading } = useGlobalLoader();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isWishlisted = property ? wishlistIds.includes(property.id) : false;

  const validImages = property?.images?.filter(img => img && img.trim()) || [];
  const totalImages = validImages.length;

  const goPrev = () => {
    setSelectedImageIndex((i) => (i <= 0 ? Math.max(0, totalImages - 1) : i - 1));
  };
  const goNext = () => {
    setSelectedImageIndex((i) => (i >= totalImages - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      setGlobalLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/properties/${id}`);
        if (res.ok) {
          let data: any;
          try {
            data = await res.json();
          } catch {
            setError('Failed to load property.');
            return;
          }
          setProperty(mapApiPropertyToFrontend(data));
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Unable to load property. Please try again.');
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };
    fetchProperty();
  }, [id, setGlobalLoading]);

  useEffect(() => {
    if (!showAllImages || totalImages <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAllImages(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAllImages, totalImages]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-body text-neutral-medium-gray">{error || 'Property not found.'}</p>
      </div>
    );
  }

  const hasImages = validImages.length > 0;
  const displayImage = hasImages ? validImages[selectedImageIndex] || validImages[0] : null;

  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    setTouchStartX(null);
  };

  return (
    <div className="pt-20 bg-white">
      {/* Image Gallery – white background, click to open viewer, counter when multiple */}
      <div className="relative bg-white">
        <div className="grid grid-cols-4 gap-2 h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div
            className="col-span-4 md:col-span-2 row-span-2 overflow-hidden cursor-pointer relative group"
            onClick={() => totalImages > 0 && setShowAllImages(true)}
          >
            <AppImage
              src={displayImage}
              alt={property.name}
              containerClassName="w-full h-full"
            />
            {totalImages > 1 && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 text-white px-3 py-2 rounded-lg text-body font-medium">
                <Images className="w-5 h-5" />
                <span>{selectedImageIndex + 1} / {totalImages}</span>
              </div>
            )}
          </div>
          {validImages.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="hidden md:block cursor-pointer overflow-hidden ring-2 ring-offset-2 ring-transparent focus-within:ring-primary-coral"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <AppImage
                src={image}
                alt={`${property.name} ${index + 2}`}
                containerClassName="w-full h-full"
              />
            </div>
          ))}
        </div>
        {totalImages > 1 && (
          <button
            onClick={() => setShowAllImages(true)}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full text-body font-medium hover:bg-primary-coral/10 transition-colors shadow-md flex items-center gap-2"
          >
            <Images className="w-5 h-5" />
            View all {totalImages} photos
          </button>
        )}
        <button
          onClick={async () => {
            const token = localStorage.getItem('userToken');
            if (!token) return;
            if (property) await toggleWishlist(property.id, !isWishlisted);
          }}
          className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-coral/10 transition-colors shadow-md"
        >
          <Heart
            className={`w-6 h-6 ${
              isWishlisted ? 'fill-primary-coral text-primary-coral' : 'text-neutral-charcoal'
            }`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h1 className="text-h1 mb-1">{property.name}</h1>
              <div className="flex items-center space-x-2 text-body text-neutral-medium-gray mb-4 flex-wrap gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>{property.location}</span>
                <span>·</span>
                <span>{property.city}</span>
                <a
                  href={property.coordinates
                    ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(`${property.location}, ${property.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-coral hover:underline font-medium flex items-center gap-1"
                >
                  View on map
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-body font-medium">{property.hostRating}</span>
                <span className="text-body text-neutral-medium-gray">
                  ({(property.reviews || []).length} reviews)
                </span>
                {property.host?.verified && (
                  <>
                    <span>·</span>
                    <span className="text-body text-neutral-medium-gray">Verified host</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-h2 mb-3">About this place</h2>
              <p className="text-body text-neutral-dark-gray leading-relaxed">{property.description}</p>
            </div>

            {(property.amenities?.length || 0) > 0 && (
              <div className="mb-6">
                <h2 className="text-h2 mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Shield;
                    return (
                      <div key={amenity} className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-neutral-charcoal" />
                        <span className="text-body">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(property.houseRules?.length || 0) > 0 && (
              <div className="mb-6">
                <h2 className="text-h2 mb-4">House rules</h2>
                <ul className="space-y-2">
                  {property.houseRules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-coral mt-1">·</span>
                      <span className="text-body text-neutral-dark-gray">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-h2 mb-4">Cancellation policy</h2>
              <p className="text-body text-neutral-dark-gray">{property.cancellationPolicy}</p>
            </div>

            {(property.reviews?.length || 0) > 0 && (
              <div className="mb-6">
                <h2 className="text-h2 mb-4">Reviews ({(property.reviews || []).length})</h2>
                <div className="space-y-6">
                  {(property.reviews || []).map((review) => (
                    <div key={review.id} className="border-b border-neutral-border-gray pb-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="text-body font-medium">{review.userName}</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-border-gray'
                                }`}
                              />
                            ))}
                            <span className="text-caption text-neutral-medium-gray ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-body text-neutral-dark-gray">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.coordinates && (
              <div className="mb-6">
                <h2 className="text-h2 mb-4">Where you'll be</h2>
                <div className="w-full h-64 bg-white rounded-lg flex items-center justify-center">
                  <p className="text-body text-neutral-medium-gray">Map integration here</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard property={property} />
            </div>
          </div>
        </div>
      </div>

      {showAllImages && hasImages && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAllImages(false)}
          role="dialog"
          aria-label="Image gallery"
        >
          <button
            onClick={() => setShowAllImages(false)}
            className="absolute top-4 right-4 z-10 text-neutral-charcoal hover:text-neutral-dark-gray p-2 rounded-full hover:bg-neutral-border-gray/30"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous – always visible, inactive when only one image */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (totalImages > 1) goPrev(); }}
            disabled={totalImages <= 1}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-neutral-border-gray bg-white text-neutral-charcoal flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white hover:bg-neutral-border-gray/20 hover:border-primary-coral"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          {/* Next – always visible, inactive when only one image */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (totalImages > 1) goNext(); }}
            disabled={totalImages <= 1}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-neutral-border-gray bg-white text-neutral-charcoal flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white hover:bg-neutral-border-gray/20 hover:border-primary-coral"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div
            className="max-w-6xl w-full flex items-center justify-center select-none bg-white"
            onTouchStart={totalImages > 1 ? handleGalleryTouchStart : undefined}
            onTouchEnd={totalImages > 1 ? handleGalleryTouchEnd : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validImages[selectedImageIndex] || validImages[0]}
              alt={`${property.name} – image ${selectedImageIndex + 1} of ${totalImages}`}
              className="w-full h-auto max-h-[90vh] object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-charcoal bg-white border border-neutral-border-gray px-4 py-2 rounded-full text-body font-medium shadow-sm">
            {selectedImageIndex + 1} / {totalImages}
          </div>
        </div>
      )}
    </div>
  );
}
