import { User } from './user.entity';
import { Property } from './property.entity';
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    property: Property;
    propertyId: string;
}
