import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlobalHeader from '../components/header/GlobalHeader';
import BackButton from '../components/common/BackButton';
import OffersSection from '../components/offers/OffersSection';
import PropertyGrid from '../components/property/PropertyGrid';
import { useWishlist } from '../hooks/useWishlist';
import Footer from '../components/common/Footer';
import type { Property } from '../types';
import { mapApiPropertyToFrontend } from '../utils/propertyUtils';

import { API_BASE_URL } from '../config/api';

export default function OffersPage() {
  const navigate = useNavigate();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [propertiesWithOffers, setPropertiesWithOffers] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/properties/with-offers?limit=20`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'No properties with offers found' : 'Failed to load properties');
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.properties || data.data || []);
      setPropertiesWithOffers(list.map((p: any) => mapApiPropertyToFrontend(p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load properties with offers');
      setPropertiesWithOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div>
      <GlobalHeader />
      
      {/* Hero Section – back button top-left, then centered title */}
      <section className="relative pb-8 sm:pb-12 pt-16 sm:pt-20 bg-white">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pt-20 sm:pt-24">
            <div className="flex justify-start mb-4 sm:mb-6">
              <BackButton label="Back to previous" onClick={() => navigate(-1)} className="mb-0" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-h1 mb-3 sm:mb-4 text-neutral-charcoal">Special Offers & Deals</h1>
              <p className="text-sm sm:text-body text-neutral-medium-gray max-w-2xl mx-auto">
                Don't miss out on these exclusive deals and save on your next stay
              </p>
            </motion.div>
          </div>
        </section>

      {/* Offers Section */}
      <OffersSection />

      {/* Properties with Offers - fetched from API */}
      {error ? (
        <section className="py-8 sm:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">Properties with Special Offers</h2>
              <p className="text-sm sm:text-body text-neutral-medium-gray">Book now and save big</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-12 text-center">
              <p className="text-body text-neutral-medium-gray mb-6">{error}</p>
              <button
                onClick={fetchProperties}
                className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      ) : (
        <PropertyGrid
          properties={propertiesWithOffers}
          title="Properties with Special Offers"
          subtitle={loading ? 'Loading...' : propertiesWithOffers.length === 0 ? 'No properties with offers at the moment. Hosts can add offers from their dashboard.' : 'Book now and save big'}
          wishlistIds={wishlistIds}
          onWishlistToggle={toggleWishlist}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
