import { Property } from './property.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    role: UserRole;
    wishlist: string[];
    phone: string;
    isActive: boolean;
    resetToken: string;
    resetTokenExpiry: Date;
    bankAccountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    panNumber: string;
    gstNumber: string;
    createdAt: Date;
    updatedAt: Date;
    properties: Property[];
    bookings: Booking[];
    reviews: Review[];
}
