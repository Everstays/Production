import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';
import { User } from '../entities/user.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, user: User): Promise<import("../entities/booking.entity").Booking>;
    findAll(user: User): Promise<import("../entities/booking.entity").Booking[]>;
    getEarnings(user: User): Promise<{
        totalEarnings: number;
        thisMonthEarnings: number;
        totalBookings: number;
        monthlyEarnings: Array<{
            month: string;
            amount: number;
            bookings: number;
        }>;
    }>;
    findOne(id: string, user: User): Promise<import("../entities/booking.entity").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, user: User): Promise<import("../entities/booking.entity").Booking>;
    cancel(id: string, user: User): Promise<import("../entities/booking.entity").Booking>;
}
