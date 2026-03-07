import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, DollarSign, Calendar, Settings, TrendingUp, Users, Star, X, MapPin, Upload, Trash2, CreditCard, Bell, Shield, Edit, Eye, User, CheckCircle, Sparkles, Clock, Tag, UserCheck, Car, Gift, MoreVertical, LayoutGrid } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminHeader from '../components/header/AdminHeader';
import AdminFooter from '../components/common/AdminFooter';

import { API_BASE_URL, USER_APP_URL } from '../config/api';

// Predefined Kerala cities – used so the City dropdown is never empty (before/without API)
const KERALA_CITIES_LIST = [
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Alappuzha',
  'Thrissur', 'Kollam', 'Kannur', 'Kottayam', 'Palakkad',
  'Malappuram', 'Ernakulam', 'Idukki', 'Wayanad',
  'Pathanamthitta', 'Kasaragod', 'Munnar', 'Varkala',
  'Kumarakom', 'Thekkady', 'Alleppey', 'Kovalam',
];
const getKeralaCityIcon = (cityName: string): string => {
  const cityIcons: Record<string, string> = {
    'Kochi': '🏙️', 'Thiruvananthapuram': '🏛️', 'Kozhikode': '🌳', 'Alappuzha': '🏖️',
    'Thrissur': '🏰', 'Kollam': '🌴', 'Kannur': '⛰️', 'Kottayam': '🏘️', 'Palakkad': '🌾',
    'Malappuram': '🕌', 'Ernakulam': '🏢', 'Idukki': '🌲', 'Wayanad': '🌿',
    'Pathanamthitta': '🕉️', 'Kasaragod': '🏝️', 'Munnar': '⛰️', 'Varkala': '🏖️',
    'Kumarakom': '🦢', 'Thekkady': '🐘', 'Alleppey': '🛶', 'Kovalam': '🏖️',
  };
  return cityIcons[cityName] || '🏘️';
};
const defaultCitiesList = KERALA_CITIES_LIST.map((name, index) => ({
  id: `kerala-${index}`,
  name,
  icon: getKeralaCityIcon(name),
  propertyCount: 0,
}));

const mainTabs = [
  { id: 'properties', name: 'My Properties', icon: Home },
  { id: 'experiences', name: 'Experiences', icon: Sparkles },
  { id: 'guides', name: 'Hire a Guide', icon: UserCheck },
  { id: 'cabs', name: 'Cabs', icon: Car },
  { id: 'bookings', name: 'Bookings', icon: Calendar },
  { id: 'earnings', name: 'Earnings', icon: DollarSign },
  { id: 'special-offers', name: 'Offers', icon: Gift },
  { id: 'reviews', name: 'Reviews', icon: Star },
  { id: 'plan-my-trip', name: 'Plan My Trip', icon: LayoutGrid },
  { id: 'settings', name: 'Settings', icon: Settings },
];

// Types
interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  category?: string;
  categoryId?: string;
  images: string[];
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  availability: string;
  isActive: boolean;
  bookings?: Booking[];
  reviews?: Review[];
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  property?: Property;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  property?: Property;
  user?: {
    id: string;
    name: string;
  };
}

