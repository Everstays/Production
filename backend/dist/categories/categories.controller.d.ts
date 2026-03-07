import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("../entities/category.entity").Category>;
    findAll(isActive?: string, isFeatured?: string): Promise<import("../entities/category.entity").Category[]>;
    getFeatured(): Promise<import("../entities/category.entity").Category[]>;
    findOne(id: string): Promise<import("../entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("../entities/category.entity").Category>;
    remove(id: string): Promise<void>;
}
