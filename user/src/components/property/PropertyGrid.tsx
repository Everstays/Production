import type { Property } from '../../types';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
  wishlistIds?: string[];
  onWishlistToggle?: (propertyId: string, isAdding: boolean) => void | Promise<void>;
}

export default function PropertyGrid({ properties, title, subtitle, wishlistIds = [], onWishlistToggle }: PropertyGridProps) {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-6 sm:mb-8">
            {title && <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">{title}</h2>}
            {subtitle && (
              <p className="text-sm sm:text-body text-neutral-medium-gray">{subtitle}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isInWishlist={wishlistIds.includes(property.id)}
              onWishlistToggle={onWishlistToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
