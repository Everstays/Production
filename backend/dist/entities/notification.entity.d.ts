import { User } from './user.entity';
export declare enum NotificationType {
    GUIDE_BOOKING_CONFIRMED = "guide_booking_confirmed",
    GUIDE_BOOKING_CANCELLED = "guide_booking_cancelled",
    CAB_DRIVER_ASSIGNED = "cab_driver_assigned"
}
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: string;
    message: string;
    metadata: Record<string, any>;
    read: boolean;
    createdAt: Date;
}
