import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Heart, Bell, FileText, RotateCcw, XCircle, Car } from 'lucide-react';
import type { Booking, Property } from '../types';
import { format } from 'date-fns';
import GlobalHeader from '../components/header/GlobalHeader';
import Footer from '../components/common/Footer';

import { API_BASE_URL } from '../config/api';
import AppImage from '../components/common/AppImage';

const tabs = [
  { id: 'bookings', name: 'My Bookings', icon: Calendar },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'wishlist', name: 'Wishlist', icon: Heart },
  { id: 'refunds', name: 'Refunds', icon: RotateCcw },
  { id: 'cancellation', name: 'Cancellation', icon: XCircle },
  { id: 'invoices', name: 'Invoices', icon: FileText },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; message: string; read: boolean; createdAt: string }>>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Property[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // No refunds/cancellations API - use empty arrays; cancellations derived from cancelled bookings
  const refunds: Array<{ id: string; bookingId: string; propertyName: string; amount: number; status: string; requestedDate: string; reason: string }> = [];
  const cancellations = bookings.filter((b) => b.status === 'cancelled').map((b) => ({
    id: b.id,
    bookingId: b.id,
    propertyName: b.property?.name || 'Property',
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    cancellationDate: b.createdAt,
    refundAmount: 0,
    status: 'cancelled' as const,
  }));

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        }
        const token = localStorage.getItem('userToken');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Fetch bookings when logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || activeTab !== 'bookings') return;
    setBookingsLoading(true);
    fetch(`${API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          try {
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.bookings || data.data || []);
            setBookings(list.map((b: any) => ({
              id: b.id,
              propertyId: b.propertyId,
              property: b.property ? {
                id: b.property.id,
                name: b.property.name,
                location: b.property.location,
                city: b.property.city,
                images: b.property.images || [],
                hostRating: parseFloat(b.property.hostRating) || 0,
                pricePerNight: parseFloat(b.property.pricePerNight) || 0,
                availability: b.property.availability || 'available',
                description: b.property.description || '',
                amenities: b.property.amenities || [],
                houseRules: b.property.houseRules || [],
                cancellationPolicy: b.property.cancellationPolicy || '',
                host: { name: b.property.host?.name || 'Host', avatar: '', verified: true },
                reviews: b.property.reviews || [],
              } : { id: b.propertyId, name: '', location: '', city: '', images: [], hostRating: 0, pricePerNight: 0, availability: 'available' as const, description: '', amenities: [], houseRules: [], cancellationPolicy: '', host: { name: 'Host', avatar: '', verified: false }, reviews: [] },
              checkIn: b.checkIn,
              checkOut: b.checkOut,
              guests: b.guests || 1,
              totalPrice: parseFloat(b.totalPrice) || 0,
              status: b.status || 'pending',
              createdAt: b.createdAt || '',
            })));
          } catch {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }
      })
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [activeTab]);

  // Fetch notifications when logged in (for badge and tab content)
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    if (activeTab === 'notifications') setNotificationsLoading(true);
    fetch(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setNotifications(Array.isArray(data) ? data : []);
        } else {
          setNotifications([]);
        }
      })
      .catch(() => setNotifications([]))
      .finally(() => setNotificationsLoading(false));
  }, [activeTab]);

  // Fetch wishlist when on wishlist tab
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || activeTab !== 'wishlist') return;
    setWishlistLoading(true);
    fetch(`${API_BASE_URL}/users/wishlist/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (res.ok) {
          const ids = await res.json();
          if (!Array.isArray(ids) || ids.length === 0) {
            setWishlist([]);
            return;
          }
          const properties = await Promise.all(
            ids.map((id: string) =>
              fetch(`${API_BASE_URL}/properties/${id}`).then((r) => (r.ok ? r.json() : null)),
            ),
          );
          setWishlist(
            properties
              .filter(Boolean)
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                location: p.location,
                city: p.city,
                images: p.images || [],
                hostRating: parseFloat(p.hostRating) || 0,
                pricePerNight: parseFloat(p.pricePerNight) || 0,
                availability: p.availability || 'available',
                description: p.description || '',
                amenities: p.amenities || [],
                houseRules: p.houseRules || [],
                cancellationPolicy: p.cancellationPolicy || '',
                host: { name: p.host?.name || 'Host', avatar: '', verified: true },
                reviews: p.reviews || [],
              })),
          );
        } else {
          setWishlist([]);
        }
      })
      .catch(() => setWishlist([]))
      .finally(() => setWishlistLoading(false));
  }, [activeTab]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-primary-coral/10 via-white to-accent-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-h1 text-neutral-charcoal mb-2 font-bold">
              My Trips
            </h1>
            <p className="text-sm sm:text-body text-neutral-medium-gray">
              Manage your bookings, saved properties, reviews & more
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs - Enhanced Design */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray/50 p-2 mb-8">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-coral text-neutral-light-gray shadow-md'
                      : 'text-neutral-medium-gray hover:bg-white hover:text-neutral-charcoal'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-body font-medium">{tab.name}</span>
                  {tab.id === 'notifications' && unreadNotificationCount > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold bg-primary-coral text-neutral-light-gray rounded-full">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">My Bookings</h2>
            {bookingsLoading ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto" />
                <p className="mt-4 text-body text-neutral-medium-gray">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-primary-coral" />
                </div>
                <h3 className="text-h2 text-neutral-charcoal mb-2">No bookings yet</h3>
                <p className="text-body text-neutral-medium-gray">
                  Your bookings will appear here once you make a reservation
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {[...bookings]
                  .sort((a, b) => {
                    const dateA = a.checkIn ? new Date(a.checkIn).getTime() : 0;
                    const dateB = b.checkIn ? new Date(b.checkIn).getTime() : 0;
                    return dateB - dateA;
                  })
                  .map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={booking.property.images[0]}
                        alt={booking.property.name}
                        className="w-full md:w-64 h-48 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-h3 mb-2">{booking.property.name}</h3>
                            <p className="text-body text-neutral-medium-gray">
                              {booking.property.location}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-caption font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-accent-teal/10 text-accent-teal'
                                : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-white text-neutral-medium-gray'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-body">
                            <span className="font-medium">Check-in:</span>{' '}
                            {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-body">
                            <span className="font-medium">Check-out:</span>{' '}
                            {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-body">
                            <span className="font-medium">Guests:</span> {booking.guests}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-h3 font-semibold">
                            ₹{booking.totalPrice.toLocaleString()}
                          </p>
                          <button className="px-4 py-2 border-2 border-primary-coral/50 rounded-lg text-body font-medium hover:bg-primary-coral hover:text-neutral-light-gray hover:border-primary-coral transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Notifications</h2>
            {notificationsLoading ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto" />
                <p className="mt-4 text-body text-neutral-medium-gray">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-primary-coral" />
                </div>
                <h3 className="text-h2 text-neutral-charcoal mb-2">No notifications yet</h3>
                <p className="text-body text-neutral-medium-gray">
                  When your guide bookings are confirmed or cancelled, or when a driver is assigned to your cab request, you&apos;ll see messages here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-6 shadow-sm border transition-shadow ${
                      n.read
                        ? 'bg-white border-neutral-border-gray'
                        : 'bg-accent-teal/5 border-accent-teal/30 shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        n.type === 'guide_booking_confirmed'
                          ? 'bg-accent-teal/20 text-accent-teal'
                          : n.type === 'guide_booking_cancelled'
                            ? 'bg-white text-neutral-dark-gray'
                            : n.type === 'cab_driver_assigned'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-white text-neutral-charcoal'
                      }`}>
                        {n.type === 'cab_driver_assigned' ? (
                          <Car className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body text-neutral-charcoal">{n.message}</p>
                        <p className="text-caption text-neutral-medium-gray mt-2">
                          {format(new Date(n.createdAt), 'MMM dd, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'wishlist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Wishlist</h2>
            {wishlistLoading ? (
              <div className="text-center py-12">Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-primary-coral" />
                </div>
                <h3 className="text-h2 text-neutral-charcoal mb-2">No properties in wishlist</h3>
                <p className="text-body text-neutral-medium-gray">
                  Save your favorite properties to your wishlist
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((property) => (
                  <Link
                    key={property.id}
                    to={`/property/${property.id}`}
                    className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-md transition-shadow block"
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <AppImage
                        src={property.images?.[0] || null}
                        alt={property.name}
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-charcoal">{property.name}</h3>
                      <p className="text-caption text-neutral-medium-gray">{property.location}, {property.city}</p>
                      <p className="text-body font-medium text-primary-coral mt-2">₹{property.pricePerNight?.toLocaleString()}/night</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'refunds' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Refund Requests</h2>
            {refunds.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <RotateCcw className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4" />
                <p className="text-body text-neutral-medium-gray">No refund requests yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-h3 mb-2">{refund.propertyName}</h3>
                        <p className="text-body text-neutral-medium-gray">
                          Booking ID: {refund.bookingId}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-caption font-medium ${
                          refund.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : refund.status === 'completed'
                              ? 'bg-accent-teal/10 text-accent-teal'
                              : 'bg-white text-neutral-medium-gray'
                        }`}
                      >
                        {refund.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-body">
                        <span className="font-medium">Refund Amount:</span> ₹{refund.amount.toLocaleString()}
                      </p>
                      <p className="text-body">
                        <span className="font-medium">Requested Date:</span>{' '}
                        {format(new Date(refund.requestedDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-body">
                        <span className="font-medium">Reason:</span> {refund.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'cancellation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Cancelled Bookings</h2>
            {cancellations.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <XCircle className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4" />
                <p className="text-body text-neutral-medium-gray">No cancelled bookings</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cancellations.map((cancellation) => (
                  <div
                    key={cancellation.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-neutral-border-gray"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-h3 mb-2">{cancellation.propertyName}</h3>
                        <p className="text-body text-neutral-medium-gray">
                          Booking ID: {cancellation.bookingId}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-caption font-medium bg-white text-neutral-dark-gray">
                        {cancellation.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-body">
                        <span className="font-medium">Check-in:</span>{' '}
                        {format(new Date(cancellation.checkIn), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-body">
                        <span className="font-medium">Check-out:</span>{' '}
                        {format(new Date(cancellation.checkOut), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-body">
                        <span className="font-medium">Cancelled on:</span>{' '}
                        {format(new Date(cancellation.cancellationDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-body">
                        <span className="font-medium">Refund Amount:</span> ₹{cancellation.refundAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Invoices</h2>
            <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
              <FileText className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4" />
              <p className="text-body text-neutral-medium-gray">No invoices yet</p>
            </div>
          </motion.div>
        )}

        {/* Account settings moved to Account section (dropdown > Account) */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
