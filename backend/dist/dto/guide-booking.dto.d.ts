import { GuideBookingStatus } from '../entities/guide-booking.entity';
export declare class CreateGuideBookingDto {
    bookingDate: string;
    numberOfDays?: number;
    message?: string;
}
export declare class UpdateGuideBookingStatusDto {
    status: GuideBookingStatus;
}
