import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Check, Calendar, CreditCard, Shield, Gift, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { Property } from '../types';

import { API_BASE_URL } from '../config/api';
import { useGlobalLoader } from '../context/GlobalLoaderContext';

interface Offer {
  id: string;
  title: string;
  discount: number;
  discountType?: string;
  code?: string;
  expiryDate: string;
}

const steps = [
  { id: 1, name: 'Dates & Guests', icon: Calendar },
  { id: 2, name: 'Review', icon: Check },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Confirmation', icon: Shield },
];

export default function BookingPage() {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading: setGlobalLoading } = useGlobalLoader();
  const state = location.state as { checkIn?: string; checkOut?: string; guests?: number; adults?: number; children?: number; property?: Property } | null;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | null>(state?.checkIn ? new Date(state.checkIn) : new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(state?.checkOut ? new Date(state.checkOut) : null);
  const [adults, setAdults] = useState(
    state?.adults != null ? Math.max(1, state.adults) : Math.max(1, state?.guests ?? 1)
  );
  const [children, setChildren] = useState(state?.children != null ? Math.max(0, state.children) : 0);
  const guests = adults + children;
  const roomCount = Math.max(1, Math.ceil(guests / 3));
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const pricePerNight = property?.pricePerNight ?? 3500;
  const subtotal = nights * pricePerNight;
  const platformFeeRate = 0.1;
  const platformFeeGstRate = 0.18;
  const effectivePlatformFee = appliedOffer ? 0 : subtotal * platformFeeRate;
  const platformFeeGst = effectivePlatformFee * platformFeeGstRate;
  const discountAmount = appliedOffer
    ? appliedOffer.discountType === 'percentage'
      ? Math.min((subtotal * appliedOffer.discount) / 100, subtotal)
      : Math.min(appliedOffer.discount, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount + effectivePlatformFee + platformFeeGst);

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingBooking');
    if (pending && propertyId) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.propertyId === propertyId) {
          sessionStorage.removeItem('pendingBooking');
          if (parsed.checkIn) setCheckIn(new Date(parsed.checkIn));
          if (parsed.checkOut) setCheckOut(new Date(parsed.checkOut));
          if (parsed.adults != null) setAdults(parsed.adults);
          if (parsed.children != null) setChildren(parsed.children);
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
          if (parsed.property) setProperty(parsed.property);
        }
      } catch { /* ignore */ }
    }
    if (state?.property) {
      setProperty(state.property);
      setLoading(false);
      setGlobalLoading(false);
      return;
    }
    if (!propertyId) {
      setError('Invalid property.');
      setLoading(false);
      setGlobalLoading(false);
      return;
    }
    const fetchProperty = async () => {
      setGlobalLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
        if (res.ok) {
          let data: any;
          try {
            data = await res.json();
          } catch {
            setError('Failed to load property.');
            return;
          }
          setProperty({
            id: data.id,
            name: data.name,
            location: data.location,
            city: data.city,
            images: data.images || [],
            hostRating: parseFloat(data.hostRating) || 0,
            pricePerNight: parseFloat(data.pricePerNight) || 0,
            availability: data.availability || 'available',
            description: data.description || '',
            amenities: data.amenities || [],
            houseRules: data.houseRules || [],
            cancellationPolicy: data.cancellationPolicy || '',
            host: { name: data.host?.name || 'Host', avatar: '', verified: true },
            reviews: data.reviews || [],
          });
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        setError('Unable to load property.');
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, state?.property, setGlobalLoading]);

  useEffect(() => {
    if (currentStep >= 2) {
      fetch(`${API_BASE_URL}/offers`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setOffers(Array.isArray(data) ? data.slice(0, 3) : []))
        .catch(() => setOffers([]));
    }
  }, [currentStep]);

  // Auto-apply offer code when returning from offer detail page (e.g. clicked code there)
  useEffect(() => {
    const pendingCode = sessionStorage.getItem('pendingOfferCode');
    const pendingId = sessionStorage.getItem('pendingOfferId');
    if (pendingCode) {
      sessionStorage.removeItem('pendingOfferCode');
      if (pendingId) sessionStorage.removeItem('pendingOfferId');
      setPromoCode(pendingCode);
      setPromoError('');
      fetch(`${API_BASE_URL}/offers/code/${encodeURIComponent(pendingCode)}`)
        .then((res) => {
          if (res.ok) {
            return res.json().then((o: any) => {
              setAppliedOffer({
                id: o.id,
                title: o.title,
                discount: o.discount,
                discountType: o.discountType,
                code: o.code,
                expiryDate: o.expiryDate,
              });
            });
          }
          setPromoError('Invalid or expired code');
        })
        .catch(() => setPromoError('Could not verify code'));
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const handlePayAndComplete = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      const pendingState = { checkIn: checkIn?.toISOString(), checkOut: checkOut?.toISOString(), adults, children, propertyId, currentStep, property };
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingState));
      navigate('/signin?redirect=' + encodeURIComponent(`/booking/${propertyId}`));
      return;
    }
    if (!propertyId || !checkIn || !checkOut) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests,
          paymentMethod,
        }),
      });
      if (res.ok) {
        setCurrentStep(4);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          navigate('/signin?redirect=' + encodeURIComponent(`/booking/${propertyId}`) + '&session_expired=1');
          alert('Your session has expired. Please sign in again to complete your booking.');
          return;
        }
        let msg = 'Booking failed. Please try again.';
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch { /* ignore */ }
        alert(msg);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <button onClick={() => navigate('/')} className="ml-4 text-primary-coral">Go back</button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="mb-5">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary-coral text-neutral-light-gray' : 'bg-white border-2 border-neutral-border-gray text-neutral-medium-gray'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className={`mt-2 text-caption ${isCurrent ? 'font-semibold text-neutral-charcoal' : 'text-neutral-medium-gray'}`}>
                    {step.name}
                  </p>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 w-full mt-4 ${isActive ? 'bg-primary-coral' : 'bg-neutral-border-gray'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-card p-8 shadow-sm">
          {currentStep === 1 && (
            <div>
              <h2 className="text-h2 mb-6">Select Dates & Guests</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-body font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    value={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setCheckIn(new Date(e.target.value))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-3 border border-neutral-border-gray rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    value={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setCheckOut(new Date(e.target.value))}
                    min={checkIn ? format(checkIn, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-3 border border-neutral-border-gray rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2">Adults</label>
                    <input
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-3 border border-neutral-border-gray rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-3 border border-neutral-border-gray rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-body text-neutral-medium-gray">
                    {guests} guest{guests !== 1 ? 's' : ''} · {roomCount} room{roomCount !== 1 ? 's' : ''} recommended
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!checkIn || !checkOut || (checkOut && checkIn && checkOut <= checkIn)}
                className="mt-8 w-full py-4 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 disabled:bg-neutral-medium-gray disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-h2 mb-6">Review Your Booking</h2>
              <div className="space-y-6">
                <div className="border-b border-neutral-border-gray pb-6">
                  <h3 className="text-h3 mb-4">Property Details</h3>
                  <p className="text-body text-neutral-dark-gray">{property.name}</p>
                  <p className="text-body text-neutral-medium-gray">{property.location}, {property.city}</p>
                </div>
                <div className="border-b border-neutral-border-gray pb-6">
                  <h3 className="text-h3 mb-4">Dates & Guests</h3>
                  <p className="text-body text-neutral-dark-gray">
                    {checkIn && format(checkIn, 'MMM dd, yyyy')} - {checkOut && format(checkOut, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-body text-neutral-medium-gray">
                    {adults} adult{adults !== 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''} · {roomCount} room{roomCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <h3 className="text-h3 mb-4">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-body">
                      <span>₹{pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedOffer && discountAmount > 0 && (
                      <div className="flex justify-between text-body text-accent-teal">
                        <span>Promo ({appliedOffer.code})</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {effectivePlatformFee > 0 && (
                      <div className="flex justify-between text-body">
                        <span>Platform fee</span>
                        <span>₹{effectivePlatformFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-h3 font-semibold pt-4 border-t border-neutral-border-gray">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-border-gray pt-4">
                  <h3 className="text-h3 mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary-coral" />
                    Promo code
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          const v = e.target.value.toUpperCase();
                          setPromoCode(v);
                          setPromoError('');
                          if (appliedOffer && v !== appliedOffer.code) setAppliedOffer(null);
                        }}
                        placeholder="Enter promo code"
                        className="w-full pl-10 pr-4 py-3 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!promoCode.trim()) return;
                        try {
                          const res = await fetch(`${API_BASE_URL}/offers/code/${encodeURIComponent(promoCode.trim())}`);
                          if (res.ok) {
                            const o = await res.json();
                            setPromoError('');
                            setAppliedOffer({
                              id: o.id,
                              title: o.title,
                              discount: o.discount,
                              discountType: o.discountType,
                              code: o.code,
                              expiryDate: o.expiryDate,
                            });
                          } else {
                            setPromoError('Invalid or expired code');
                            setAppliedOffer(null);
                          }
                        } catch {
                          setPromoError('Could not verify code');
                          setAppliedOffer(null);
                        }
                      }}
                      className="px-4 py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-medium whitespace-nowrap hover:bg-opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-sm text-neutral-charcoal mt-1">{promoError}</p>}
                  {appliedOffer && (
                    <p className="text-sm text-accent-teal font-medium mt-1">
                      Promo {appliedOffer.code} applied · ₹{discountAmount.toLocaleString()} off, platform fee waived
                    </p>
                  )}
                  {offers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {offers.slice(0, 3).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => {
                            if (o.code) {
                              setPromoCode(o.code);
                              setPromoError('');
                              navigator.clipboard?.writeText(o.code).catch(() => {});
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-coral/10 text-primary-coral rounded-lg text-sm font-medium hover:bg-primary-coral/20 transition-colors"
                        >
                          {o.discountType === 'percentage' ? `${o.discount}% OFF` : `₹${o.discount} OFF`}
                          {o.code && <span className="opacity-80">· {o.code}</span>}
                        </button>
                      ))}
                      <Link to="/offers" className="inline-flex items-center gap-1 px-3 py-1.5 text-primary-coral text-sm font-medium hover:underline">
                        View all
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 border border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-h2 mb-6">Payment</h2>
              <div className="space-y-6">
                <h3 className="text-h3 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Debit/Credit Card', icon: CreditCard },
                    { value: 'upi', label: 'UPI', icon: CreditCard },
                    { value: 'wallet', label: 'Wallet', icon: CreditCard },
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value} className="flex items-center p-4 border-2 border-neutral-border-gray rounded-lg cursor-pointer hover:border-primary-coral">
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <Icon className="w-5 h-5 mr-3 text-neutral-medium-gray" />
                      <span className="text-body font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                {!appliedOffer && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-medium-gray" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            const v = e.target.value.toUpperCase();
                            setPromoCode(v);
                            setPromoError('');
                          }}
                          placeholder="Enter promo code"
                          className="w-full pl-10 pr-4 py-3 border-2 border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!promoCode.trim()) return;
                          try {
                            const res = await fetch(`${API_BASE_URL}/offers/code/${encodeURIComponent(promoCode.trim())}`);
                            if (res.ok) {
                              const o = await res.json();
                              setPromoError('');
                              setAppliedOffer({
                                id: o.id,
                                title: o.title,
                                discount: o.discount,
                                discountType: o.discountType,
                                code: o.code,
                                expiryDate: o.expiryDate,
                              });
                            } else {
                              setPromoError('Invalid or expired code');
                              setAppliedOffer(null);
                            }
                          } catch {
                            setPromoError('Could not verify code');
                            setAppliedOffer(null);
                          }
                        }}
                        className="px-4 py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-medium whitespace-nowrap hover:bg-opacity-90"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-sm text-neutral-charcoal mt-1">{promoError}</p>}
                  </div>
                )}
                <div className="border-t border-neutral-border-gray pt-6 mt-6">
                  <h3 className="text-h3 mb-4">Final Payment Summary</h3>
                  <div className="space-y-2 bg-white/50 rounded-lg p-4">
                    <div className="flex justify-between text-body">
                      <span>₹{pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedOffer && discountAmount > 0 && (
                      <div className="flex justify-between text-body text-accent-teal">
                        <span>Promo ({appliedOffer.code})</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {effectivePlatformFee > 0 && (
                      <>
                        <div className="flex justify-between text-body">
                          <span>Platform fee</span>
                          <span>₹{effectivePlatformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-body text-neutral-medium-gray">
                          <span>CGST (9% on platform fee)</span>
                          <span>₹{(effectivePlatformFee * 0.09).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-body text-neutral-medium-gray">
                          <span>SGST (9% on platform fee)</span>
                          <span>₹{(effectivePlatformFee * 0.09).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-h3 font-semibold pt-4 border-t border-neutral-border-gray">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 border border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white"
                >
                  Back
                </button>
                <button
                  onClick={handlePayAndComplete}
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 disabled:opacity-70"
                >
                  {submitting ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-accent-teal" />
              </div>
              <h2 className="text-h2 mb-4">Booking Confirmed!</h2>
              <p className="text-body text-neutral-medium-gray mb-8">
                Your booking has been confirmed. You'll receive a confirmation email shortly.
              </p>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90"
              >
                View My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
