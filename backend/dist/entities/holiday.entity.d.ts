import { User } from './user.entity';
export declare class Holiday {
    id: string;
    title: string;
    destination: string;
    description: string;
    price: number;
    duration: number;
    images: string[];
    inclusions: string[];
    exclusions: string[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isFeatured: boolean;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    host: User;
    hostId: string;
}
