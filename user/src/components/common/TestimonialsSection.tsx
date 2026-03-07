import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../../config/api';

interface Testimonial {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
  propertyName?: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || data.reviews || []);
        setTestimonials(
          list.slice(0, 6).map((r: any) => ({
            id: r.id,
            userName: r.user?.name || 'Guest',
            userAvatar: r.user?.avatar || '',
            rating: Number(r.rating) || 5,
            comment: r.comment || '',
            location: r.property?.city || '',
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
            propertyName: r.property?.name,
          })),
        );
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h1 text-neutral-charcoal mb-4">What Our Guests Say</h2>
          <p className="text-body text-neutral-medium-gray max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our guests have to say about their EverStays experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-neutral-medium-gray">Loading reviews...</div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-medium-gray">No reviews yet.</div>
          ) : (
          testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-border-gray p-6 hover:shadow-md transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-12 h-12 text-primary-coral" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-border-gray'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-body text-neutral-dark-gray mb-6 leading-relaxed relative z-10">
                "{testimonial.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-neutral-border-gray">
                {testimonial.userAvatar ? (
                  <img
                    src={testimonial.userAvatar}
                    alt={testimonial.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-coral/20 flex items-center justify-center text-primary-coral font-semibold">
                    {testimonial.userName?.[0] || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-body font-semibold text-neutral-charcoal">
                    {testimonial.userName}
                  </p>
                  <p className="text-caption text-neutral-medium-gray">
                    {testimonial.location} • {testimonial.date}
                  </p>
                  {testimonial.propertyName && (
                    <p className="text-caption text-primary-coral mt-1">
                      {testimonial.propertyName}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )))}
        </div>

        {/* Stats - derived from reviews when available */}
        {testimonials.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-h1 text-primary-coral font-bold mb-2">
                {(testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-body text-neutral-medium-gray">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-h1 text-primary-coral font-bold mb-2">{testimonials.length}</div>
              <p className="text-body text-neutral-medium-gray">Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-h1 text-primary-coral font-bold mb-2">
                {testimonials.filter((t) => t.rating >= 4).length > 0
                  ? Math.round((testimonials.filter((t) => t.rating >= 4).length / testimonials.length) * 100)
                  : 0}%
              </div>
              <p className="text-body text-neutral-medium-gray">Positive (4+ stars)</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
