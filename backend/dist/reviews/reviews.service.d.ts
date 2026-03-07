import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { Booking } from '../entities/booking.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
export declare class ReviewsService {
    private reviewRepository;
    private propertyRepository;
    private bookingRepository;
    constructor(reviewRepository: Repository<Review>, propertyRepository: Repository<Property>, bookingRepository: Repository<Booking>);
    create(createReviewDto: CreateReviewDto, user: User): Promise<Review>;
    findAll(propertyId?: string, userId?: string): Promise<Review[]>;
    findOne(id: string): Promise<Review>;
    update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<Review>;
    remove(id: string, user: User): Promise<void>;
}
