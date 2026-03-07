import { ExperienceReviewsService } from './experience-reviews.service';
import { CreateExperienceReviewDto } from '../dto/experience-review.dto';
import { User } from '../entities/user.entity';
export declare class ExperienceReviewsController {
    private readonly experienceReviewsService;
    constructor(experienceReviewsService: ExperienceReviewsService);
    findAll(experienceId: string): Promise<import("../entities/experience-review.entity").ExperienceReview[]>;
    create(experienceId: string, createExperienceReviewDto: CreateExperienceReviewDto, user: User): Promise<import("../entities/experience-review.entity").ExperienceReview>;
}
