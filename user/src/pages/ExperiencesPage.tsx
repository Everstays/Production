import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, MapPin, Plus, Sparkles } from 'lucide-react';
import ExperiencesGrid from '../components/common/ExperiencesGrid';
import Footer from '../components/common/Footer';

const CITIES = ['Kochi', 'Munnar', 'Alappuzha', 'Thiruvananthapuram', 'Wayanad'];

export default function ExperiencesPage() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin');
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCity(searchLocation.trim());
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Search Section */}
      <div className="bg-white border-b border-neutral-border-gray py-6 sm:py-8">
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral transition-all">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-coral flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Kochi, Munnar)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  list="cities-list"
                  className="flex-1 outline-none text-sm sm:text-body text-neutral-charcoal placeholder-neutral-medium-gray"
                />
                <datalist id="cities-list">
                  {CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-primary-coral/50 rounded-lg hover:border-primary-coral transition-all">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-coral flex-shrink-0" />
                <input
                  type="date"
                  placeholder="Select date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="flex-1 outline-none text-sm sm:text-body text-neutral-charcoal"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary-coral text-neutral-light-gray rounded-lg px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all font-semibold text-sm sm:text-body"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin CTA - Add your experience */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <a
            href="http://api.everstays.in?tab=experiences&add=true"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-coral/10 border-2 border-primary-coral/50 rounded-xl hover:bg-primary-coral/20 transition-colors text-primary-coral font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add your experience</span>
            <Sparkles className="w-5 h-5" />
          </a>
        </div>
      )}

      {/* Experiences Grid */}
      <ExperiencesGrid searchCity={searchCity || undefined} searchCategory={urlCategory || undefined} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
