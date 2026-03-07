import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { User } from '../entities/user.entity';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, user: User): Promise<import("../entities/review.entity").Review>;
    findMyReviews(user: User): Promise<import("../entities/review.entity").Review[]>;
    findAll(propertyId?: string, userId?: string): Promise<import("../entities/review.entity").Review[]>;
    findOne(id: string): Promise<import("../entities/review.entity").Review>;
    update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<import("../entities/review.entity").Review>;
    remove(id: string, user: User): Promise<void>;
}
