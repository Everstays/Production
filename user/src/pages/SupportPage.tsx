import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';

import { API_BASE_URL } from '../config/api';

const faqs = [
  {
    id: '1',
    question: 'How do I cancel my booking?',
    answer:
      'You can cancel your booking from the "My Bookings" section in your dashboard. Cancellation policies vary by property and are clearly stated during booking.',
  },
  {
    id: '2',
    question: 'What is the refund policy?',
    answer:
      'Refund policies depend on the property and cancellation policy selected. Free cancellation properties offer full refunds up to the specified time before check-in.',
  },
  {
    id: '3',
    question: 'How do I contact the host?',
    answer:
      'You can contact the host through the messaging system available in your booking details. Hosts typically respond within 24 hours.',
  },
  {
    id: '4',
    question: 'What if I have issues during my stay?',
    answer:
      'Contact the host immediately through the app. If the issue cannot be resolved, contact our 24/7 support team for assistance.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Booking Issue' as 'Booking Issue' | 'Cancellation Help' | 'Payment Issue' | 'Other',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Prefill name and email from user API when logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    fetch(`${API_BASE_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        if (user) {
          setContactForm((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem('userToken');
      const userStr = localStorage.getItem('user');
      let userId = undefined;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id;
        } catch (err) {
          // Ignore parsing errors
        }
      }

      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...contactForm,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setContactForm({
          name: '',
          email: '',
          subject: 'Booking Issue',
          message: '',
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-border-gray py-8 sm:py-12 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-h1 mb-3 sm:mb-4 text-neutral-charcoal">Help Center</h1>
          <p className="text-sm sm:text-body text-neutral-medium-gray">
            Find answers to common questions or contact our support team
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-white pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Support Request Form */}
        <div className="bg-white rounded-card p-4 sm:p-8 shadow-sm border border-neutral-border-gray mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-h2 mb-4 sm:mb-6">Submit a support request</h2>
          <p className="text-sm sm:text-body text-neutral-medium-gray mb-4">
            Tell us about your issue and we&apos;ll get back to you as soon as possible.
          </p>
          <p className="text-sm text-primary-coral font-medium mb-6">
            Need customization? Contact our support team for tailored solutions.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-sm sm:text-body">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm sm:text-body flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Your message has been sent successfully! We&apos;ll get back to you soon.</span>
              </div>
            )}

            <div>
              <label className="block text-sm sm:text-body font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 sm:p-3 border-2 border-primary-coral/50 rounded-lg text-sm sm:text-base focus:border-primary-coral focus:outline-none transition-colors"
                placeholder="Your name (pre-filled when logged in)"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-body font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 sm:p-3 border-2 border-primary-coral/50 rounded-lg text-sm sm:text-base focus:border-primary-coral focus:outline-none transition-colors"
                placeholder="your@email.com (pre-filled when logged in)"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-body font-medium mb-2">Subject</label>
              <select
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 sm:p-3 border-2 border-primary-coral/50 rounded-lg text-sm sm:text-base focus:border-primary-coral focus:outline-none transition-colors"
              >
                <option value="Booking Issue">Booking Issue</option>
                <option value="Cancellation Help">Cancellation Help</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm sm:text-body font-medium mb-2">Description</label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full p-2.5 sm:p-3 border-2 border-primary-coral/50 rounded-lg text-sm sm:text-base focus:border-primary-coral focus:outline-none transition-colors"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-sm sm:text-body font-semibold hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-card p-4 sm:p-8 shadow-sm border border-neutral-border-gray mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-h2 mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-b border-neutral-border-gray last:border-0 pb-4 last:pb-0"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-start sm:items-center justify-between text-left py-2 gap-2"
                >
                  <span className="text-sm sm:text-body font-medium text-neutral-charcoal flex-1">{faq.question}</span>
                  <span className="text-primary-coral text-lg sm:text-h3 flex-shrink-0">
                    {openFaq === faq.id ? '−' : '+'}
                  </span>
                </button>
                {openFaq === faq.id && (
                  <p className="text-sm sm:text-body text-neutral-dark-gray mt-2 pl-0 sm:pl-4">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
