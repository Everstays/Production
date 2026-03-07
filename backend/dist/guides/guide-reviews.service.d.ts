import { Repository } from 'typeorm';
import { GuideReview } from '../entities/guide-review.entity';
import { Guide } from '../entities/guide.entity';
import { CreateGuideReviewDto } from '../dto/guide-review.dto';
import { User } from '../entities/user.entity';
export declare class GuideReviewsService {
    private guideReviewRepository;
    private guideRepository;
    constructor(guideReviewRepository: Repository<GuideReview>, guideRepository: Repository<Guide>);
    create(guideId: string, createGuideReviewDto: CreateGuideReviewDto, user: User): Promise<GuideReview>;
    findByGuide(guideId: string): Promise<GuideReview[]>;
    private updateGuideRating;
}
