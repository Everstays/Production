import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

import { API_BASE_URL } from '../../config/api';
import AppImage from './AppImage';

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Stays', description: 'Comfortable homes for every trip', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', link: '/category/stays' },
  { id: '2', name: 'Villas & Homes', description: 'Luxury villas and private homes', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', link: '/category/villas' },
  { id: '3', name: 'Experiences', description: 'Unique activities and tours', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', link: '/category/experiences' },
  { id: '4', name: 'Adventure', description: 'Thrilling outdoor experiences', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', link: '/category/adventure' },
  { id: '5', name: 'Workation', description: 'Perfect spaces for remote work', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800', link: '/category/workation' },
  { id: '6', name: 'Long Stays', description: 'Monthly rentals with discounts', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', link: '/category/long-stays' },
];

function getFallbackCategories(): Category[] {
  return FALLBACK_CATEGORIES;
}

export default function FeaturedCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/categories?isActive=true`);
        if (response.ok) {
          const data = await response.json();
          let list: any[] = [];
          if (Array.isArray(data)) list = data;
          else if (Array.isArray(data?.categories)) list = data.categories;
          else if (Array.isArray(data?.data)) list = data.data;
          setCategories(list);
        } else {
          setCategories(getFallbackCategories());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(getFallbackCategories());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category, e: React.MouseEvent) => {
    e.preventDefault();
    // Extract path: /category/stays -> stays, /category/villas -> villas
    let categoryPath = category.link.replace(/^\/category\/?/, '').replace(/^\//, '') || 'stays';
    navigate(`/category/${categoryPath}`);
  };

  return (
    <>
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">Explore by Category</h2>
            <p className="text-sm sm:text-body text-neutral-medium-gray">
              Find the perfect stay for your next adventure
            </p>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body text-neutral-medium-gray">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
              <div
                key={category.id}
                onClick={(e) => handleCategoryClick(category, e)}
                className="group relative h-56 sm:h-64 overflow-hidden cursor-pointer"
              >
                <AppImage
                  src={category.image}
                  alt={category.name}
                  containerClassName="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-neutral-light-gray">
                  <h3 className="text-lg sm:text-h3 mb-1">{category.name}</h3>
                  <p className="text-sm sm:text-body mb-2 sm:mb-3 opacity-90">{category.description}</p>
                  <div className="flex items-center space-x-2 text-sm sm:text-body font-medium group-hover:translate-x-2 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
