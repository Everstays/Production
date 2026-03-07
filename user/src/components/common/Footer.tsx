import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-neutral-charcoal border-t border-neutral-border-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EverStays" className="w-10 h-10 object-contain" />
              <span className="text-body font-medium text-primary-coral">EverStays</span>
            </Link>
            <p className="text-caption text-neutral-medium-gray">
              Your trusted partner for finding the perfect stay. Discover amazing properties and experiences across India.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border-2 border-neutral-border-gray text-neutral-charcoal hover:bg-primary-coral hover:text-neutral-light-gray hover:border-primary-coral flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border-2 border-neutral-border-gray text-neutral-charcoal hover:bg-primary-coral hover:text-neutral-light-gray hover:border-primary-coral flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border-2 border-neutral-border-gray text-neutral-charcoal hover:bg-primary-coral hover:text-neutral-light-gray hover:border-primary-coral flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border-2 border-neutral-border-gray text-neutral-charcoal hover:bg-primary-coral hover:text-neutral-light-gray hover:border-primary-coral flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-body font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Home page
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Offers & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-body font-semibold mb-4">Support</h3>
            <p className="text-caption text-neutral-medium-gray mb-2">Customization available — contact support for tailored solutions.</p>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@everstays.com" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  Travel Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-body font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-primary-coral mt-0.5 flex-shrink-0" />
                <a href="mailto:support@everstays.com" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  support@everstays.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-primary-coral mt-0.5 flex-shrink-0" />
                <a href="tel:+911800123456" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                  +91 1800 123 456
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-coral mt-0.5 flex-shrink-0" />
                <span className="text-caption text-neutral-medium-gray">
                  Kochi, Kerala, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-border-gray pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-caption text-neutral-medium-gray hover:text-primary-coral transition-colors">
                Accessibility
              </a>
            </div>
            <p className="text-caption text-neutral-medium-gray">
              © {currentYear} EverStays. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
