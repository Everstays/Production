import { User } from './user.entity';
export declare enum ExperienceCategory {
    CULTURE = "Culture",
    FOOD = "Food",
    ADVENTURE = "Adventure",
    WELLNESS = "Wellness",
    NATURE = "Nature",
    PHOTOGRAPHY = "Photography",
    ART = "Art",
    MUSIC = "Music",
    OTHER = "Other"
}
export declare class Experience {
    id: string;
    name: string;
    location: string;
    city: string;
    description: string;
    price: number;
    duration: string;
    category: ExperienceCategory;
    images: string[];
    rating: number;
    reviewCount: number;
    maxParticipants: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
}
