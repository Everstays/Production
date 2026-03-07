import { Repository } from 'typeorm';
import { GuideBooking, GuideBookingStatus } from '../entities/guide-booking.entity';
import { Guide } from '../entities/guide.entity';
import { CreateGuideBookingDto } from '../dto/guide-booking.dto';
import { User } from '../entities/user.entity';
export declare class GuideBookingsService {
    private guideBookingRepository;
    private guideRepository;
    constructor(guideBookingRepository: Repository<GuideBooking>, guideRepository: Repository<Guide>);
    create(guideId: string, dto: CreateGuideBookingDto, user: User): Promise<GuideBooking>;
    findBookings(guideId: string, user: User): Promise<GuideBooking[]>;
    findForHost(hostId: string): Promise<GuideBooking[]>;
    updateStatus(bookingId: string, status: GuideBookingStatus, user: User): Promise<GuideBooking>;
}
