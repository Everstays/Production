import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/experience.dto';
import { User } from '../entities/user.entity';
export declare class ExperiencesController {
    private readonly experiencesService;
    constructor(experiencesService: ExperiencesService);
    create(createExperienceDto: CreateExperienceDto, user: User): Promise<import("../entities/experience.entity").Experience>;
    findAll(city?: string, category?: string, minPrice?: string, maxPrice?: string, isActive?: string): Promise<import("../entities/experience.entity").Experience[]>;
    getFeatured(): Promise<import("../entities/experience.entity").Experience[]>;
    findMyExperiences(user: User): Promise<import("../entities/experience.entity").Experience[]>;
    findOne(id: string): Promise<import("../entities/experience.entity").Experience>;
    update(id: string, updateExperienceDto: UpdateExperienceDto, user: User): Promise<import("../entities/experience.entity").Experience>;
    remove(id: string, user: User): Promise<void>;
}
