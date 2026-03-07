import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/experience.dto';
import { User } from '../entities/user.entity';
export declare class ExperiencesService {
    private experienceRepository;
    constructor(experienceRepository: Repository<Experience>);
    create(createExperienceDto: CreateExperienceDto, user: User): Promise<Experience>;
    findAll(filters?: {
        city?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        isActive?: boolean;
    }): Promise<Experience[]>;
    findOne(id: string): Promise<Experience>;
    findByHost(hostId: string): Promise<Experience[]>;
    update(id: string, updateExperienceDto: UpdateExperienceDto, user: User): Promise<Experience>;
    remove(id: string, user: User): Promise<void>;
    getFeatured(): Promise<Experience[]>;
}
