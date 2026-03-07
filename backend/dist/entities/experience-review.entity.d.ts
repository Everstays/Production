import { User } from './user.entity';
import { Experience } from './experience.entity';
export declare class ExperienceReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: User;
    userId: string;
    experience: Experience;
    experienceId: string;
}
