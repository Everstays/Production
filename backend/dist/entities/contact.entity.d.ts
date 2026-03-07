import { User } from './user.entity';
export declare enum ContactSubject {
    BOOKING_ISSUE = "Booking Issue",
    CANCELLATION_HELP = "Cancellation Help",
    PAYMENT_ISSUE = "Payment Issue",
    OTHER = "Other"
}
export declare enum ContactStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare class Contact {
    id: string;
    name: string;
    email: string;
    subject: ContactSubject;
    message: string;
    status: ContactStatus;
    response: string;
    respondedBy: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
