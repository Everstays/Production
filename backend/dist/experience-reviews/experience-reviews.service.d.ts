import { Repository } from 'typeorm';
import { ExperienceReview } from '../entities/experience-review.entity';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceReviewDto } from '../dto/experience-review.dto';
import { User } from '../entities/user.entity';
export declare class ExperienceReviewsService {
    private experienceReviewRepository;
    private experienceRepository;
    constructor(experienceReviewRepository: Repository<ExperienceReview>, experienceRepository: Repository<Experience>);
    create(experienceId: string, dto: CreateExperienceReviewDto, user: User): Promise<ExperienceReview>;
    findByExperience(experienceId: string): Promise<ExperienceReview[]>;
    private updateExperienceRating;
}
