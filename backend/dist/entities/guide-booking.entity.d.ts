import { User } from './user.entity';
import { Guide } from './guide.entity';
export declare enum GuideBookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class GuideBooking {
    id: string;
    bookingDate: string;
    numberOfDays: number;
    message: string;
    totalAmount: number;
    status: GuideBookingStatus;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    guide: Guide;
    guideId: string;
}
