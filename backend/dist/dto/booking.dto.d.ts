import { BookingStatus } from '../entities/booking.entity';
export declare class CreateBookingDto {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    paymentMethod?: string;
}
export declare class UpdateBookingDto {
    status?: BookingStatus;
    paymentTransactionId?: string;
    isPaid?: boolean;
}
