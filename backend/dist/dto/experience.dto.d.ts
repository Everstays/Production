import { ExperienceCategory } from '../entities/experience.entity';
export declare class CreateExperienceDto {
    name: string;
    location: string;
    city: string;
    description: string;
    price: number;
    duration: string;
    category: ExperienceCategory;
    images?: string[];
    maxParticipants?: number;
}
export declare class UpdateExperienceDto {
    name?: string;
    location?: string;
    city?: string;
    description?: string;
    price?: number;
    duration?: string;
    category?: ExperienceCategory;
    images?: string[];
    maxParticipants?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
