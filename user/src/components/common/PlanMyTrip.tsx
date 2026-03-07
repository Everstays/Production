import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Camera, UtensilsCrossed, Car, Calendar, Sparkles, Gift } from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  map: Map,
  camera: Camera,
  'utensils-crossed': UtensilsCrossed,
  car: Car,
  calendar: Calendar,
  sparkles: Sparkles,
  gift: Gift,
};

interface TripPlanItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  link: string;
  sortOrder: number;
}

const DEFAULT_ITEMS: TripPlanItem[] = [
  { id: '1', name: 'Local Experiences', description: 'Discover authentic local activities', iconName: 'map', link: '/experiences', sortOrder: 0 },
  { id: '2', name: 'Photo Tours', description: 'Capture the best moments', iconName: 'camera', link: '/experiences', sortOrder: 1 },
  { id: '3', name: 'Food & Dining', description: 'Taste local cuisine', iconName: 'utensils-crossed', link: '/experiences', sortOrder: 2 },
  { id: '4', name: 'Transport', description: 'Book rides and transfers', iconName: 'car', link: '/transport', sortOrder: 3 },
  { id: '5', name: 'Itinerary Builder', description: 'Plan your perfect trip', iconName: 'calendar', link: '/itinerary', sortOrder: 4 },
];

export default function PlanMyTrip() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TripPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trip-plan-items`);
        if (response.ok) {
          const data = await response.json();
          setItems(Array.isArray(data) && data.length > 0 ? data : DEFAULT_ITEMS);
        } else {
          setItems(DEFAULT_ITEMS);
        }
      } catch {
        setItems(DEFAULT_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleClick = (item: TripPlanItem) => {
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      navigate(item.link);
    }
  };

  const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-h2 text-neutral-charcoal mb-2">Plan My Trip</h2>
          <p className="text-sm sm:text-body text-neutral-medium-gray">
            Everything you need for a perfect getaway
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayItems.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Map;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className="group bg-white p-4 sm:p-6 rounded-card hover:shadow-lg transition-shadow text-center w-full"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary-coral/10 rounded-full flex items-center justify-center group-hover:bg-primary-coral transition-colors">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-coral group-hover:text-neutral-light-gray transition-colors" />
                  </div>
                  <h3 className="text-sm sm:text-body font-medium text-neutral-charcoal mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-caption text-neutral-medium-gray">{item.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
