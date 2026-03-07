import { User } from './user.entity';
import { Property } from './property.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class Booking {
    id: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    serviceFee: number;
    status: BookingStatus;
    paymentMethod: string;
    paymentTransactionId: string;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    property: Property;
    propertyId: string;
}
