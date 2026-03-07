import { User } from './user.entity';
export declare enum GuideLanguage {
    ENGLISH = "English",
    HINDI = "Hindi",
    MALAYALAM = "Malayalam",
    TAMIL = "Tamil",
    TELUGU = "Telugu",
    KANNADA = "Kannada",
    OTHER = "Other"
}
export declare class Guide {
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
    phoneNumber: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
}
