import { AvailabilityStatus } from '../entities/property.entity';
export declare class CreatePropertyDto {
    name: string;
    location: string;
    city: string;
    images: string[];
    pricePerNight: number;
    description: string;
    amenities?: string[];
    houseRules?: string[];
    cancellationPolicy: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    latitude?: number;
    longitude?: number;
    availability?: AvailabilityStatus;
    categoryId?: string;
    isFeatured?: boolean;
}
export declare class UpdatePropertyDto {
    name?: string;
    location?: string;
    city?: string;
    images?: string[];
    pricePerNight?: number;
    description?: string;
    amenities?: string[];
    houseRules?: string[];
    cancellationPolicy?: string;
    bedrooms?: number;
    bathrooms?: number;
    maxGuests?: number;
    availability?: AvailabilityStatus;
    categoryId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
export declare class PropertyQueryDto {
    categoryId?: string;
    city?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
    minRating?: number;
    amenities?: string;
    page?: number;
    limit?: number;
}
