import { useState, useEffect } from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';
import AppImage from './AppImage';

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

interface ExperiencesGridProps {
  searchCity?: string;
  searchCategory?: string;
}

export default function ExperiencesGrid({ searchCity, searchCategory }: ExperiencesGridProps = {}) {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (searchCity) params.set('city', searchCity);
        if (searchCategory) params.set('category', searchCategory);
        const url = `${API_BASE_URL}/experiences${params.toString() ? `?${params}` : ''}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setExperiences(Array.isArray(data) ? data : []);
        } else {
          setError('Failed to load experiences');
          setExperiences([]);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences');
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [searchCity, searchCategory]);

  const handleExperienceClick = (e: React.MouseEvent, exp: Experience) => {
    e.preventDefault();
    navigate(`/experiences/${exp.id}`);
  };

  return (
    <>
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-h1 text-neutral-charcoal mb-6 sm:mb-8">Popular Experiences</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
          ) : error ? (
            <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body text-neutral-medium-gray">No experiences available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {experiences.map((experience) => {
                const imageUrl = experience.images?.[0] || experience.image || null;
                return (
                  <button
                    key={experience.id}
                    onClick={(e) => handleExperienceClick(e, experience)}
                    className="block bg-white overflow-hidden hover:shadow-lg transition-shadow text-left w-full"
                  >
                    {/* Image – no hard borders */}
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <AppImage
                        src={imageUrl}
                        alt={experience.name}
                        containerClassName="w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-lg sm:text-h3 text-neutral-charcoal mb-2">{experience.name}</h3>
                      
                      <div className="flex items-center space-x-1 text-caption text-neutral-medium-gray mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{experience.location}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-body font-medium">{(Number(experience.rating) || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-caption text-neutral-medium-gray">
                          <Clock className="w-3 h-3" />
                          <span>{experience.duration}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-border-gray">
                        <p className="text-body font-semibold text-neutral-charcoal">
                          ₹{Number(experience.price).toLocaleString()}
                          <span className="text-caption font-normal text-neutral-medium-gray"> / person</span>
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
