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
exports.ExperiencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const experience_entity_1 = require("../entities/experience.entity");
let ExperiencesService = class ExperiencesService {
    constructor(experienceRepository) {
        this.experienceRepository = experienceRepository;
    }
    async create(createExperienceDto, user) {
        if (user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admins can create experiences');
        }
        const experience = this.experienceRepository.create({
            ...createExperienceDto,
            hostId: user.id,
            images: createExperienceDto.images || [],
        });
        return this.experienceRepository.save(experience);
    }
    async findAll(filters) {
        const query = this.experienceRepository.createQueryBuilder('experience')
            .leftJoinAndSelect('experience.host', 'host')
            .where('experience.isActive = :isActive', { isActive: filters?.isActive ?? true });
        if (filters?.city) {
            query.andWhere('experience.city = :city', { city: filters.city });
        }
        if (filters?.category) {
            query.andWhere('experience.category = :category', { category: filters.category });
        }
        if (filters?.minPrice !== undefined) {
            query.andWhere('experience.price >= :minPrice', { minPrice: filters.minPrice });
        }
        if (filters?.maxPrice !== undefined) {
            query.andWhere('experience.price <= :maxPrice', { maxPrice: filters.maxPrice });
        }
        return query.orderBy('experience.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const experience = await this.experienceRepository.findOne({
            where: { id },
            relations: ['host'],
        });
        if (!experience) {
            throw new common_1.NotFoundException(`Experience with ID ${id} not found`);
        }
        return experience;
    }
    async findByHost(hostId) {
        return this.experienceRepository.find({
            where: { hostId },
            relations: ['host'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateExperienceDto, user) {
        const experience = await this.findOne(id);
        if (experience.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only update your own experiences');
        }
        Object.assign(experience, updateExperienceDto);
        return this.experienceRepository.save(experience);
    }
    async remove(id, user) {
        const experience = await this.findOne(id);
        if (experience.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only delete your own experiences');
        }
        await this.experienceRepository.remove(experience);
    }
    async getFeatured() {
        return this.experienceRepository.find({
            where: { isFeatured: true, isActive: true },
            relations: ['host'],
            order: { createdAt: 'DESC' },
            take: 12,
        });
    }
};
exports.ExperiencesService = ExperiencesService;
exports.ExperiencesService = ExperiencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExperiencesService);
//# sourceMappingURL=experiences.service.js.map