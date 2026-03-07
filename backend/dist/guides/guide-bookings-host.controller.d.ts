import { GuideBookingsService } from './guide-bookings.service';
import { UpdateGuideBookingStatusDto } from '../dto/guide-booking.dto';
import { User } from '../entities/user.entity';
export declare class GuideBookingsHostController {
    private readonly guideBookingsService;
    constructor(guideBookingsService: GuideBookingsService);
    findForHost(user: User): Promise<import("../entities/guide-booking.entity").GuideBooking[]>;
    updateStatus(id: string, dto: UpdateGuideBookingStatusDto, user: User): Promise<import("../entities/guide-booking.entity").GuideBooking>;
}
