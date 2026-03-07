import { User } from './user.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { Category } from './category.entity';
export declare enum AvailabilityStatus {
    AVAILABLE = "available",
    LIMITED = "limited",
    BOOKED = "booked"
}
export declare class Property {
    id: string;
    name: string;
    location: string;
    city: string;
    images: string[];
    hostRating: number;
    pricePerNight: number;
    availability: AvailabilityStatus;
    description: string;
    amenities: string[];
    houseRules: string[];
    cancellationPolicy: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
    category: Category;
    categoryId: string;
    bookings: Booking[];
    reviews: Review[];
}
