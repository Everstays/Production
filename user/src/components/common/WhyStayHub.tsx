import { useState } from 'react';
import { Building2, Tag, Umbrella, CheckCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  title: string;
  icon: any;
  content: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    title: 'Why to book Hotels with EverStays.com',
    icon: Building2,
    content:
      'In the post-pandemic world, we understand the importance of safe and hygienic stays. EverStays offers sanitized rooms across Indian cities with features like "Clean Pass stays," "travel again offers," and "long stay discounts" to encourage travel and reduce anxiety. All our partner properties follow strict hygiene protocols to ensure your safety and comfort.',
  },
  {
    id: '2',
    title: 'EverStays Hotel Offers and Deals',
    icon: Tag,
    content:
      'Get the best deals and exclusive offers on hotel bookings. From bank offers to seasonal discounts, first-time user benefits to long-stay packages, we have something for everyone. Check our offers section regularly for the latest deals and promo codes to save on your next stay.',
  },
  {
    id: '3',
    title: 'The Travel Again Offer',
    icon: Umbrella,
    content:
      'Our special "Travel Again" offer is designed to make your travel dreams come true. Enjoy exclusive discounts, flexible cancellation policies, and bonus rewards when you book with EverStays. This offer is our way of encouraging safe travel and helping you explore amazing destinations.',
  },
  {
    id: '4',
    title: 'Find the best combination, tailor your trip',
    icon: CheckCircle,
    content:
      'Plan your perfect trip with EverStays\' comprehensive travel solutions. Combine flights, hotels, and experiences to create a customized itinerary that fits your budget and preferences. Our platform helps you find the best combinations and offers personalized recommendations for an unforgettable journey.',
  },
];

export default function WhyStayHub() {
  const [openItem, setOpenItem] = useState<string | null>('1');

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-h1 mb-8 sm:mb-12 text-center text-neutral-charcoal">Why EverStays?</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openItem === item.id;
            
            return (
              <div
                key={item.id}
                className="bg-white border border-neutral-border-gray rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-coral/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-coral" />
                    </div>
                    <h3 className="text-base sm:text-h3 text-neutral-charcoal font-medium">{item.title}</h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-medium-gray transition-transform flex-shrink-0 ml-2 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-14 sm:pl-20">
                    <p className="text-sm sm:text-body text-neutral-dark-gray leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
