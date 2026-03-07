import type { Offer } from '../../types';
import { Gift, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';
import AppImage from '../common/AppImage';

export default function OffersSection() {
  const [offers, setOffers] = useState<(Offer & { image?: string; bankName?: string; terms?: string; host?: { name: string }; discountType?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedOfferId, setCopiedOfferId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/offers`);
        if (res.ok) {
          const data = await res.json();
          setOffers(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Failed to fetch offers', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const getDiscountText = (o: typeof offers[0]) => {
    const dt = o.discountType || 'fixed';
    return dt === 'percentage'
      ? `Up to ${o.discount}% OFF*`
      : `Up to ₹${Number(o.discount).toLocaleString()} OFF`;
  };

  const getBannerLabel = (o: typeof offers[0]) => {
    if (o.bankName) return o.bankName;
    if (o.type === 'seasonal') return `EverStays ${o.title.toLowerCase()}`;
    return o.title;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, offers.length - 3);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, offers.length - 3);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const visibleOffers = offers.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary-coral" />
              <h2 className="text-xl sm:text-h2 text-neutral-charcoal">Special Hotel Offers</h2>
            </div>
            <button className="px-3 py-1 bg-primary-coral/10 text-primary-coral rounded-full text-caption font-medium">
              Hotels
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-charcoal" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-charcoal" />
              </button>
            </div>
            <Link to="/offers" className="text-sm sm:text-body text-primary-coral font-medium hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        {/* Offers Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-border-gray">
            <Gift className="w-12 h-12 text-neutral-medium-gray mx-auto mb-3 opacity-50" />
            <p className="text-body text-neutral-medium-gray">No offers available at the moment.</p>
            <p className="text-caption text-neutral-medium-gray mt-1">Hosts can add special offers from their dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(visibleOffers.length > 0 ? visibleOffers : offers.slice(0, 3)).map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-neutral-border-gray overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image Section – no hard borders, placeholder if no image */}
                <div className="relative h-64 overflow-hidden">
                  <AppImage
                    src={offer.image || null}
                    alt={offer.title}
                    containerClassName="w-full h-full"
                  />
                  {/* Banner */}
                  <div className="absolute top-0 left-0 right-0 bg-primary-coral text-neutral-light-gray px-4 py-2">
                    <p className="text-caption font-semibold uppercase">{getBannerLabel(offer)}</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-h3 font-bold text-neutral-charcoal mb-1">
                    {getDiscountText(offer)}
                  </h3>
                  <p className="text-sm sm:text-body text-neutral-medium-gray mb-3 sm:mb-4">{offer.description}</p>
                  {offer.terms && (
                    <p className="text-xs sm:text-caption text-neutral-medium-gray mb-3 sm:mb-4">{offer.terms}</p>
                  )}

                  {/* Promo Code – click to copy */}
                  {offer.code && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(offer.code!).then(() => {
                          setCopiedOfferId(offer.id);
                          setTimeout(() => setCopiedOfferId(null), 2000);
                        }).catch(() => {});
                      }}
                      className="w-full bg-primary-coral text-neutral-light-gray rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 mb-2 sm:mb-3 font-mono font-bold text-sm sm:text-body hover:bg-opacity-90 transition-colors"
                    >
                      {copiedOfferId === offer.id ? 'Copied!' : offer.code}
                    </button>
                  )}

                  {/* View Details Link */}
                  <Link to={`/offers/${offer.id}`} className="text-sm sm:text-body text-primary-coral font-medium hover:underline flex items-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
