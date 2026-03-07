export declare class CreateGuideDto {
    name: string;
    location: string;
    description: string;
    pricePerDay: number;
    images?: string[];
    languages?: string[];
    specialties?: string[];
    isAvailable?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    phoneNumber?: string;
    email?: string;
}
export declare class UpdateGuideDto {
    name?: string;
    location?: string;
    description?: string;
    pricePerDay?: number;
    images?: string[];
    languages?: string[];
    specialties?: string[];
    isAvailable?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    phoneNumber?: string;
    email?: string;
}
