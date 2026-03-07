import { GuideReviewsService } from './guide-reviews.service';
import { CreateGuideReviewDto } from '../dto/guide-review.dto';
import { User } from '../entities/user.entity';
export declare class GuideReviewsController {
    private readonly guideReviewsService;
    constructor(guideReviewsService: GuideReviewsService);
    findAll(guideId: string): Promise<import("../entities/guide-review.entity").GuideReview[]>;
    create(guideId: string, createGuideReviewDto: CreateGuideReviewDto, user: User): Promise<import("../entities/guide-review.entity").GuideReview>;
}
