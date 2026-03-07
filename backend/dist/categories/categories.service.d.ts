import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Property } from '../entities/property.entity';
import { Experience } from '../entities/experience.entity';
export declare class CategoriesService {
    private categoryRepository;
    private propertyRepository;
    private experienceRepository;
    constructor(categoryRepository: Repository<Category>, propertyRepository: Repository<Property>, experienceRepository: Repository<Experience>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(filters?: {
        isActive?: boolean;
        isFeatured?: boolean;
    }): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    getFeatured(): Promise<Category[]>;
}
