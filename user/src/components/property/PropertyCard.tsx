import { useState } from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { motion } from 'framer-motion';
import AppImage from '../common/AppImage';

interface PropertyCardProps {
  property: Property;
  isInWishlist?: boolean;
  onWishlistToggle?: (propertyId: string, isAdding: boolean) => void | Promise<void>;
}

export default function PropertyCard({ property, isInWishlist = false, onWishlistToggle }: PropertyCardProps) {
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = onWishlistToggle ? isInWishlist : localWishlisted;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      await onWishlistToggle(property.id, !isInWishlist);
    } else {
      setLocalWishlisted(!localWishlisted);
    }
  };

  const availabilityColors = {
    available: 'bg-accent-teal',
    limited: 'bg-yellow-400',
    booked: 'bg-neutral-medium-gray',
  };

  // Filter out null/undefined/empty images
  const validImages = property.images?.filter(img => img && img.trim() !== '') || [];
  const hasImages = validImages.length > 0;
  const currentImage = hasImages ? validImages[currentImageIndex] : null;

  return (
    <Link to={`/property/${property.id}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative overflow-hidden bg-white rounded-lg">
          {/* Image Carousel – no hard borders */}
          <div className="relative aspect-[4/3] overflow-hidden bg-white">
            <AppImage
              src={currentImage}
              alt={property.name}
              containerClassName="absolute inset-0"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            {/* Image Indicators */}
            {validImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {validImages.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'fill-primary-coral text-primary-coral' : 'text-neutral-charcoal'
                }`}
              />
            </button>
            {/* Availability Badge */}
            {property.availability !== 'available' && (
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-caption font-medium text-neutral-light-gray ${
                    availabilityColors[property.availability]
                  }`}
                >
                  {property.availability === 'limited' ? 'Limited' : 'Booked'}
                </span>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-h3 text-neutral-charcoal mb-1 line-clamp-1">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 flex-wrap text-xs sm:text-caption text-neutral-medium-gray mb-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                  <a
                    href={property.coordinates
                      ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`
                      : `https://www.google.com/maps/search/${encodeURIComponent(`${property.location}, ${property.city}`)}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-coral hover:underline flex-shrink-0"
                  >
                    Map
                  </a>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2 sm:mb-3">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm sm:text-body font-medium text-neutral-charcoal">
                {property.hostRating}
              </span>
              <span className="text-xs sm:text-caption text-neutral-medium-gray">
                ({(property.reviews?.length ?? 0)} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm sm:text-body font-semibold text-neutral-charcoal">
                  ₹{property.pricePerNight.toLocaleString()}
                  <span className="text-xs sm:text-caption font-normal text-neutral-medium-gray"> / night</span>
                </p>
                {property.totalPrice && (
                  <p className="text-xs sm:text-caption text-neutral-medium-gray">
                    ₹{property.totalPrice.toLocaleString()} total
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
