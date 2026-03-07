"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
const property_entity_1 = require("../entities/property.entity");
const experience_entity_1 = require("../entities/experience.entity");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, propertyRepository, experienceRepository) {
        this.categoryRepository = categoryRepository;
        this.propertyRepository = propertyRepository;
        this.experienceRepository = experienceRepository;
    }
    async create(createCategoryDto) {
        const category = this.categoryRepository.create({
            ...createCategoryDto,
            link: createCategoryDto.link || `/${createCategoryDto.name.toLowerCase().replace(/\s+/g, '-')}`,
        });
        return this.categoryRepository.save(category);
    }
    async findAll(filters) {
        const query = this.categoryRepository.createQueryBuilder('category');
        if (filters?.isActive !== undefined) {
            query.andWhere('category.isActive = :isActive', { isActive: filters.isActive });
        }
        if (filters?.isFeatured !== undefined) {
            query.andWhere('category.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
        }
        const categories = await query.orderBy('category.createdAt', 'ASC').getMany();
        for (const category of categories) {
            const propertyCount = await this.propertyRepository.count({
                where: { isActive: true },
            });
            const experienceCount = await this.experienceRepository.count({
                where: { isActive: true },
            });
            category.propertyCount = propertyCount;
            category.experienceCount = experienceCount;
        }
        return categories;
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findByName(name) {
        return this.categoryRepository.findOne({ where: { name } });
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
    async getFeatured() {
        return this.categoryRepository.find({
            where: { isFeatured: true, isActive: true },
            order: { createdAt: 'ASC' },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map