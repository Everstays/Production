import { User } from './user.entity';
export declare enum CabType {
    SEDAN = "Sedan",
    SUV = "SUV",
    HATCHBACK = "Hatchback",
    VAN = "Van",
    LUXURY = "Luxury"
}
export declare enum CabSeats {
    FOUR = 4,
    FIVE = 5,
    SEVEN = 7,
    EIGHT = 8
}
export declare class Cab {
    id: string;
    vehicleName: string;
    vehicleNumber: string;
    vehicleType: CabType;
    seats: CabSeats;
    images: string[];
    amenities: string[];
    pricePerKm: number;
    basePrice: number;
    isAvailable: boolean;
    isActive: boolean;
    isFeatured: boolean;
    rating: number;
    reviewCount: number;
    driverName: string;
    driverPhone: string;
    driverLicense: string;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
}
