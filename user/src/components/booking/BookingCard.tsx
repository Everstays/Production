import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { Property } from '../../types';
import { format, addDays } from 'date-fns';
import DatePicker from '../common/DatePicker';

interface BookingCardProps {
  property: Property;
}

export default function BookingCard({ property }: BookingCardProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const guests = adults + children;
  const roomCount = Math.max(1, Math.ceil(guests / 3));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const subtotal = nights * (property.pricePerNight || 0);
  const total = subtotal;
  const isLoggedIn = !!localStorage.getItem('userToken');

  const handleReserve = () => {
    if (!checkIn || !checkOut) return;
    if (!isLoggedIn) {
      const pendingState = { checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), adults, children, property };
      sessionStorage.setItem('pendingBooking', JSON.stringify({ ...pendingState, propertyId: property.id, currentStep: 1 }));
      navigate('/signin?redirect=' + encodeURIComponent(`/booking/${property.id}`));
      return;
    }
    navigate(`/booking/${property.id}`, {
      state: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: adults + children,
        adults,
        children,
        property,
      },
    });
  };

  return (
    <div className="border border-neutral-border-gray rounded-card p-4 shadow-lg bg-white">
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-h2 font-semibold">₹{property.pricePerNight.toLocaleString()}</span>
          <span className="text-body text-neutral-medium-gray">per night</span>
        </div>
        {(property.reviews?.length ?? 0) > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-body font-medium">{property.hostRating}</span>
            <span className="text-body text-neutral-medium-gray">
              ({(property.reviews || []).length} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Date Picker */}
      <div className="mb-3">
        <div className="grid grid-cols-2 gap-2 border border-neutral-border-gray rounded-lg overflow-hidden">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-4 text-left hover:bg-white transition-colors"
          >
            <p className="text-caption text-neutral-medium-gray mb-1">CHECK-IN</p>
            <p className="text-body font-medium">
              {checkIn ? format(checkIn, 'MMM dd') : 'Add date'}
            </p>
          </button>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-4 text-left border-l border-neutral-border-gray hover:bg-white transition-colors"
          >
            <p className="text-caption text-neutral-medium-gray mb-1">CHECK-OUT</p>
            <p className="text-body font-medium">
              {checkOut ? format(checkOut, 'MMM dd') : 'Add date'}
            </p>
          </button>
        </div>
        {showDatePicker && (
          <div className="mt-2 p-4 bg-white rounded-lg" data-date-picker>
            <DatePicker
              value={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (date) setCheckOut(addDays(date, 1));
                setShowDatePicker(false);
              }}
              minDate={new Date()}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        )}
      </div>

      {/* Guest Picker */}
      <div className="mb-4">
        <button
          onClick={() => setShowGuestPicker(!showGuestPicker)}
          className="w-full p-4 border border-neutral-border-gray rounded-lg flex items-center justify-between hover:bg-white transition-colors"
        >
          <div className="text-left">
            <p className="text-caption text-neutral-medium-gray mb-1">GUESTS</p>
            <p className="text-body font-medium">{adults} adult{adults !== 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''}</p>
          </div>
          <ChevronDown className="w-5 h-5 text-neutral-medium-gray" />
        </button>
        {showGuestPicker && (
          <div className="mt-2 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-body font-medium">Adults</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white"
                >
                  -
                </button>
                <span className="text-body font-medium w-8 text-center">{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-body font-medium">Children</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white"
                >
                  -
                </button>
                <span className="text-body font-medium w-8 text-center">{children}</span>
                <button
                  onClick={() => setChildren(children + 1)}
                  className="w-8 h-8 rounded-full border border-neutral-border-gray flex items-center justify-center hover:bg-white"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-caption text-neutral-medium-gray mb-3">{roomCount} room{roomCount !== 1 ? 's' : ''} recommended</p>
            <button
              onClick={() => setShowGuestPicker(false)}
              className="w-full px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={!checkIn || !checkOut}
        className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors disabled:bg-neutral-medium-gray disabled:cursor-not-allowed mb-3"
      >
        {isLoggedIn ? 'Reserve' : 'Sign in to Reserve'}
      </button>

      {/* Price Breakdown - subtotal only, no platform fee */}
      {nights > 0 && (
        <div className="border-t border-neutral-border-gray pt-4 space-y-2">
          <div className="flex justify-between text-body">
            <span>
              ₹{property.pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-h3 font-semibold pt-2 border-t border-neutral-border-gray">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
