import { User } from './user.entity';
import { Guide } from './guide.entity';
export declare class GuideReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: User;
    userId: string;
    guide: Guide;
    guideId: string;
}
