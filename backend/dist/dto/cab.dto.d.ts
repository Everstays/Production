import { CabType, CabSeats } from '../entities/cab.entity';
export declare class CreateCabDto {
    vehicleName: string;
    vehicleNumber: string;
    vehicleType: CabType;
    seats: CabSeats;
    images?: string[];
    amenities?: string[];
    pricePerKm: number;
    basePrice?: number;
    isAvailable?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    driverName?: string;
    driverPhone?: string;
    driverLicense?: string;
}
export declare class UpdateCabDto {
    vehicleName?: string;
    vehicleNumber?: string;
    vehicleType?: CabType;
    seats?: CabSeats;
    images?: string[];
    amenities?: string[];
    pricePerKm?: number;
    basePrice?: number;
    isAvailable?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    driverName?: string;
    driverPhone?: string;
    driverLicense?: string;
}
