import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';
export declare class BookingsService {
    private bookingRepository;
    private propertyRepository;
    constructor(bookingRepository: Repository<Booking>, propertyRepository: Repository<Property>);
    create(createBookingDto: CreateBookingDto, user: User): Promise<Booking>;
    findAll(user: User): Promise<Booking[]>;
    findOne(id: string, user: User): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto, user: User): Promise<Booking>;
    cancel(id: string, user: User): Promise<Booking>;
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
}
