import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';
import BackButton from '../components/common/BackButton';
import AppImage from '../components/common/AppImage';
import { API_BASE_URL } from '../config/api';
import { useGlobalLoader } from '../context/GlobalLoaderContext';

interface Experience {
  id: string;
  name: string;
  location: string;
  city: string;
  images?: string[];
  image?: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  category: string;
  description: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name: string };
}

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLoading: setGlobalLoading } = useGlobalLoader();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const validImages = experience?.images?.filter((img) => img && img.trim()) || (experience?.image ? [experience.image] : []);
  const totalImages = validImages.length;
  const hasMultipleImages = totalImages > 1;

  const goPrev = () => {
    setSelectedImageIndex((i) => (i <= 0 ? totalImages - 1 : i - 1));
  };
  const goNext = () => {
    setSelectedImageIndex((i) => (i >= totalImages - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!id) return;
    const fetchExperience = async () => {
      setLoading(true);
      setGlobalLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/experiences/${id}`);
        if (res.ok) {
          const data = await res.json();
          setExperience({
            id: data.id,
            name: data.name,
            location: data.location,
            city: data.city,
            images: data.images || (data.image ? [data.image] : []),
            image: data.image,
            rating: Number(data.rating) || 0,
            reviewCount: data.reviewCount ?? (data.reviews?.length ?? 0),
            price: Number(data.price) || 0,
            duration: data.duration || '',
            category: data.category || '',
            description: data.description || '',
          });
        } else {
          setError('Experience not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };
    fetchExperience();
  }, [id, setGlobalLoading]);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/experiences/${id}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error('Failed to fetch reviews', e);
      }
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!experience) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/experiences/${experience.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        const reviewsRes = await fetch(`${API_BASE_URL}/experiences/${experience.id}/reviews`);
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(Array.isArray(data) ? data : []);
        }
        setExperience((prev) =>
          prev
            ? {
                ...prev,
                rating: (prev.rating * (prev.reviewCount || 0) + reviewRating) / ((prev.reviewCount || 0) + 1),
                reviewCount: (prev.reviewCount || 0) + 1,
              }
            : null
        );
        setTimeout(() => setReviewSuccess(false), 1500);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-body text-neutral-medium-gray">{error || 'Experience not found.'}</p>
        <button onClick={() => navigate('/experiences')} className="ml-4 text-primary-coral font-medium">
          Back to experiences
        </button>
      </div>
    );
  }

  const currentImage = validImages[selectedImageIndex] || validImages[0];

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton label="Back to experiences" onClick={() => navigate(-1)} />

          {/* Image gallery – full width, with prev/next (inactive when single image) */}
          <div className="relative bg-white rounded-2xl overflow-hidden border border-neutral-border-gray mb-8">
            <div className="relative aspect-[16/10] sm:aspect-[2/1] bg-neutral-border-gray/30">
              <AppImage
                src={currentImage}
                alt={experience.name}
                containerClassName="w-full h-full"
              />
              {totalImages > 1 && (
                <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-caption font-medium">
                  {selectedImageIndex + 1} / {totalImages}
                </div>
              )}
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasMultipleImages}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neutral-border-gray bg-white text-neutral-charcoal flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-border-gray/20 hover:border-primary-coral disabled:hover:bg-white disabled:hover:border-neutral-border-gray"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasMultipleImages}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neutral-border-gray bg-white text-neutral-charcoal flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-border-gray/20 hover:border-primary-coral disabled:hover:bg-white disabled:hover:border-neutral-border-gray"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-h1 font-bold text-neutral-charcoal mb-4">{experience.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-body text-neutral-medium-gray mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {(Number(experience.rating) || 0).toFixed(1)} ({experience.reviewCount || 0} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {experience.duration}
            </span>
          </div>
          <p className="text-body font-semibold text-neutral-charcoal mb-6">
            ₹{Number(experience.price).toLocaleString()} / person
          </p>
          {experience.description && (
            <p className="text-body text-neutral-medium-gray mb-8">{experience.description}</p>
          )}

          {reviews.length > 0 && (
            <div className="border-t border-neutral-border-gray pt-6 mb-8">
              <h2 className="text-h2 font-semibold text-neutral-charcoal mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.slice(0, 10).map((r) => (
                  <div key={r.id} className="bg-white border border-neutral-border-gray rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-border-gray'}`}
                          />
                        ))}
                      </div>
                      <span className="text-caption text-neutral-medium-gray">{r.user?.name || 'Anonymous'}</span>
                    </div>
                    {r.comment && <p className="text-body text-neutral-charcoal">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-border-gray pt-6">
            <h2 className="text-h2 font-semibold text-neutral-charcoal mb-4">Rate this experience</h2>
            {localStorage.getItem('userToken') ? (
              reviewSuccess ? (
                <p className="text-accent-teal font-medium py-4">Thank you for your review!</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            i <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-border-gray hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-body font-medium">{reviewRating}/5</span>
                  </div>
                  <textarea
                    placeholder="Share your experience (optional)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg text-body min-h-[100px] resize-none focus:border-primary-coral focus:outline-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting}
                    className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 py-3 text-body font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                  >
                    {reviewSubmitting ? 'Submitting…' : 'Submit Rating'}
                  </button>
                </div>
              )
            ) : (
              <p className="text-body text-neutral-medium-gray">
                <button onClick={() => navigate('/login')} className="text-primary-coral font-medium hover:underline">
                  Log in
                </button>{' '}
                to rate this experience.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
