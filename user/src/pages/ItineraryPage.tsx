import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';

export default function ItineraryPage() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-neutral-border-gray">
          <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-primary-coral" />
          </div>
          <h1 className="text-h1 text-neutral-charcoal mb-3">Itinerary Builder</h1>
          <p className="text-body text-neutral-medium-gray mb-8">
            Plan your perfect trip. Browse stays, experiences, and activities to build a custom itinerary for your getaway.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-4 bg-primary-coral text-neutral-light-gray rounded-lg font-semibold hover:bg-primary-coral/90 transition-colors"
          >
            Start planning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
