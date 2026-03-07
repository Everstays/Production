import type { Property } from '../types';

export function mapApiPropertyToFrontend(api: any): Property {
  const reviews = (api.reviews || []).map((r: any) => ({
    id: r.id,
    userName: r.user?.name || 'Guest',
    userAvatar: 'https://i.pravatar.cc/150?u=' + (r.userId || r.id),
    rating: r.rating || 0,
    comment: r.comment || '',
    date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
  }));
  return {
    id: api.id,
    name: api.name,
    location: api.location,
    city: api.city,
    images: api.images || [],
    hostRating: parseFloat(api.hostRating) || 0,
    pricePerNight: parseFloat(api.pricePerNight) || 0,
    totalPrice: undefined,
    availability: api.availability || 'available',
    description: api.description || '',
    amenities: api.amenities || [],
    houseRules: api.houseRules || [],
    cancellationPolicy: api.cancellationPolicy || '',
    bedrooms: api.bedrooms,
    bathrooms: api.bathrooms,
    maxGuests: api.maxGuests,
    host: {
      name: api.host?.name || 'Host',
      avatar: 'https://i.pravatar.cc/150?u=' + (api.hostId || api.id),
      verified: true,
    },
    reviews,
    coordinates: api.latitude && api.longitude
      ? { lat: parseFloat(api.latitude), lng: parseFloat(api.longitude) }
      : undefined,
  };
}
