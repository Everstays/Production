import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import GlobalHeader from '../components/header/GlobalHeader';
import BackButton from '../components/common/BackButton';
import Footer from '../components/common/Footer';
import DatePicker from '../components/common/DatePicker';
import { Search, MapPin, Calendar, Star, UserCheck, ChevronDown, BookOpen, X } from 'lucide-react';
import type { Guide } from '../types';

import { API_BASE_URL } from '../config/api';

const keralaCities = [
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Alappuzha', 'Thrissur', 'Kollam',
  'Kannur', 'Kottayam', 'Palakkad', 'Malappuram', 'Ernakulam', 'Idukki',
  'Wayanad', 'Pathanamthitta', 'Kasaragod', 'Munnar', 'Varkala', 'Kumarakom',
  'Thekkady', 'Alleppey', 'Kovalam'
];

interface GuideReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name: string };
}

export default function GuidesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const [showBookModal, setShowBookModal] = useState<Guide | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<Guide | null>(null);
  const [bookDate, setBookDate] = useState<Date | null>(null);
  const [showBookDatePicker, setShowBookDatePicker] = useState(false);
  const [bookDatePickerPosition, setBookDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [bookDays, setBookDays] = useState(1);
  const [bookMessage, setBookMessage] = useState('');
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [guideReviews, setGuideReviews] = useState<Record<string, GuideReview[]>>({});

  const locationParam = searchParams.get('location') || '';
  const dateParam = searchParams.get('date') || '';

  const [editLocation, setEditLocation] = useState(locationParam);
  const [editDate, setEditDate] = useState<Date | null>(dateParam ? new Date(dateParam) : null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('userToken');
      if (userStr && token) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (locationParam.trim()) params.set('location', locationParam.trim());

        const url = `${API_BASE_URL}/guides${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setGuides(Array.isArray(data) ? data : []);
        } else {
          setError('Failed to load guides. Please try again.');
          setGuides([]);
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Unable to connect. Please check your connection and try again.');
        setGuides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, [locationParam]);

  useEffect(() => {
    setEditLocation(locationParam);
    setEditDate(dateParam ? new Date(dateParam) : null);
  }, [locationParam, dateParam]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (editLocation.trim()) params.set('location', editLocation.trim());
    if (editDate) params.set('date', format(editDate, 'yyyy-MM-dd'));
    navigate(`/guides${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (showDatePicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-date-picker]') && !dateButtonRef.current?.contains(target)) {
          setShowDatePicker(false);
          setDatePickerPosition(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const fetchGuideReviews = async (guideId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/guides/${guideId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setGuideReviews((prev) => ({ ...prev, [guideId]: Array.isArray(data) ? data : [] }));
      }
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    }
  };

  const handleBookNow = async () => {
    if (!showBookModal || !currentUser || !bookDate) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setBookSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/guides/${showBookModal.id}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bookingDate: format(bookDate, 'yyyy-MM-dd'),
          numberOfDays: bookDays,
          message: bookMessage || undefined,
        }),
      });
      if (res.ok) {
        setBookSuccess(true);
        setTimeout(() => {
          setShowBookModal(null);
          setBookSuccess(false);
          setBookDate(null);
          setBookDays(1);
          setBookMessage('');
        }, 1500);
      } else {
        let msg = 'Booking failed. Please try again.';
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch { /* ignore */ }
        alert(msg);
      }
    } catch (e) {
      console.error('Guide booking error:', e);
      alert('Failed to book. Please check your connection and try again.');
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!showReviewModal || !currentUser) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/guides/${showReviewModal.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        fetchGuideReviews(showReviewModal.id);
        setGuides((prev) =>
          prev.map((g) =>
            g.id === showReviewModal.id
              ? {
                  ...g,
                  rating: ((g.rating || 0) * (g.reviewCount || 0) + reviewRating) / ((g.reviewCount || 0) + 1),
                  reviewCount: (g.reviewCount || 0) + 1,
                }
              : g
          )
        );
        setTimeout(() => {
          setShowReviewModal(null);
          setReviewSuccess(false);
          setReviewRating(5);
          setReviewComment('');
        }, 1200);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to submit review.');
      }
    } catch (e) {
      alert('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <>
      <GlobalHeader />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BackButton label="Back to Home" onClick={() => navigate('/?section=hire-guide')} />

          {/* Search bar */}
          <div className="bg-white rounded-xl shadow-md border border-neutral-border-gray p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0 relative" ref={locationDropdownRef}>
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full text-left px-4 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral bg-white flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5 text-primary-coral flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-neutral-medium-gray">Location</p>
                    <p className="text-body font-medium text-neutral-charcoal truncate">
                      {editLocation || 'Where do you need a guide?'}
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-neutral-medium-gray transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-primary-coral/50 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {keralaCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setEditLocation(city);
                          setShowLocationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-primary-coral/10 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <button
                  ref={dateButtonRef}
                  onClick={() => {
                    const rect = dateButtonRef.current?.getBoundingClientRect();
                    if (rect) {
                      setDatePickerPosition({ top: rect.bottom + 8, left: rect.left });
                      setShowDatePicker(true);
                    }
                  }}
                  className="w-full text-left px-4 py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral bg-white flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5 text-primary-coral flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-neutral-medium-gray">Date</p>
                    <p className="text-body font-medium text-neutral-charcoal truncate">
                      {editDate ? format(editDate, 'MMM dd, yyyy') : 'Select date'}
                    </p>
                  </div>
                </button>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-primary-coral/90 transition-all font-semibold shrink-0"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {showDatePicker && datePickerPosition && (
            <div
              className="fixed z-[9999]"
              style={{ top: `${datePickerPosition.top}px`, left: `${datePickerPosition.left}px` }}
              data-date-picker
            >
              <DatePicker
                value={editDate}
                onChange={(date) => {
                  setEditDate(date);
                  setShowDatePicker(false);
                  setDatePickerPosition(null);
                }}
                minDate={new Date()}
                onClose={() => {
                  setShowDatePicker(false);
                  setDatePickerPosition(null);
                }}
              />
            </div>
          )}

          {/* Results */}
          <h1 className="text-h1 text-neutral-charcoal font-bold mb-6">
            {locationParam ? `Guides in ${locationParam}` : 'Available Guides'}
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
                  <div className="h-48 bg-white" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-white rounded w-3/4" />
                    <div className="h-4 bg-white rounded w-1/2" />
                    <div className="h-4 bg-white rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-body text-neutral-medium-gray">{error}</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <UserCheck className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4" />
              <h2 className="text-h2 text-neutral-charcoal mb-2">No guides found</h2>
              <p className="text-body text-neutral-medium-gray mb-6">
                {locationParam ? `No guides available in ${locationParam} yet. Try a different location or browse all guides.` : 'No guides are available at the moment. Check back later!'}
              </p>
              {locationParam && (
                <button
                  onClick={() => navigate('/guides')}
                  className="text-primary-coral font-semibold hover:underline"
                >
                  Browse all guides
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <article
                  key={guide.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={guide.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                    {guide.isFeatured && (
                      <span className="absolute top-3 left-3 bg-primary-coral text-neutral-light-gray text-caption font-semibold px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-h3 text-neutral-charcoal font-semibold">{guide.name}</h3>
                      <span className="flex items-center gap-1 text-caption text-neutral-charcoal">
                        <Star className={`w-4 h-4 ${(guide.rating || 0) > 0 ? 'fill-amber-400 text-amber-400' : 'text-neutral-border-gray'}`} />
                        {(guide.rating || 0) > 0
                          ? `${Number(guide.rating).toFixed(1)} (${guide.reviewCount || 0})`
                          : 'No reviews yet'}
                      </span>
                    </div>
                    <p className="text-body text-neutral-medium-gray mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary-coral flex-shrink-0" />
                      {guide.location}
                    </p>
                    {guide.host?.name && (
                      <p className="text-caption text-neutral-medium-gray mb-2">Hosted by {guide.host.name}</p>
                    )}
                    <p className="text-body text-neutral-medium-gray line-clamp-2 mb-3">{guide.description}</p>
                    {guide.languages?.length > 0 && (
                      <p className="text-caption text-neutral-medium-gray mb-2">
                        {guide.languages.join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-border-gray">
                      <span className="text-h3 text-primary-coral font-bold">
                        ₹{Number(guide.pricePerDay).toLocaleString()}
                        <span className="text-caption font-normal text-neutral-medium-gray">/day</span>
                      </span>
                      <span className={`text-caption font-medium px-2 py-1 rounded ${guide.isAvailable ? 'bg-accent-teal/20 text-accent-teal' : 'bg-gray-200 text-gray-500'}`}>
                        {guide.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            navigate('/login?redirect=/guides');
                            return;
                          }
                          setShowBookModal(guide);
                          setBookDate(editDate || new Date());
                          setBookDays(1);
                          setBookMessage('');
                        }}
                        disabled={!guide.isAvailable}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-primary-coral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        Book Now
                      </button>
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            navigate('/login?redirect=/guides');
                            return;
                          }
                          setShowReviewModal(guide);
                          setReviewRating(5);
                          setReviewComment('');
                          fetchGuideReviews(guide.id);
                        }}
                        className="px-4 py-2.5 border-2 border-primary-coral/50 text-primary-coral rounded-lg font-medium hover:bg-primary-coral/10 transition-all"
                      >
                        Rate & Review
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Book Now Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h2 font-bold text-neutral-charcoal">Book {showBookModal.name}</h3>
                <button onClick={() => setShowBookModal(null)} className="p-2 hover:bg-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {bookSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-accent-teal" />
                  </div>
                  <p className="text-h3 font-semibold text-neutral-charcoal">Booking requested!</p>
                  <p className="text-body text-neutral-medium-gray mt-1">The host will contact you soon.</p>
                </div>
              ) : (
                <>
                  <p className="text-body text-neutral-medium-gray mb-4">₹{Number(showBookModal.pricePerDay).toLocaleString()}/day</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-caption font-medium text-neutral-charcoal mb-1">Date</label>
                      <button
                        onClick={() => {
                          const rect = document.getElementById('book-date-btn')?.getBoundingClientRect();
                          if (rect) {
                            setBookDatePickerPosition({ top: rect.bottom + 8, left: rect.left });
                            setShowBookDatePicker(true);
                          }
                        }}
                        id="book-date-btn"
                        className="w-full px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-left flex items-center gap-2"
                      >
                        <Calendar className="w-5 h-5 text-primary-coral" />
                        {bookDate ? format(bookDate, 'MMM dd, yyyy') : 'Select date'}
                      </button>
                    </div>
                    <div>
                      <label className="block text-caption font-medium text-neutral-charcoal mb-1">Number of days</label>
                      <input
                        type="number"
                        min={1}
                        value={bookDays}
                        onChange={(e) => setBookDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full px-4 py-3 border-2 border-neutral-border-gray rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-medium text-neutral-charcoal mb-1">Message (optional)</label>
                      <textarea
                        value={bookMessage}
                        onChange={(e) => setBookMessage(e.target.value)}
                        placeholder="Any special requests..."
                        className="w-full px-4 py-3 border-2 border-neutral-border-gray rounded-lg resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={handleBookNow}
                      disabled={!bookDate || bookSubmitting}
                      className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-primary-coral/90 disabled:opacity-50"
                    >
                      {bookSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h2 font-bold text-neutral-charcoal">Rate {showReviewModal.name}</h3>
                <button onClick={() => setShowReviewModal(null)} className="p-2 hover:bg-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {reviewSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-h3 font-semibold text-neutral-charcoal">Thank you for your review!</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-caption font-medium text-neutral-charcoal mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setReviewRating(s)}
                          className="p-1"
                        >
                          <Star className={`w-8 h-8 ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-border-gray'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-caption font-medium text-neutral-charcoal mb-1">Your review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full px-4 py-3 border-2 border-neutral-border-gray rounded-lg resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!reviewComment.trim() || reviewSubmitting}
                    className="w-full py-3 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-primary-coral/90 disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date picker for Book modal */}
      {showBookModal && showBookDatePicker && bookDatePickerPosition && (
        <div className="fixed z-[10000]" style={{ top: `${bookDatePickerPosition.top}px`, left: `${bookDatePickerPosition.left}px` }} data-date-picker>
          <DatePicker
            value={bookDate}
            onChange={(d) => {
              setBookDate(d);
              setShowBookDatePicker(false);
            }}
            minDate={new Date()}
            onClose={() => setShowBookDatePicker(false)}
          />
        </div>
      )}
    </>
  );
}