export default function HostDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'properties');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [showAddCabModal, setShowAddCabModal] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [guideRequests, setGuideRequests] = useState<any[]>([]);
  const [updatingGuideBookingId, setUpdatingGuideBookingId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [cabs, setCabs] = useState<any[]>([]);
  const [cabRequests, setCabRequests] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [offerFormData, setOfferFormData] = useState({
    title: '',
    description: '',
    discount: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    image: '',
    terms: '',
    validFrom: '',
    expiryDate: '',
    code: '',
  });
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);
  const [assignCabId, setAssignCabId] = useState('');
  const [togglingGuideId, setTogglingGuideId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tripPlanItems, setTripPlanItems] = useState<Array<{ id: string; name: string; description: string; iconName: string; link: string; sortOrder: number; isActive: boolean }>>([]);
  const [showAddTripPlanModal, setShowAddTripPlanModal] = useState(false);
  const [editingTripPlanId, setEditingTripPlanId] = useState<string | null>(null);
  const [tripPlanForm, setTripPlanForm] = useState({ name: '', description: '', iconName: 'map', link: '/', sortOrder: 0 });
  const [cities, setCities] = useState<Array<{ id: string; name: string; icon?: string; propertyCount: number }>>(defaultCitiesList);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [earningsData, setEarningsData] = useState<{
    totalEarnings: number;
    thisMonthEarnings: number;
    totalBookings: number;
    monthlyEarnings: Array<{
      month: string;
      amount: number;
      bookings: number;
    }>;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    category: '',
    description: '',
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
  });
  const [experienceFormData, setExperienceFormData] = useState({
    name: '',
    location: '',
    city: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    maxParticipants: '',
  });
  const [guideFormData, setGuideFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerDay: '',
    languages: '',
    specialties: '',
    phoneNumber: '',
    email: '',
    isAvailable: true,
    isActive: true,
    isFeatured: false,
  });
  const [cabFormData, setCabFormData] = useState({
    vehicleName: '',
    vehicleNumber: '',
    vehicleType: '',
    seats: '',
    pricePerKm: '',
    basePrice: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    amenities: '',
    isAvailable: true,
    isActive: true,
    isFeatured: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [experienceImageFiles, setExperienceImageFiles] = useState<File[]>([]);
  const experienceFileInputRef = useRef<HTMLInputElement>(null);
  const [guideImageFiles, setGuideImageFiles] = useState<File[]>([]);
  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const [cabImageFiles, setCabImageFiles] = useState<File[]>([]);
  const cabFileInputRef = useRef<HTMLInputElement>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hostSettings, setHostSettings] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    panNumber: '',
    gstNumber: '',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const availableAmenities = ['WiFi', 'AC', 'Kitchen', 'Parking', 'TV', 'Pool', 'Gym', 'Security'];

  // Fetch data from APIs
  const fetchData = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
        // Fetch properties
        const propertiesRes = await fetch(`${API_BASE_URL}/properties/my-properties`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (propertiesRes.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        if (!propertiesRes.ok) {
          setError(`Server error (${propertiesRes.status}). Please try again.`);
          setIsLoading(false);
          return;
        }
        let propertiesData: unknown = [];
        try {
          propertiesData = await propertiesRes.json();
        } catch {
          propertiesData = [];
        }
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);

        // Fetch bookings
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        let bookingsData: unknown = [];
        try {
          bookingsData = await bookingsRes.json();
        } catch {
          bookingsData = [];
        }
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);

        // Fetch reviews for all properties
        const propertiesArray = Array.isArray(propertiesData) ? propertiesData : [];
        const propertyIds = (propertiesArray as Property[]).map((p) => p.id);
        const allReviews: Review[] = [];
        
        for (const propertyId of propertyIds) {
          try {
            const reviewsRes = await fetch(`${API_BASE_URL}/reviews?propertyId=${propertyId}`);
            if (reviewsRes.ok) {
              let reviewsData: unknown;
              try {
                reviewsData = await reviewsRes.json();
              } catch {
                reviewsData = [];
              }
              if (Array.isArray(reviewsData)) allReviews.push(...reviewsData);
            }
          } catch (err) {
            console.error(`Failed to fetch reviews for property ${propertyId}:`, err);
          }
        }
        
        setReviews(allReviews);

        // Fetch earnings statistics
        try {
          const earningsRes = await fetch(`${API_BASE_URL}/bookings/earnings/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (earningsRes.ok) {
            try {
              const earningsData = await earningsRes.json();
              setEarningsData(earningsData);
            } catch {
              // ignore parse error
            }
          }
        } catch (err) {
          console.error('Failed to fetch earnings:', err);
        }

        // Fetch admin settings (user profile)
        try {
          const userRes = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (userRes.ok) {
            try {
              const userData = await userRes.json();
              setHostSettings({
              bankAccountNumber: userData?.bankAccountNumber || '',
              ifscCode: userData?.ifscCode || '',
              accountHolderName: userData?.accountHolderName || '',
              panNumber: userData?.panNumber || '',
              gstNumber: userData?.gstNumber || '',
            });
            } catch {
              // ignore parse error
            }
          }
        } catch (err) {
          console.error('Failed to fetch admin settings:', err);
        }

        // Fetch cities for dropdown (Kerala cities only)
        try {
          const citiesRes = await fetch(`${API_BASE_URL}/cities`);
          let allCities: unknown = [];
          if (citiesRes.ok) {
            try {
              allCities = await citiesRes.json();
            } catch {
              allCities = [];
            }
          }
          const citiesArray = Array.isArray(allCities) ? allCities : [];
          
          // Create a map of cities from API with their property counts
          const cityMap = new Map<string, { id?: string; propertyCount: number }>();
          citiesArray.forEach((city: { id?: string; name: string; propertyCount?: number }) => {
            const cityName = city.name;
            if (KERALA_CITIES_LIST.some(kc => kc.toLowerCase() === cityName.toLowerCase())) {
              cityMap.set(cityName, {
                id: city.id,
                propertyCount: city.propertyCount || 0
              });
            }
          });
          
          // Build final cities list with property counts from API or default to 0
          const keralaCities = KERALA_CITIES_LIST.map((name, index) => {
            const cityData = cityMap.get(name);
            return {
              id: cityData?.id || `kerala-${index}`,
              name: name,
              icon: getKeralaCityIcon(name),
              propertyCount: cityData?.propertyCount || 0
            };
          });
          
          setCities(keralaCities);
        } catch (err) {
          console.error('Failed to fetch cities:', err);
          setCities(defaultCitiesList);
        }
    } catch (err) {
      console.error('Error fetching data:', err);
      const isNetworkError =
        err instanceof TypeError ||
        (err && typeof (err as Error).message === 'string' && ((err as Error).message.includes('fetch') || (err as Error).message.includes('network')));
      setError(
        isNetworkError
          ? `Cannot connect to the server. Make sure the backend is running at ${API_BASE_URL} then try again.`
          : 'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Calculate stats
  const totalProperties = properties.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  
  // Use earnings data from API if available, otherwise calculate from bookings
  const totalEarnings = earningsData?.totalEarnings ?? bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const thisMonthEarnings = earningsData?.thisMonthEarnings ?? 0;
  const totalBookingsCount = earningsData?.totalBookings ?? bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const monthlyEarnings = earningsData?.monthlyEarnings ?? [];

  // Sync active tab from URL and optionally open Add Experience modal
  useEffect(() => {
    if (tabParam && ['properties', 'experiences', 'guides', 'cabs', 'special-offers', 'earnings', 'bookings', 'reviews', 'plan-my-trip', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
      if (tabParam === 'experiences' && searchParams.get('add') === 'true') {
        setShowAddExperienceModal(true);
        setSearchParams({ tab: 'experiences' }, { replace: true });
      }
    }
  }, [tabParam, searchParams, setSearchParams]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAddPropertyModal || showAddExperienceModal || selectedBookingId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddPropertyModal, showAddExperienceModal, showAddGuideModal, showAddCabModal, showAddOfferModal, selectedBookingId]);

  // Fetch categories when properties tab is active (needed for property edit form)
  useEffect(() => {
    if (activeTab === 'properties') {
      const fetchCategories = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            try {
              const data = await response.json();
              setCategories(Array.isArray(data) ? data : []);
            } catch {
              setCategories([]);
            }
          } else {
            setCategories([]);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        }
      };

      fetchCategories();
    }
  }, [activeTab]);

  // Also fetch categories when modal opens if not already loaded
  useEffect(() => {
    if (showAddPropertyModal && categories.length === 0) {
      const fetchCategories = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            try {
              const data = await response.json();
              setCategories(Array.isArray(data) ? data : []);
            } catch {
              // ignore
            }
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
    }
  }, [showAddPropertyModal, categories.length]);

  // Fetch guides when guides tab is active
  useEffect(() => {
    if (activeTab === 'guides') {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const fetchGuides = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/guides/my-guides`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setGuides(Array.isArray(data) ? data : []);
            } catch {
              setGuides([]);
            }
          } else setGuides([]);
        } catch (error) {
          console.error('Error fetching guides:', error);
          setGuides([]);
        }
      };

      const fetchGuideRequests = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/guide-bookings/for-host`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setGuideRequests(Array.isArray(data) ? data : []);
            } catch {
              setGuideRequests([]);
            }
          } else setGuideRequests([]);
        } catch (error) {
          console.error('Error fetching guide requests:', error);
          setGuideRequests([]);
        }
      };

      fetchGuides();
      fetchGuideRequests();
    }
  }, [activeTab]);

  // Fetch offers when special-offers tab is active
  useEffect(() => {
    if (activeTab === 'special-offers') {
      const fetchOffers = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/offers/my-offers`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setOffers(Array.isArray(data) ? data : []);
            } catch {
              setOffers([]);
            }
          } else {
            setOffers([]);
          }
        } catch (error) {
          console.error('Error fetching offers:', error);
          setOffers([]);
        }
      };
      fetchOffers();
    }
  }, [activeTab]);

  // Fetch cabs and cab requests when cabs tab is active
  useEffect(() => {
    if (activeTab === 'cabs') {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const fetchCabs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/cabs/my-cabs`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setCabs(Array.isArray(data) ? data : []);
            } catch {
              setCabs([]);
            }
          } else setCabs([]);
        } catch (error) {
          console.error('Error fetching cabs:', error);
          setCabs([]);
        }
      };

      const fetchCabRequests = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/cab-requests/for-host`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setCabRequests(Array.isArray(data) ? data : []);
            } catch {
              setCabRequests([]);
            }
          } else setCabRequests([]);
        } catch (error) {
          console.error('Error fetching cab requests:', error);
          setCabRequests([]);
        }
      };

      fetchCabs();
      fetchCabRequests();
    }
  }, [activeTab]);

  // Fetch experiences when experiences tab is active
  useEffect(() => {
    if (activeTab === 'experiences') {
      const fetchExperiences = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        setExperiencesLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/experiences/my-experiences`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            try {
              const data = await response.json();
              setExperiences(Array.isArray(data) ? data : []);
            } catch {
              setExperiences([]);
            }
          } else {
            setExperiences([]);
          }
        } catch (error) {
          console.error('Error fetching experiences:', error);
          setExperiences([]);
        } finally {
          setExperiencesLoading(false);
        }
      };

      fetchExperiences();
    }
  }, [activeTab]);

  // Fetch trip plan items when plan-my-trip tab is active
  useEffect(() => {
    if (activeTab === 'plan-my-trip') {
      const fetchTripPlanItems = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        try {
          const res = await fetch(`${API_BASE_URL}/trip-plan-items?all=true`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setTripPlanItems(Array.isArray(data) ? data : []);
          }
        } catch {
          setTripPlanItems([]);
        }
      };
      fetchTripPlanItems();
    }
  }, [activeTab]);

  const handleSaveTripPlanItem = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    const payload = { ...tripPlanForm, sortOrder: Number(tripPlanForm.sortOrder) || 0 };
    try {
      if (editingTripPlanId) {
        const res = await fetch(`${API_BASE_URL}/trip-plan-items/${editingTripPlanId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setTripPlanItems((prev) => prev.map((p) => (p.id === editingTripPlanId ? updated : p)));
          setEditingTripPlanId(null);
          setShowAddTripPlanModal(false);
          setTripPlanForm({ name: '', description: '', iconName: 'map', link: '/', sortOrder: 0 });
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/trip-plan-items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setTripPlanItems((prev) => [...prev, created]);
          setShowAddTripPlanModal(false);
          setTripPlanForm({ name: '', description: '', iconName: 'map', link: '/', sortOrder: 0 });
        }
      }
    } catch (e) {
      console.error('Save trip plan item failed:', e);
    }
  };

  const handleDeleteTripPlanItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/trip-plan-items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTripPlanItems((prev) => prev.filter((p) => p.id !== id));
        setEditingTripPlanId(null);
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleToggleTripPlanActive = async (item: typeof tripPlanItems[0]) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/trip-plan-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        setTripPlanItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, isActive: !p.isActive } : p)));
      }
    } catch (e) {
      console.error('Toggle failed:', e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please log in to upload images');
      return;
    }

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/uploads/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          try {
            const data = await res.json();
            if (data?.url) setImages(prev => [...prev, data.url]);
          } catch {
            // skip invalid response
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setSubmitError('Failed to upload image. Please try again.');
      }
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please login again');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.location || !formData.city || !formData.description || 
        !formData.pricePerNight || !formData.bedrooms || !formData.bathrooms || !formData.guests) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = editingPropertyId !== null;
      const url = isEditing 
        ? `${API_BASE_URL}/properties/${editingPropertyId}`
        : `${API_BASE_URL}/properties`;
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          city: formData.city,
          categoryId: formData.category || undefined,
          description: formData.description,
          pricePerNight: parseFloat(formData.pricePerNight),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          maxGuests: parseInt(formData.guests),
          images: images.length > 0 ? images : [],
          amenities: amenities,
          houseRules: [],
          cancellationPolicy: 'Free cancellation up to 3 days before check-in',
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSubmitSuccess(true);
        
        // Refresh properties list
        const propertiesRes = await fetch(`${API_BASE_URL}/properties/my-properties`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        try {
          const propertiesData = await propertiesRes.json();
          setProperties(Array.isArray(propertiesData) ? propertiesData : []);
        } catch {
          // keep existing properties
        }

        // Reset form and close modal after a short delay
        setTimeout(() => {
          setFormData({
            name: '',
            location: '',
            city: '',
            category: '',
            description: '',
            pricePerNight: '',
            bedrooms: '',
            bathrooms: '',
            guests: '',
          });
          setImages([]);
          setAmenities([]);
          setEditingPropertyId(null);
          setShowAddPropertyModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError((data && data.message) || `Failed to ${isEditing ? 'update' : 'create'} property. Please try again.`);
      }
    } catch (err) {
      console.error(`Error ${editingPropertyId ? 'updating' : 'creating'} property:`, err);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditProperty = (property: Property) => {
    setEditingPropertyId(property.id);
    setFormData({
      name: property.name,
      location: property.location,
      city: property.city,
      category: property.categoryId || property.category || '',
      description: property.description || '',
      pricePerNight: property.pricePerNight.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      guests: property.maxGuests.toString(),
    });
    setImages(property.images || []);
    setAmenities(property.amenities || []);
    setShowAddPropertyModal(true);
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const openModal = () => {
    setEditingPropertyId(null);
    setFormData({
      name: '',
      location: '',
      city: '',
      category: '',
      description: '',
      pricePerNight: '',
      bedrooms: '',
      bathrooms: '',
      guests: '',
    });
    setImages([]);
    setAmenities([]);
    setShowAddPropertyModal(true);
    setSubmitError('');
    setSubmitSuccess(false);
  };

  // Handle experience form submission
  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please login to add experiences');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const imageUrls: string[] = [];
      for (const file of experienceImageFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${API_BASE_URL}/uploads/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData?.message || `Failed to upload image: ${file.name}`);
        }
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (uploadData?.url) imageUrls.push(uploadData.url);
      }

      const response = await fetch(`${API_BASE_URL}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: experienceFormData.name,
          location: experienceFormData.location,
          city: experienceFormData.city,
          description: experienceFormData.description,
          price: parseFloat(experienceFormData.price),
          duration: experienceFormData.duration,
          category: experienceFormData.category || 'Other',
          maxParticipants: experienceFormData.maxParticipants ? parseInt(experienceFormData.maxParticipants) : undefined,
          images: imageUrls,
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSubmitSuccess(true);
        
        // Refresh experiences list
        try {
          const experiencesRes = await fetch(`${API_BASE_URL}/experiences/my-experiences`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (experiencesRes.ok) {
            try {
              const experiencesData = await experiencesRes.json();
              setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
            } catch {
              // keep existing
            }
          }
        } catch (err) {
          console.error('Error fetching experiences:', err);
        }

        // Reset form and close modal after a short delay
        setTimeout(() => {
          setExperienceFormData({
            name: '',
            location: '',
            city: '',
            description: '',
            price: '',
            duration: '',
            category: '',
            maxParticipants: '',
          });
          setExperienceImageFiles([]);
          setShowAddExperienceModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError((data && data.message) || 'Failed to create experience. Please try again.');
      }
    } catch (err) {
      console.error('Error creating experience:', err);
      setSubmitError('Network error. Please check your connection and try again. Note: Experience API endpoint needs to be implemented in the backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperienceFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  // Handle guide form submission
  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please login to add guides');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Upload image files first
      const imageUrls: string[] = [];
      for (const file of guideImageFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${API_BASE_URL}/uploads/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to upload image: ${file.name}`);
        }
        try {
          const uploadData = await uploadRes.json();
          if (uploadData?.url) imageUrls.push(uploadData.url);
        } catch {
          // skip invalid response
        }
      }

      const response = await fetch(`${API_BASE_URL}/guides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: guideFormData.name,
          location: guideFormData.location,
          description: guideFormData.description,
          pricePerDay: parseFloat(guideFormData.pricePerDay),
          languages: guideFormData.languages.split(',').map(s => s.trim()).filter(Boolean),
          specialties: guideFormData.specialties.split(',').map(s => s.trim()).filter(Boolean),
          images: imageUrls,
          phoneNumber: guideFormData.phoneNumber || null,
          email: guideFormData.email || null,
          isAvailable: guideFormData.isAvailable,
          isActive: guideFormData.isActive,
          isFeatured: guideFormData.isFeatured,
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSubmitSuccess(true);
        
        // Refresh guides list
        try {
          const guidesRes = await fetch(`${API_BASE_URL}/guides/my-guides`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (guidesRes.ok) {
            try {
              const guidesData = await guidesRes.json();
              setGuides(Array.isArray(guidesData) ? guidesData : []);
            } catch {
              // keep existing
            }
          }
        } catch (err) {
          console.error('Error fetching guides:', err);
        }

        setTimeout(() => {
          setGuideFormData({
            name: '',
            location: '',
            description: '',
            pricePerDay: '',
            languages: '',
            specialties: '',
            phoneNumber: '',
            email: '',
            isAvailable: true,
            isActive: true,
            isFeatured: false,
          });
          setGuideImageFiles([]);
          setShowAddGuideModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError((data && data.message) || 'Failed to create guide. Please try again.');
      }
    } catch (err) {
      console.error('Error creating guide:', err);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignCabRequest = async (requestId: string, cabId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cab-requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cabId }),
      });
      if (res.ok) {
        const updated = await fetch(`${API_BASE_URL}/cab-requests/for-host`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (updated.ok) {
          try {
            const data = await updated.json();
            setCabRequests(Array.isArray(data) ? data : []);
          } catch {
            // keep existing
          }
        }
        setAssigningRequestId(null);
        setAssignCabId('');
      }
    } catch (err) {
      console.error('Error assigning cab request:', err);
    }
  };

  const handleUpdateGuideBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setUpdatingGuideBookingId(bookingId);
    try {
      const res = await fetch(`${API_BASE_URL}/guide-bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setGuideRequests(prev => prev.map((r: any) =>
          r.id === bookingId ? { ...r, status } : r
        ));
      }
    } catch (err) {
      console.error('Error updating guide booking:', err);
    } finally {
      setUpdatingGuideBookingId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b =>
          b.id === bookingId ? { ...b, status } : b
        ));
        setSelectedBookingId(null);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleToggleGuideAvailability = async (guide: any) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setTogglingGuideId(guide.id);
    try {
      const res = await fetch(`${API_BASE_URL}/guides/${guide.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !guide.isAvailable }),
      });
      if (res.ok) {
        setGuides(prev => prev.map((g: any) =>
          g.id === guide.id ? { ...g, isAvailable: !g.isAvailable } : g
        ));
      }
    } catch (err) {
      console.error('Error updating guide availability:', err);
    } finally {
      setTogglingGuideId(null);
    }
  };

  const handleGuideInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setGuideFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setSubmitError('');
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please login to add offers');
      return;
    }
    const disc = parseFloat(offerFormData.discount);
    if (isNaN(disc) || disc < 0) {
      setSubmitError('Please enter a valid discount');
      return;
    }
    if (!offerFormData.expiryDate) {
      setSubmitError('Please select an expiry date');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: offerFormData.title,
          description: offerFormData.description,
          discount: disc,
          discountType: offerFormData.discountType,
          image: offerFormData.image || null,
          terms: offerFormData.terms || null,
          validFrom: offerFormData.validFrom || offerFormData.expiryDate,
          expiryDate: offerFormData.expiryDate,
          type: 'host',
          code: offerFormData.code || undefined,
        }),
      });
      let data: { message?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { message: res.status === 413 ? 'Image too large. Please use a smaller image.' : 'Request failed.' };
      }
      if (res.ok) {
        setSubmitSuccess(true);
        const listRes = await fetch(`${API_BASE_URL}/offers/my-offers`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (listRes.ok) {
          try {
            const list = await listRes.json();
            setOffers(Array.isArray(list) ? list : []);
          } catch {
            // keep existing
          }
        }
        setTimeout(() => {
          setOfferFormData({
            title: '',
            description: '',
            discount: '',
            discountType: 'fixed',
            image: '',
            terms: '',
            validFrom: '',
            expiryDate: '',
            code: '',
          });
          setShowAddOfferModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError(data.message || 'Failed to create offer.');
      }
    } catch (err) {
      console.error('Error creating offer:', err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cab form submission
  const handleCabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSubmitError('Please login to add cabs');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const imageUrls: string[] = [];
      for (const file of cabImageFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${API_BASE_URL}/uploads/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData?.message || `Failed to upload image: ${file.name}`);
        }
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (uploadData?.url) imageUrls.push(uploadData.url);
      }

      const response = await fetch(`${API_BASE_URL}/cabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleName: cabFormData.vehicleName,
          vehicleNumber: cabFormData.vehicleNumber,
          vehicleType: cabFormData.vehicleType,
          seats: parseInt(cabFormData.seats),
          pricePerKm: parseFloat(cabFormData.pricePerKm),
          basePrice: cabFormData.basePrice ? parseFloat(cabFormData.basePrice) : null,
          images: imageUrls,
          amenities: cabFormData.amenities.split(',').map(s => s.trim()).filter(Boolean),
          driverName: cabFormData.driverName || null,
          driverPhone: cabFormData.driverPhone || null,
          driverLicense: cabFormData.driverLicense || null,
          isAvailable: cabFormData.isAvailable,
          isActive: cabFormData.isActive,
          isFeatured: cabFormData.isFeatured,
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSubmitSuccess(true);
        
        // Refresh cabs list
        try {
          const cabsRes = await fetch(`${API_BASE_URL}/cabs/my-cabs`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (cabsRes.ok) {
            try {
              const cabsData = await cabsRes.json();
              setCabs(Array.isArray(cabsData) ? cabsData : []);
            } catch {
              // keep existing
            }
          }
        } catch (err) {
          console.error('Error fetching cabs:', err);
        }

        setTimeout(() => {
          setCabFormData({
            vehicleName: '',
            vehicleNumber: '',
            vehicleType: '',
            seats: '',
            pricePerKm: '',
            basePrice: '',
            driverName: '',
            driverPhone: '',
            driverLicense: '',
            amenities: '',
            isAvailable: true,
            isActive: true,
            isFeatured: false,
          });
          setCabImageFiles([]);
          setShowAddCabModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError(data.message || 'Failed to create cab. Please try again.');
      }
    } catch (err) {
      console.error('Error creating cab:', err);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCabInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCabFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setSubmitError('');
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-primary-coral/10 via-white to-accent-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-h1 text-neutral-charcoal mb-2 font-bold">Admin Dashboard</h1>
              <p className="text-sm sm:text-body text-neutral-medium-gray">
                Manage your properties and track your earnings
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Property</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards - Enhanced Design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-neutral-border-gray/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-coral/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary-coral/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Home className="w-8 h-8 text-primary-coral" />
                  <TrendingUp className="w-5 h-5 text-accent-teal" />
                </div>
                <p className="text-caption text-neutral-medium-gray mb-2">Total Properties</p>
                <p className="text-3xl sm:text-h1 font-bold text-neutral-charcoal">
                  {isLoading ? '...' : totalProperties}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-neutral-border-gray/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent-teal/5 rounded-full -mr-10 -mt-10 group-hover:bg-accent-teal/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 text-accent-teal" />
                  <TrendingUp className="w-5 h-5 text-primary-coral" />
                </div>
                <p className="text-caption text-neutral-medium-gray mb-2">Total Earnings</p>
                <p className="text-3xl sm:text-h1 font-bold text-neutral-charcoal">
                  {isLoading ? '...' : `₹${totalEarnings.toLocaleString()}`}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-neutral-border-gray/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-coral/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary-coral/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="w-8 h-8 text-primary-coral" />
                  <Users className="w-5 h-5 text-accent-teal" />
                </div>
                <p className="text-caption text-neutral-medium-gray mb-2">Active Bookings</p>
                <p className="text-3xl sm:text-h1 font-bold text-neutral-charcoal">
                  {isLoading ? '...' : activeBookings}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs - Enhanced Design */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-border-gray/50 p-2 mb-8">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide items-center">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const showBadge = false;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchParams({ tab: tab.id }, { replace: true });
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-primary-coral text-neutral-light-gray shadow-md'
                      : 'text-neutral-medium-gray hover:bg-white hover:text-neutral-charcoal'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-body font-medium">{tab.name}</span>
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary-coral border-2 border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">My Properties</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </motion.button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
              </div>
            ) : error ? (
              <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg flex flex-col items-center gap-4">
                <p>{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="px-6 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body text-neutral-medium-gray mb-4">No properties yet. Add your first property to get started!</p>
                <button
                  onClick={openModal}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all"
                >
                  Add Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const propertyBookings = bookings.filter(b => b.property?.id === property.id);
                  const propertyReviews = reviews.filter(r => r.property?.id === property.id);
                  const avgRating = propertyReviews.length > 0
                    ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length
                    : 0;
                  const propertyEarnings = propertyBookings
                    .filter(b => b.status === 'confirmed' || b.status === 'completed')
                    .reduce((sum, b) => sum + Number(b.totalPrice), 0);
                  
                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <button className="p-2 bg-white rounded-full shadow-md hover:bg-white transition-colors">
                            <MoreVertical className="w-4 h-4 text-neutral-charcoal" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <span className={`px-2 py-1 text-neutral-light-gray text-xs font-medium rounded ${
                            property.isActive && property.availability === 'available'
                              ? 'bg-accent-teal/90'
                              : property.availability === 'limited'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                          }`}>
                            {property.availability || (property.isActive ? 'active' : 'inactive')}
                          </span>
                          {property.isFeatured && (
                            <span className="px-2 py-1 bg-primary-coral text-neutral-light-gray text-xs font-medium rounded flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-h3 text-neutral-charcoal mb-2">{property.name}</h3>
                        <div className="flex items-center space-x-1 text-caption text-neutral-medium-gray mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-body font-medium">{avgRating.toFixed(1)}</span>
                            <span className="text-caption text-neutral-medium-gray">({propertyReviews.length})</span>
                          </div>
                          <span className="text-h3 font-semibold text-primary-coral">
                            ₹{Number(property.pricePerNight).toLocaleString()}/night
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-caption text-neutral-medium-gray mb-4">
                          <span>{property.bedrooms} beds</span>
                          <span>{property.bathrooms} baths</span>
                          <span>{property.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-border-gray">
                          <div>
                            <p className="text-caption text-neutral-medium-gray">Total Bookings</p>
                            <p className="text-body font-semibold">{propertyBookings.length}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-caption text-neutral-medium-gray">Earnings</p>
                            <p className="text-body font-semibold text-accent-teal">
                              ₹{propertyEarnings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProperty(property)}
                              className="flex-1 px-3 py-2 border-2 border-primary-coral/50 text-primary-coral rounded-lg text-body font-medium hover:bg-primary-coral/10 transition-colors flex items-center justify-center space-x-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => window.open(`${USER_APP_URL}/property/${property.id}`, '_blank')}
                              className="flex-1 px-3 py-2 border-2 border-primary-coral/50 text-primary-coral rounded-lg text-body font-medium hover:bg-primary-coral/10 transition-colors flex items-center justify-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </div>
                          <button
                            onClick={async () => {
                              const token = localStorage.getItem('userToken');
                              if (!token) return;
                              
                              try {
                                const response = await fetch(`${API_BASE_URL}/properties/${property.id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    isFeatured: !property.isFeatured,
                                  }),
                                });
                                
                                if (response.ok) {
                                  // Refresh properties list
                                  const propertiesRes = await fetch(`${API_BASE_URL}/properties/my-properties`, {
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                    },
                                  });
                                  if (propertiesRes.ok) {
                                    try {
                                      const propertiesData = await propertiesRes.json();
                                      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
                                    } catch {
                                      // keep existing
                                    }
                                  }
                                } else {
                                  let errMsg = 'Failed to update featured status';
                                  try {
                                    const errBody = await response.json();
                                    errMsg = errBody?.message || errMsg;
                                  } catch { /* body may not be JSON */ }
                                  alert(errMsg);
                                }
                              } catch (error) {
                                console.error('Error toggling featured status:', error);
                                alert('Failed to update featured status');
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg text-body font-medium transition-colors flex items-center justify-center space-x-1 ${
                              property.isFeatured
                                ? 'bg-primary-coral/10 text-primary-coral border-2 border-primary-coral/50 hover:bg-primary-coral/20'
                                : 'bg-white text-neutral-charcoal border-2 border-neutral-border-gray hover:bg-neutral-border-gray'
                            }`}
                          >
                            <Sparkles className={`w-4 h-4 ${property.isFeatured ? 'fill-primary-coral text-primary-coral' : ''}`} />
                            <span>{property.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'experiences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">My Experiences</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddExperienceModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </motion.button>
            </div>
            {experiencesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-border-gray">
                <Sparkles className="w-16 h-16 text-primary-coral mx-auto mb-4 opacity-50" />
                <p className="text-body text-neutral-medium-gray mb-4">No experiences yet. Add your first experience to get started!</p>
                <button
                  onClick={() => setShowAddExperienceModal(true)}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all"
                >
                  Add Experience
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={experience.image || experience.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={experience.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-white transition-colors">
                          <MoreVertical className="w-4 h-4 text-neutral-charcoal" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-h3 text-neutral-charcoal mb-2">{experience.name}</h3>
                      <div className="flex items-center space-x-1 text-caption text-neutral-medium-gray mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-body font-medium">{(Number(experience.rating) || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-h3 font-semibold text-primary-coral">
                          ₹{Number(experience.price || experience.pricePerPerson || 0).toLocaleString()}/person
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-caption text-neutral-medium-gray">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{experience.duration || 'N/A'}</span>
                        </div>
                        {experience.maxParticipants && (
                          <span>{experience.maxParticipants} max</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'special-offers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">My Special Offers</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddOfferModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Offer</span>
              </motion.button>
            </div>
            {offers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-border-gray">
                <Gift className="w-16 h-16 text-primary-coral mx-auto mb-4 opacity-50" />
                <p className="text-body text-neutral-medium-gray mb-4">No offers yet. Create your first special offer!</p>
                <button
                  onClick={() => setShowAddOfferModal(true)}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all"
                >
                  Add Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={offer.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 right-0 bg-primary-coral/90 text-neutral-light-gray px-4 py-2">
                        <p className="text-caption font-semibold">{offer.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-h3 text-neutral-charcoal mb-1">
                        {offer.discountType === 'percentage'
                          ? `Up to ${offer.discount}% OFF`
                          : `Up to ₹${Number(offer.discount).toLocaleString()} OFF`}
                      </h3>
                      <p className="text-body text-neutral-medium-gray mb-2">{offer.description}</p>
                      {offer.code && (
                        <p className="text-caption font-mono font-bold text-primary-coral mb-2">{offer.code}</p>
                      )}
                      <p className="text-caption text-neutral-medium-gray">
                        Expires {format(new Date(offer.expiryDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'guides' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Guide requests – admin receives these and can confirm/cancel */}
            <div className="mb-8">
              <h2 className="text-h2 mb-4">Guide requests</h2>
              <p className="text-body text-neutral-medium-gray mb-4">
                Guests have requested your guides. Confirm or cancel bookings; confirmed guests will receive the guide&apos;s contact details.
              </p>
              {guideRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-border-gray p-6 text-center">
                  <UserCheck className="w-12 h-12 text-neutral-medium-gray mx-auto mb-2 opacity-60" />
                  <p className="text-body text-neutral-medium-gray">No guide requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {guideRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-xl border border-neutral-border-gray p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-body font-semibold text-neutral-charcoal">
                            {req.user?.name || 'Guest'} · {req.user?.email || '—'}
                          </p>
                          <p className="text-caption text-neutral-medium-gray mt-1">
                            Guide: {req.guide?.name || '—'} · {req.guide?.location || ''}
                          </p>
                          <p className="text-caption text-neutral-medium-gray">
                            {req.bookingDate} · {req.numberOfDays} day{req.numberOfDays > 1 ? 's' : ''} · ₹{Number(req.totalAmount).toLocaleString()}
                          </p>
                          {req.message && (
                            <p className="text-caption text-neutral-medium-gray mt-1 italic">&quot;{req.message}&quot;</p>
                          )}
                          <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                            req.status === 'confirmed' ? 'bg-accent-teal/20 text-accent-teal' :
                            req.status === 'cancelled' ? 'bg-gray-200 text-gray-500' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={updatingGuideBookingId === req.id}
                              onClick={() => handleUpdateGuideBookingStatus(req.id, 'confirmed')}
                              className="px-4 py-2 bg-accent-teal text-neutral-light-gray rounded-lg text-body font-medium hover:bg-accent-teal/90 disabled:opacity-50"
                            >
                              {updatingGuideBookingId === req.id ? '…' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              disabled={updatingGuideBookingId === req.id}
                              onClick={() => handleUpdateGuideBookingStatus(req.id, 'cancelled')}
                              className="px-4 py-2 border-2 border-neutral-border-gray text-neutral-charcoal rounded-lg text-body font-medium hover:bg-white disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-h2">My Guides</h2>
                <p className="text-caption text-neutral-medium-gray mt-1">Click the Available/Unavailable badge on a guide to update status when they&apos;re booked</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddGuideModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Guide</span>
                </motion.button>
              </div>
            </div>
            {guides.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-border-gray">
                <UserCheck className="w-16 h-16 text-primary-coral mx-auto mb-4 opacity-50" />
                <p className="text-body text-neutral-medium-gray mb-4">No guides yet. Add your first guide!</p>
                <button
                  onClick={() => setShowAddGuideModal(true)}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all"
                >
                  Add Guide
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={guide.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {guide.isFeatured && (
                          <span className="px-2 py-1 bg-primary-coral text-neutral-light-gray text-xs font-medium rounded flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleGuideAvailability(guide)}
                          disabled={togglingGuideId === guide.id}
                          title="Click to toggle availability (e.g. when booked)"
                          className={`px-2 py-1 text-neutral-light-gray text-xs font-medium rounded cursor-pointer hover:opacity-90 disabled:opacity-70 disabled:cursor-wait transition-opacity ${
                            guide.isAvailable && guide.isActive ? 'bg-accent-teal/90' : 'bg-gray-500'
                          }`}
                        >
                          {togglingGuideId === guide.id ? '…' : (guide.isAvailable ? 'Available' : 'Unavailable')}
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-h3 text-neutral-charcoal mb-2">{guide.name}</h3>
                      <p className="text-body text-neutral-medium-gray mb-2">{guide.location}</p>
                      <p className="text-body text-neutral-medium-gray mb-3 line-clamp-2">{guide.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-body font-semibold text-primary-coral">
                          ₹{guide.pricePerDay?.toLocaleString()}/day
                        </span>
                        {(guide.rating || 0) > 0 && (
                          <span className="text-caption text-neutral-charcoal flex items-center gap-0.5">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {Number(guide.rating).toFixed(1)} ({guide.reviewCount || 0})
                          </span>
                        )}
                      </div>
                      {guide.languages && guide.languages.length > 0 && (
                        <p className="text-caption text-neutral-medium-gray mb-2">
                          {guide.languages.length} language{guide.languages.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'cabs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Cab requests – property receives these and assigns a driver */}
            <div className="mb-8">
              <h2 className="text-h2 mb-4">Cab requests</h2>
              <p className="text-body text-neutral-medium-gray mb-4">
                Guests have requested a cab. Assign one of your drivers; they will get the guest&apos;s contact details to reach out.
              </p>
              {cabRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-border-gray p-6 text-center">
                  <User className="w-12 h-12 text-neutral-medium-gray mx-auto mb-2 opacity-60" />
                  <p className="text-body text-neutral-medium-gray">No cab requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cabRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-xl border border-neutral-border-gray p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-body font-semibold text-neutral-charcoal">{req.guestName} · {req.guestPhone}</p>
                          <p className="text-caption text-neutral-medium-gray mt-1">
                            {req.pickupLocation} → {req.dropLocation}
                          </p>
                          <p className="text-caption text-neutral-medium-gray">
                            {req.travelDate} at {req.travelTime} · {req.numberOfPeople} people · {req.seatsPreference} seat
                          </p>
                          {req.property?.name && (
                            <p className="text-caption text-neutral-medium-gray">Property: {req.property.name}</p>
                          )}
                          {req.status === 'assigned' && req.assignedCab && (
                            <p className="text-caption text-accent-teal mt-2 font-medium">
                              Assigned to: {req.assignedCab.vehicleName} – Driver: {req.assignedCab.driverName || 'N/A'}
                            </p>
                          )}
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            {assigningRequestId === req.id ? (
                              <>
                                <select
                                  value={assignCabId}
                                  onChange={(e) => setAssignCabId(e.target.value)}
                                  className="px-3 py-2 border-2 border-primary-coral/50 rounded-lg text-sm focus:border-primary-coral focus:outline-none"
                                >
                                  <option value="">Select cab/driver</option>
                                  {cabs.filter((c: any) => c.isActive).map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                      {c.vehicleName} – {c.driverName || 'No driver name'}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={!assignCabId}
                                  onClick={() => assignCabId && handleAssignCabRequest(req.id, assignCabId)}
                                  className="px-3 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                                >
                                  Assign
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setAssigningRequestId(null); setAssignCabId(''); }}
                                  className="px-3 py-2 border border-neutral-border-gray rounded-lg text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => { setAssigningRequestId(req.id); setAssignCabId(''); }}
                                className="px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-medium hover:bg-opacity-90"
                              >
                                Assign to driver
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">My Cabs</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddCabModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Cab</span>
              </motion.button>
            </div>
            {cabs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-neutral-border-gray">
                <Car className="w-16 h-16 text-primary-coral mx-auto mb-4 opacity-50" />
                <p className="text-body text-neutral-medium-gray mb-4">No cabs yet. Add your first cab!</p>
                <button
                  onClick={() => setShowAddCabModal(true)}
                  className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all"
                >
                  Add Cab
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cabs.map((cab) => (
                  <div
                    key={cab.id}
                    className="bg-white rounded-xl overflow-hidden border border-neutral-border-gray shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={cab.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={cab.vehicleName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {cab.isFeatured && (
                          <span className="px-2 py-1 bg-primary-coral text-neutral-light-gray text-xs font-medium rounded flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        )}
                        <span className={`px-2 py-1 text-neutral-light-gray text-xs font-medium rounded ${
                          cab.isAvailable && cab.isActive ? 'bg-accent-teal/90' : 'bg-gray-500'
                        }`}>
                          {cab.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-h3 text-neutral-charcoal mb-2">{cab.vehicleName}</h3>
                      <p className="text-body text-neutral-medium-gray mb-2">{cab.vehicleNumber}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-caption text-neutral-medium-gray">{cab.vehicleType}</span>
                        <span className="text-caption text-neutral-medium-gray">{cab.seats} seats</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-body font-semibold text-primary-coral">
                          ₹{cab.pricePerKm?.toLocaleString()}/km
                        </span>
                        {cab.basePrice && (
                          <span className="text-caption text-neutral-medium-gray">
                            Base: ₹{cab.basePrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'earnings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Earnings Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm">
                <p className="text-caption text-neutral-medium-gray mb-2">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-charcoal">
                  ₹{totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm">
                <p className="text-caption text-neutral-medium-gray mb-2">This Month</p>
                <p className="text-2xl font-bold text-neutral-charcoal">
                  ₹{thisMonthEarnings.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm">
                <p className="text-caption text-neutral-medium-gray mb-2">Total Bookings</p>
                <p className="text-2xl font-bold text-neutral-charcoal">
                  {totalBookingsCount}
                </p>
              </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm">
              <h3 className="text-h3 mb-6 text-neutral-charcoal">Monthly Earnings</h3>
              {monthlyEarnings.length === 0 ? (
                <p className="text-body text-neutral-medium-gray text-center py-8">No earnings data yet</p>
              ) : (
                <div className="space-y-4">
                  {monthlyEarnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div>
                        <p className="text-body font-medium text-neutral-charcoal">{earning.month}</p>
                        <p className="text-caption text-neutral-medium-gray">{earning.bookings} bookings</p>
                      </div>
                      <p className="text-h3 font-semibold text-accent-teal">
                        ₹{earning.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6">Bookings</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body text-neutral-medium-gray">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm hover:shadow-md transition-shadow"
                >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-h3 text-neutral-charcoal mb-1">{booking.property?.name || 'Unknown Property'}</h3>
                          <p className="text-body text-neutral-medium-gray">Guest: {booking.user?.name || 'Unknown Guest'}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-caption font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-accent-teal/10 text-accent-teal'
                              : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : booking.status === 'completed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : booking.status === 'cancelled'
                                    ? 'bg-white text-neutral-dark-gray'
                                    : 'bg-white text-neutral-medium-gray'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-caption text-neutral-medium-gray">Check-in</p>
                          <p className="text-body font-medium">{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-caption text-neutral-medium-gray">Check-out</p>
                          <p className="text-body font-medium">{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-caption text-neutral-medium-gray">Guests</p>
                          <p className="text-body font-medium">{booking.guests}</p>
                        </div>
                        <div>
                          <p className="text-caption text-neutral-medium-gray">Booking Date</p>
                          <p className="text-body font-medium">{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3">
                      <p className="text-h2 font-semibold text-neutral-charcoal">
                        ₹{Number(booking.totalPrice).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={updatingBookingId === booking.id}
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              className="px-4 py-2 bg-accent-teal text-neutral-light-gray rounded-lg text-body font-medium hover:bg-accent-teal/90 disabled:opacity-50"
                            >
                              {updatingBookingId === booking.id ? '…' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              disabled={updatingBookingId === booking.id}
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              className="px-4 py-2 border-2 border-neutral-border-gray text-neutral-charcoal rounded-lg text-body font-medium hover:bg-white disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            disabled={updatingBookingId === booking.id}
                            onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                            className="px-4 py-2 bg-blue-600 text-neutral-light-gray rounded-lg text-body font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingBookingId === booking.id ? '…' : 'Mark Completed'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedBookingId(booking.id)}
                          className="px-4 py-2 border-2 border-primary-coral/50 text-primary-coral rounded-lg text-body font-medium hover:bg-primary-coral/10 transition-colors"
                        >
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

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2">Property Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-h3 font-semibold">
                    {reviews.length > 0
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : '0.0'}
                  </span>
                </div>
                <span className="text-body text-neutral-medium-gray">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body text-neutral-medium-gray">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 border border-neutral-border-gray shadow-sm"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-coral/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-coral" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-body font-semibold text-neutral-charcoal">{review.user?.name || 'Anonymous'}</h4>
                          <p className="text-caption text-neutral-medium-gray">{review.property?.name || 'Unknown Property'}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-neutral-border-gray'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-body text-neutral-dark-gray mb-2">{review.comment || 'No comment provided'}</p>
                      <p className="text-caption text-neutral-medium-gray">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'plan-my-trip' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 text-neutral-charcoal">Plan My Trip</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddTripPlanModal(true);
                  setEditingTripPlanId(null);
                  setTripPlanForm({ name: '', description: '', iconName: 'map', link: '/', sortOrder: tripPlanItems.length });
                }}
                className="px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-medium hover:bg-primary-coral/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <p className="text-body text-neutral-medium-gray mb-6">
              Manage the &quot;Plan My Trip&quot; cards shown on the user app homepage.
            </p>
            {tripPlanItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-border-gray shadow-sm">
                <LayoutGrid className="w-12 h-12 text-neutral-medium-gray mx-auto mb-4 opacity-50" />
                <p className="text-body text-neutral-medium-gray">No items yet. Add items to show on the Plan My Trip section.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTripPlanModal(true);
                    setTripPlanForm({ name: '', description: '', iconName: 'map', link: '/', sortOrder: 0 });
                  }}
                  className="mt-4 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg hover:bg-primary-coral/90"
                >
                  Add Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tripPlanItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 sm:p-6 border border-neutral-border-gray shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-h3 text-neutral-charcoal">{item.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-caption ${item.isActive ? 'bg-accent-teal/10 text-accent-teal' : 'bg-white text-neutral-medium-gray'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-body text-neutral-medium-gray mb-1">{item.description}</p>
                      <p className="text-caption text-neutral-medium-gray">Link: {item.link}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleTripPlanActive(item)}
                        className="px-3 py-1.5 border border-neutral-border-gray rounded-lg text-body hover:bg-white"
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTripPlanId(item.id);
                          setShowAddTripPlanModal(true);
                          setTripPlanForm({
                            name: item.name,
                            description: item.description,
                            iconName: item.iconName,
                            link: item.link,
                            sortOrder: item.sortOrder,
                          });
                        }}
                        className="p-2 text-primary-coral hover:bg-primary-coral/10 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTripPlanItem(item.id)}
                        className="p-2 text-neutral-charcoal hover:bg-white rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-h2 mb-6 text-neutral-charcoal">Admin Settings</h2>
            
            {settingsError && (
              <div className="mb-6 bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{settingsError}</p>
              </div>
            )}
            {settingsSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Settings saved successfully!</p>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSavingSettings(true);
              setSettingsError('');
              setSettingsSuccess(false);

              const token = localStorage.getItem('userToken');
              if (!token) {
                setSettingsError('You must be logged in to save settings');
                setIsSavingSettings(false);
                return;
              }

              try {
                const response = await fetch(`${API_BASE_URL}/users/me/host-settings`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify(hostSettings),
                });

                if (response.ok) {
                  setSettingsSuccess(true);
                  setTimeout(() => setSettingsSuccess(false), 3000);
                } else {
                  let errMsg = 'Failed to save settings';
                  try {
                    const error = await response.json();
                    errMsg = error?.message || errMsg;
                  } catch { /* body may not be JSON */ }
                  setSettingsError(errMsg);
                }
              } catch (error) {
                console.error('Error saving settings:', error);
                setSettingsError('Failed to save settings. Please try again.');
              } finally {
                setIsSavingSettings(false);
              }
            }} className="space-y-6">
              {/* Payment & Banking */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-border-gray">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-6 h-6 text-primary-coral" />
                  <h3 className="text-h3 text-neutral-charcoal">Payment & Banking</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">Bank Account Number</label>
                    <input
                      type="text"
                      value={hostSettings.bankAccountNumber}
                      onChange={(e) => setHostSettings(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                      placeholder="Enter bank account number"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">IFSC Code</label>
                    <input
                      type="text"
                      value={hostSettings.ifscCode}
                      onChange={(e) => setHostSettings(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      placeholder="Enter IFSC code"
                      maxLength={11}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">Account Holder Name</label>
                    <input
                      type="text"
                      value={hostSettings.accountHolderName}
                      onChange={(e) => setHostSettings(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      placeholder="Enter account holder name"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-border-gray">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-primary-coral" />
                  <h3 className="text-h3 text-neutral-charcoal">Tax Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">PAN Number</label>
                    <input
                      type="text"
                      value={hostSettings.panNumber}
                      onChange={(e) => setHostSettings(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                      placeholder="Enter PAN number"
                      maxLength={10}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">GST Number (Optional)</label>
                    <input
                      type="text"
                      value={hostSettings.gstNumber}
                      onChange={(e) => setHostSettings(prev => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
                      placeholder="Enter GST number"
                      maxLength={15}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-border-gray">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-primary-coral" />
                  <h3 className="text-h3 text-neutral-charcoal">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-neutral-charcoal">Email Notifications</p>
                      <p className="text-caption text-neutral-medium-gray">Receive booking and payment updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-coral rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-neutral-charcoal">SMS Notifications</p>
                      <p className="text-caption text-neutral-medium-gray">Receive important updates via SMS</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary-coral rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-neutral-charcoal">Marketing Emails</p>
                      <p className="text-caption text-neutral-medium-gray">Receive tips and promotional offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-coral rounded" />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSavingSettings}
                whileHover={{ scale: isSavingSettings ? 1 : 1.02 }}
                whileTap={{ scale: isSavingSettings ? 1 : 0.98 }}
                className={`w-full px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold transition-all shadow-md hover:shadow-lg ${
                  isSavingSettings ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <AdminFooter />

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddPropertyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAddPropertyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-border-gray">
                <div>
                  <h3 className="text-xl sm:text-h1 text-neutral-charcoal font-bold">
                    {editingPropertyId ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  <p className="text-sm sm:text-body text-neutral-medium-gray mt-1">
                    {editingPropertyId 
                      ? 'Update your property details'
                      : 'Fill in the details to list your property'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddPropertyModal(false);
                    setEditingPropertyId(null);
                  }}
                  className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 flex-1">
                {submitError && (
                  <div className="mb-4 bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{submitError}</p>
                  </div>
                )}
                {submitSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>Property {editingPropertyId ? 'updated' : 'created'} successfully! Refreshing list...</p>
                  </div>
                )}
                <div className="space-y-6">
                  {/* Property Name */}
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Modern Apartment in Fort Kochi"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Location, City, and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Location/Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-coral" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., Fort Kochi, Kochi"
                          required
                          className="w-full p-3 pl-10 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select a city in Kerala</option>
                        {(cities || []).map((city: { id?: string; name?: string; icon?: string; propertyCount?: number }) => (
                          <option key={city?.id || city?.name} value={city?.name || ''}>
                            {city?.icon ? `${city.icon} ${city.name}` : city?.name}
                            {(city?.propertyCount ?? 0) > 0 && ` (${city.propertyCount} properties)`}
                          </option>
                        ))}
                        {cities.length === 0 && (
                          <option value="" disabled>Loading cities...</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select a category (optional)</option>
                        {(categories || []).filter((cat: any) => cat?.isActive !== false).map((category: any) => (
                          <option key={category?.id || category?.name} value={category?.id}>
                            {category?.name}
                          </option>
                        ))}
                        {categories.length === 0 && (
                          <option value="" disabled>No categories available</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property, its features, and what makes it special..."
                      required
                      rows={4}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Price, Bedrooms, Bathrooms, Guests */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Price/Night (₹) *
                      </label>
                      <input
                        type="number"
                        name="pricePerNight"
                        value={formData.pricePerNight}
                        onChange={handleInputChange}
                        placeholder="3500"
                        required
                        min="0"
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="2"
                        required
                        min="0"
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="2"
                        required
                        min="0"
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                        Max Guests *
                      </label>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        placeholder="4"
                        required
                        min="1"
                        className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-body font-medium mb-3 text-neutral-charcoal">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {availableAmenities.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            amenities.includes(amenity)
                              ? 'border-primary-coral bg-primary-coral/10 text-primary-coral'
                              : 'border-neutral-border-gray hover:border-primary-coral/50'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-body font-medium mb-3 text-neutral-charcoal">
                      Property Images *
                    </label>
                    <div className="space-y-4">
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-coral/50 rounded-lg cursor-pointer hover:border-primary-coral hover:bg-primary-coral/5 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-primary-coral mb-2" />
                          <p className="text-sm text-neutral-charcoal font-medium">
                            Click to upload images
                          </p>
                          <p className="text-xs text-neutral-medium-gray mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Image Preview Grid */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Property ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-primary-coral text-neutral-light-gray rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-neutral-border-gray">
                  <button
                    type="button"
                    onClick={() => setShowAddPropertyModal(false)}
                    className="px-6 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{editingPropertyId ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <span>{editingPropertyId ? 'Update Property' : 'Add Property'}</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Experience Modal */}
      <AnimatePresence>
        {showAddExperienceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setShowAddExperienceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8"
            >
              <div className="p-6 border-b border-neutral-border-gray flex items-center justify-between">
                <h2 className="text-h1 text-neutral-charcoal font-bold">Add New Experience</h2>
                <button
                  onClick={() => setShowAddExperienceModal(false)}
                  className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleExperienceSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {submitError && (
                  <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-body">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-body flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Experience added successfully!</span>
                  </div>
                )}

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Experience Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={experienceFormData.name}
                    onChange={handleExperienceInputChange}
                    placeholder="e.g., Heritage Walk in Fort Kochi"
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={experienceFormData.location}
                      onChange={handleExperienceInputChange}
                      placeholder="e.g., Fort Kochi, Kochi"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      City *
                    </label>
                    <select
                      name="city"
                      value={experienceFormData.city}
                      onChange={handleExperienceInputChange}
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    >
                      <option value="">Select City</option>
                      {KERALA_CITIES_LIST.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={experienceFormData.description}
                    onChange={handleExperienceInputChange}
                    placeholder="Describe your experience..."
                    required
                    rows={4}
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Price per Person (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={experienceFormData.price}
                      onChange={handleExperienceInputChange}
                      placeholder="1500"
                      required
                      min="0"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={experienceFormData.duration}
                      onChange={handleExperienceInputChange}
                      placeholder="e.g., 3 hours"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={experienceFormData.maxParticipants}
                      onChange={handleExperienceInputChange}
                      placeholder="10"
                      min="1"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={experienceFormData.category}
                    onChange={handleExperienceInputChange}
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  >
                    <option value="">Select Category</option>
                    <option value="Culture">Culture & Heritage</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Wellness">Wellness & Spa</option>
                    <option value="Nature">Nature & Wildlife</option>
                    <option value="Photography">Photography</option>
                    <option value="Art">Art & Craft</option>
                    <option value="Music">Music & Dance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Experience Images
                  </label>
                  <input
                    ref={experienceFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        setExperienceImageFiles((prev) => [...prev, ...Array.from(files)]);
                      }
                      e.target.value = '';
                    }}
                  />
                  <div className="space-y-3">
                    {experienceImageFiles.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {experienceImageFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-neutral-border-gray"
                            />
                            <button
                              type="button"
                              onClick={() => setExperienceImageFiles((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-neutral-charcoal text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100"
                              aria-label="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => experienceFileInputRef.current?.click()}
                      className="px-4 py-3 border-2 border-dashed border-primary-coral/50 text-primary-coral rounded-lg hover:bg-primary-coral/10 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload images
                    </button>
                    <p className="text-caption text-neutral-medium-gray">
                      JPEG, PNG, GIF or WebP. You can select multiple files.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddExperienceModal(false);
                      setExperienceFormData({
                        name: '',
                        location: '',
                        city: '',
                        description: '',
                        price: '',
                        duration: '',
                        category: '',
                        maxParticipants: '',
                      });
                      setExperienceImageFiles([]);
                      setSubmitError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Add Experience</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Guide Modal */}
      <AnimatePresence>
        {showAddGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setShowAddGuideModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full my-8"
            >
              <div className="p-6 border-b border-neutral-border-gray flex items-center justify-between">
                <h2 className="text-h1 text-neutral-charcoal font-bold">Add New Guide</h2>
                <button
                  onClick={() => setShowAddGuideModal(false)}
                  className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleGuideSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {submitError && (
                  <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-body">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-body flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Guide added successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Guide Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={guideFormData.name}
                      onChange={handleGuideInputChange}
                      placeholder="e.g., John Doe"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={guideFormData.location}
                      onChange={handleGuideInputChange}
                      placeholder="e.g., Kochi, Kerala"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={guideFormData.description}
                    onChange={handleGuideInputChange}
                    placeholder="Describe the guide's expertise and experience..."
                    required
                    rows={4}
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Price per Day (₹) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={guideFormData.pricePerDay}
                      onChange={handleGuideInputChange}
                      placeholder="2000"
                      required
                      min="0"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={guideFormData.languages}
                      onChange={handleGuideInputChange}
                      placeholder="e.g., English, Malayalam, Hindi"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="specialties"
                      value={guideFormData.specialties}
                      onChange={handleGuideInputChange}
                      placeholder="e.g., Historical Tours, Food Tours"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={guideFormData.phoneNumber}
                      onChange={handleGuideInputChange}
                      placeholder="+91 9876543210"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guideFormData.email}
                      onChange={handleGuideInputChange}
                      placeholder="guide@example.com"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Images
                  </label>
                  <input
                    ref={guideFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        setGuideImageFiles(prev => [...prev, ...Array.from(files)]);
                        e.target.value = '';
                      }
                    }}
                  />
                  {guideImageFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      {guideImageFiles.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-neutral-border-gray">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setGuideImageFiles(prev => prev.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 p-1.5 bg-primary-coral text-neutral-light-gray rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-coral/90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="absolute bottom-1 left-1 right-1 text-xs text-neutral-light-gray bg-black/60 rounded px-2 py-1 truncate">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => guideFileInputRef.current?.click()}
                    className="px-4 py-3 border-2 border-dashed border-primary-coral/50 text-primary-coral rounded-lg hover:bg-primary-coral/10 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    + Upload Images
                  </button>
                  <p className="mt-1 text-sm text-neutral-medium-gray">
                    JPEG, PNG, GIF or WebP. Max 5MB per image.
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={guideFormData.isAvailable}
                      onChange={handleGuideInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={guideFormData.isActive}
                      onChange={handleGuideInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={guideFormData.isFeatured}
                      onChange={handleGuideInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Featured</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddGuideModal(false);
                      setGuideFormData({
                        name: '',
                        location: '',
                        description: '',
                        pricePerDay: '',
                        languages: '',
                        specialties: '',
                        phoneNumber: '',
                        email: '',
                        isAvailable: true,
                        isActive: true,
                        isFeatured: false,
                      });
                      setGuideImageFiles([]);
                      setSubmitError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Add Guide</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Offer Modal */}
      <AnimatePresence>
        {showAddOfferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={() => !isSubmitting && setShowAddOfferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-border-gray">
                <h2 className="text-h1 text-neutral-charcoal font-bold">Add Special Offer</h2>
                <button
                  onClick={() => !isSubmitting && setShowAddOfferModal(false)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleOfferSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {submitError && (
                  <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-body">{submitError}</div>
                )}
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-body flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Offer created successfully!</span>
                  </div>
                )}
                <div>
                  <label className="block text-body font-medium mb-1 text-neutral-charcoal">Offer Title *</label>
                  <input
                    type="text"
                    value={offerFormData.title}
                    onChange={(e) => setOfferFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., Summer Special"
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-1 text-neutral-charcoal">Description *</label>
                  <input
                    type="text"
                    value={offerFormData.description}
                    onChange={(e) => setOfferFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="e.g., On Domestic Hotels"
                    required
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-1 text-neutral-charcoal">Discount *</label>
                    <input
                      type="number"
                      value={offerFormData.discount}
                      onChange={(e) => setOfferFormData((p) => ({ ...p, discount: e.target.value }))}
                      placeholder="e.g., 1500 or 50"
                      required
                      min="0"
                      step="0.01"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-1 text-neutral-charcoal">Discount Type</label>
                    <select
                      value={offerFormData.discountType}
                      onChange={(e) => setOfferFormData((p) => ({ ...p, discountType: e.target.value as 'fixed' | 'percentage' }))}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    >
                      <option value="fixed">Fixed (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-body font-medium mb-1 text-neutral-charcoal">Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const compressImage = (f: File): Promise<string> =>
                        new Promise((resolve, reject) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX = 800;
                            let { width, height } = img;
                            if (width > MAX || height > MAX) {
                              if (width > height) {
                                height = (height / width) * MAX;
                                width = MAX;
                              } else {
                                width = (width / height) * MAX;
                                height = MAX;
                              }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) {
                              reject(new Error('No canvas context'));
                              return;
                            }
                            ctx.drawImage(img, 0, 0, width, height);
                            canvas.toBlob(
                              (blob) => {
                                if (!blob) {
                                  reject(new Error('Blob failed'));
                                  return;
                                }
                                const r = new FileReader();
                                r.onload = () => resolve(r.result as string);
                                r.readAsDataURL(blob);
                              },
                              'image/jpeg',
                              0.7
                            );
                          };
                          img.onerror = () => reject(new Error('Image load failed'));
                          img.src = URL.createObjectURL(f);
                        });
                      try {
                        const dataUrl = await compressImage(file);
                        setOfferFormData((p) => ({ ...p, image: dataUrl }));
                      } catch {
                        const reader = new FileReader();
                        reader.onload = () => setOfferFormData((p) => ({ ...p, image: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-coral/10 file:text-primary-coral"
                  />
                  {offerFormData.image && (
                    <div className="mt-2 relative inline-block">
                      <img src={offerFormData.image} alt="Preview" className="h-20 object-cover rounded-lg border border-neutral-border-gray" />
                      <button
                        type="button"
                        onClick={() => setOfferFormData((p) => ({ ...p, image: '' }))}
                        className="absolute -top-1 -right-1 p-1 bg-primary-coral text-neutral-light-gray rounded-full hover:bg-primary-coral/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-1 text-neutral-charcoal">Valid From *</label>
                    <input
                      type="date"
                      value={offerFormData.validFrom}
                      onChange={(e) => setOfferFormData((p) => ({ ...p, validFrom: e.target.value }))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    />
                    <p className="text-caption text-neutral-medium-gray mt-1">Leave empty or same as expiry for single-day offer</p>
                  </div>
                  <div>
                    <label className="block text-body font-medium mb-1 text-neutral-charcoal">Expiry Date *</label>
                    <input
                      type="date"
                      value={offerFormData.expiryDate}
                      onChange={(e) => setOfferFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                      required
                      min={offerFormData.validFrom || format(new Date(), 'yyyy-MM-dd')}
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-body font-medium mb-1 text-neutral-charcoal">Terms (optional)</label>
                  <input
                    type="text"
                    value={offerFormData.terms}
                    onChange={(e) => setOfferFormData((p) => ({ ...p, terms: e.target.value }))}
                    placeholder="e.g., Valid on bookings above Rs.5000"
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-1 text-neutral-charcoal">Promo Code (optional)</label>
                  <input
                    type="text"
                    value={offerFormData.code}
                    onChange={(e) => setOfferFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g., SUMMER24"
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddOfferModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Add Offer'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Cab Modal */}
      <AnimatePresence>
        {showAddCabModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setShowAddCabModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full my-8"
            >
              <div className="p-6 border-b border-neutral-border-gray flex items-center justify-between">
                <h2 className="text-h1 text-neutral-charcoal font-bold">Add New Cab</h2>
                <button
                  onClick={() => setShowAddCabModal(false)}
                  className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCabSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {submitError && (
                  <div className="bg-white border-2 border-neutral-border-gray text-neutral-charcoal px-4 py-3 rounded-lg text-body">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-body flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Cab added successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      name="vehicleName"
                      value={cabFormData.vehicleName}
                      onChange={handleCabInputChange}
                      placeholder="e.g., Toyota Innova"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={cabFormData.vehicleNumber}
                      onChange={handleCabInputChange}
                      placeholder="e.g., KL-01-AB-1234"
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={cabFormData.vehicleType}
                      onChange={handleCabInputChange}
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    >
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Van">Van</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Seats *
                    </label>
                    <select
                      name="seats"
                      value={cabFormData.seats}
                      onChange={handleCabInputChange}
                      required
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    >
                      <option value="">Select Seats</option>
                      <option value="4">4 Seats</option>
                      <option value="5">5 Seats</option>
                      <option value="7">7 Seats</option>
                      <option value="8">8 Seats</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Price per Km (₹) *
                    </label>
                    <input
                      type="number"
                      name="pricePerKm"
                      value={cabFormData.pricePerKm}
                      onChange={handleCabInputChange}
                      placeholder="15"
                      required
                      min="0"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      value={cabFormData.basePrice}
                      onChange={handleCabInputChange}
                      placeholder="100"
                      min="0"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={cabFormData.amenities}
                    onChange={handleCabInputChange}
                    placeholder="e.g., AC, Music System, GPS"
                    className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      name="driverName"
                      value={cabFormData.driverName}
                      onChange={handleCabInputChange}
                      placeholder="Driver name"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Driver Phone
                    </label>
                    <input
                      type="tel"
                      name="driverPhone"
                      value={cabFormData.driverPhone}
                      onChange={handleCabInputChange}
                      placeholder="+91 9876543210"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                      Driver License
                    </label>
                    <input
                      type="text"
                      name="driverLicense"
                      value={cabFormData.driverLicense}
                      onChange={handleCabInputChange}
                      placeholder="License number"
                      className="w-full p-3 border-2 border-primary-coral/50 rounded-lg focus:border-primary-coral focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium mb-2 text-neutral-charcoal">
                    Cab Images
                  </label>
                  <input
                    ref={cabFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) setCabImageFiles((prev) => [...prev, ...Array.from(files)]);
                      e.target.value = '';
                    }}
                  />
                  <div className="space-y-3">
                    {cabImageFiles.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {cabImageFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-neutral-border-gray"
                            />
                            <button
                              type="button"
                              onClick={() => setCabImageFiles((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-neutral-charcoal text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100"
                              aria-label="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => cabFileInputRef.current?.click()}
                      className="px-4 py-3 border-2 border-dashed border-primary-coral/50 text-primary-coral rounded-lg hover:bg-primary-coral/10 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload images
                    </button>
                    <p className="text-caption text-neutral-medium-gray">
                      JPEG, PNG, GIF or WebP. You can select multiple files.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={cabFormData.isAvailable}
                      onChange={handleCabInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={cabFormData.isActive}
                      onChange={handleCabInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={cabFormData.isFeatured}
                      onChange={handleCabInputChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-body text-neutral-charcoal">Featured</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCabModal(false);
                      setCabFormData({
                        vehicleName: '',
                        vehicleNumber: '',
                        vehicleType: '',
                        seats: '',
                        pricePerKm: '',
                        basePrice: '',
                        driverName: '',
                        driverPhone: '',
                        driverLicense: '',
                        amenities: '',
                        isAvailable: true,
                        isActive: true,
                        isFeatured: false,
                      });
                      setCabImageFiles([]);
                      setSubmitError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary-coral text-neutral-light-gray rounded-lg text-body font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Car className="w-4 h-4" />
                        <span>Add Cab</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Trip Plan Item Modal */}
      <AnimatePresence>
        {showAddTripPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => { setShowAddTripPlanModal(false); setEditingTripPlanId(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-h2 text-neutral-charcoal mb-6">{editingTripPlanId ? 'Edit Item' : 'Add Item'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-body font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={tripPlanForm.name}
                    onChange={(e) => setTripPlanForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Local Experiences"
                    className="w-full p-3 border border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={tripPlanForm.description}
                    onChange={(e) => setTripPlanForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="e.g. Discover authentic local activities"
                    className="w-full p-3 border border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Icon</label>
                  <select
                    value={tripPlanForm.iconName}
                    onChange={(e) => setTripPlanForm((p) => ({ ...p, iconName: e.target.value }))}
                    className="w-full p-3 border border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  >
                    <option value="map">Map (Local Experiences)</option>
                    <option value="camera">Camera (Photo Tours)</option>
                    <option value="utensils-crossed">Utensils (Food & Dining)</option>
                    <option value="car">Car (Transport)</option>
                    <option value="calendar">Calendar (Itinerary)</option>
                    <option value="sparkles">Sparkles</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Link</label>
                  <input
                    type="text"
                    value={tripPlanForm.link}
                    onChange={(e) => setTripPlanForm((p) => ({ ...p, link: e.target.value }))}
                    placeholder="e.g. /experiences or /transport"
                    className="w-full p-3 border border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body font-medium mb-2">Sort Order</label>
                  <input
                    type="number"
                    min={0}
                    value={tripPlanForm.sortOrder}
                    onChange={(e) => setTripPlanForm((p) => ({ ...p, sortOrder: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full p-3 border border-neutral-border-gray rounded-lg focus:border-primary-coral focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddTripPlanModal(false); setEditingTripPlanId(null); }}
                  className="flex-1 px-4 py-2 border border-neutral-border-gray rounded-lg hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTripPlanItem}
                  disabled={!tripPlanForm.name.trim()}
                  className="flex-1 px-4 py-2 bg-primary-coral text-neutral-light-gray rounded-lg hover:bg-primary-coral/90 disabled:opacity-50"
                >
                  {editingTripPlanId ? 'Save' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBookingId && (() => {
          const selBooking = bookings.find(b => b.id === selectedBookingId);
          if (!selBooking) return null;
          return (
            <motion.div
              key="booking-detail-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedBookingId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-h2 text-neutral-charcoal">Booking Details</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedBookingId(null)}
                    className="p-2 rounded-lg hover:bg-white text-neutral-medium-gray"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-caption text-neutral-medium-gray">Property</p>
                    <p className="text-body font-medium">{selBooking.property?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-caption text-neutral-medium-gray">Guest</p>
                    <p className="text-body font-medium">{selBooking.user?.name || 'Unknown'}</p>
                    {selBooking.user?.email && (
                      <p className="text-body text-neutral-medium-gray">{selBooking.user.email}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-caption text-neutral-medium-gray">Check-in</p>
                      <p className="text-body font-medium">{format(new Date(selBooking.checkIn), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-caption text-neutral-medium-gray">Check-out</p>
                      <p className="text-body font-medium">{format(new Date(selBooking.checkOut), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-caption text-neutral-medium-gray">Guests</p>
                      <p className="text-body font-medium">{selBooking.guests}</p>
                    </div>
                    <div>
                      <p className="text-caption text-neutral-medium-gray">Booking Date</p>
                      <p className="text-body font-medium">{format(new Date(selBooking.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-caption text-neutral-medium-gray">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium mt-1 ${
                      selBooking.status === 'confirmed'
                        ? 'bg-accent-teal/10 text-accent-teal'
                        : selBooking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : selBooking.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : selBooking.status === 'cancelled'
                              ? 'bg-white text-neutral-dark-gray'
                              : 'bg-white text-neutral-medium-gray'
                    }`}>
                      {selBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-caption text-neutral-medium-gray">Total Price</p>
                    <p className="text-h2 font-semibold">₹{Number(selBooking.totalPrice).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-border-gray">
                  {selBooking.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        disabled={updatingBookingId === selBooking.id}
                        onClick={() => handleUpdateBookingStatus(selBooking.id, 'confirmed')}
                        className="px-4 py-2 bg-accent-teal text-neutral-light-gray rounded-lg text-body font-medium hover:bg-accent-teal/90 disabled:opacity-50"
                      >
                        {updatingBookingId === selBooking.id ? '…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        disabled={updatingBookingId === selBooking.id}
                        onClick={() => handleUpdateBookingStatus(selBooking.id, 'cancelled')}
                        className="px-4 py-2 border-2 border-neutral-border-gray text-neutral-charcoal rounded-lg text-body font-medium hover:bg-white disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {selBooking.status === 'confirmed' && (
                    <button
                      type="button"
                      disabled={updatingBookingId === selBooking.id}
                      onClick={() => handleUpdateBookingStatus(selBooking.id, 'completed')}
                      className="px-4 py-2 bg-blue-600 text-neutral-light-gray rounded-lg text-body font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updatingBookingId === selBooking.id ? '…' : 'Mark Completed'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedBookingId(null)}
                    className="px-4 py-2 border border-neutral-border-gray rounded-lg text-body font-medium hover:bg-white"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
