import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';
import BackButton from '../components/common/BackButton';

import { API_BASE_URL } from '../config/api';
import { useGlobalLoader } from '../context/GlobalLoaderContext';
import AppImage from '../components/common/AppImage';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType?: string;
  validFrom?: string;
  expiryDate: string;
  type: string;
  code?: string;
  image?: string;
  bankName?: string;
  terms?: string;
  host?: { name?: string; role?: string };
}

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLoading: setGlobalLoading } = useGlobalLoader();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchOffer = async () => {
      setIsLoading(true);
      setGlobalLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/offers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOffer(data);
        } else {
          setError('Offer not found');
        }
      } catch (e) {
        console.error('Failed to fetch offer', e);
        setError('Failed to load offer');
      } finally {
        setIsLoading(false);
        setGlobalLoading(false);
      }
    };
    fetchOffer();
  }, [id, setGlobalLoading]);

  const getDiscountText = () => {
    if (!offer) return '';
    const dt = offer.discountType || 'fixed';
    return dt === 'percentage'
      ? `Up to ${offer.discount}% OFF*`
      : `Up to ₹${Number(offer.discount).toLocaleString()} OFF`;
  };

  const isExpired = offer ? new Date(offer.expiryDate) < new Date() : false;

  // Do not show host name or admin/role – use neutral labels only
  const getBannerLabel = () => {
    if (!offer) return '';
    if (offer.bankName) return offer.bankName;
    if (offer.type === 'seasonal') return `EverStays ${offer.title.toLowerCase()}`;
    return offer.title;
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton
            label="Back to offers"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/offers');
              }
            }}
            className="mb-8 relative z-10"
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral" />
            </div>
          ) : error || !offer ? (
            <div className="text-center py-20">
              <Gift className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4 opacity-50" />
              <h2 className="text-h2 text-neutral-charcoal mb-2">
                {error || 'Offer not found'}
              </h2>
              <p className="text-body text-neutral-medium-gray mb-6">
                This offer may have expired or been removed.
              </p>
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 text-primary-coral font-medium hover:underline"
              >
                View all offers
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-neutral-border-gray overflow-hidden shadow-sm"
            >
              {/* Image – no hard borders, placeholder if no image */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <AppImage
                  src={offer.image || null}
                  alt={offer.title}
                  containerClassName="w-full h-full"
                />
                <div className="absolute top-0 left-0 right-0 bg-primary-coral text-neutral-light-gray px-6 py-3 flex items-center justify-between">
                  <p className="text-body font-semibold uppercase">{getBannerLabel()}</p>
                  {isExpired && (
                    <span className="bg-white/20 px-3 py-1 rounded text-caption font-medium">
                      Expired
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-h1 font-bold text-neutral-charcoal mb-4">
                  {getDiscountText()}
                </h1>
                <p className="text-body text-neutral-medium-gray mb-6 whitespace-pre-wrap">
                  {offer.description}
                </p>
                {offer.terms && (
                  <p className="text-caption text-neutral-medium-gray mb-6 p-4 bg-white rounded-lg">
                    {offer.terms}
                  </p>
                )}

                {/* Promo Code – click to auto-apply and go back to previous page (e.g. checkout) */}
                {offer.code && (
                  <div className="mb-6">
                    <p className="text-caption text-neutral-medium-gray mb-2">Click to apply this offer at checkout:</p>
                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem('pendingOfferCode', offer.code!);
                        sessionStorage.setItem('pendingOfferId', offer.id);
                        navigator.clipboard?.writeText(offer.code!).catch(() => {});
                        navigate(-1);
                      }}
                      className="w-full sm:w-auto min-w-[200px] bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-4 font-mono font-bold text-lg hover:bg-opacity-90 transition-colors"
                    >
                      {offer.code}
                    </button>
                  </div>
                )}

                <div className="text-caption text-neutral-medium-gray">
                  {offer.validFrom && new Date(offer.validFrom).getTime() !== new Date(offer.expiryDate).getTime()
                    ? `Valid from ${new Date(offer.validFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} until ${new Date(offer.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    : `Valid until ${new Date(offer.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  }
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
