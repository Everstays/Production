export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  images: string[];
  hostRating: number;
  pricePerNight: number;
  totalPrice?: number;
  availability: 'available' | 'limited' | 'booked';
  description: string;
  amenities: string[];
  houseRules: string[];
  cancellationPolicy: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  host: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  reviews: Review[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface City {
  id: string;
  name: string;
  icon: string;
  image?: string;
  propertyCount: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  wishlist: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType?: 'fixed' | 'percentage';
  expiryDate: string;
  type: 'bank' | 'seasonal' | 'first-time' | 'long-stay' | 'host';
  code?: string;
  image?: string;
  bankName?: string;
  terms?: string;
  host?: { id: string; name: string };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

export interface Guide {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerDay: number;
  images: string[];
  languages: string[];
  specialties: string[];
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  phoneNumber?: string;
  email?: string;
  host?: { id: string; name: string; email: string };
}
