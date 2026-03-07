import { GuideBookingsService } from './guide-bookings.service';
import { CreateGuideBookingDto } from '../dto/guide-booking.dto';
import { User } from '../entities/user.entity';
export declare class GuideBookingsController {
    private readonly guideBookingsService;
    constructor(guideBookingsService: GuideBookingsService);
    create(guideId: string, createGuideBookingDto: CreateGuideBookingDto, user: User): Promise<import("../entities/guide-booking.entity").GuideBooking>;
    findBookings(guideId: string, user: User): Promise<import("../entities/guide-booking.entity").GuideBooking[]>;
}
