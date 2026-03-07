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
exports.ExperienceReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const experience_review_entity_1 = require("../entities/experience-review.entity");
const experience_entity_1 = require("../entities/experience.entity");
let ExperienceReviewsService = class ExperienceReviewsService {
    constructor(experienceReviewRepository, experienceRepository) {
        this.experienceReviewRepository = experienceReviewRepository;
        this.experienceRepository = experienceRepository;
    }
    async create(experienceId, dto, user) {
        const experience = await this.experienceRepository.findOne({
            where: { id: experienceId },
        });
        if (!experience) {
            throw new common_1.NotFoundException(`Experience with ID ${experienceId} not found`);
        }
        const existing = await this.experienceReviewRepository.findOne({
            where: { experienceId, userId: user.id },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already reviewed this experience');
        }
        const review = this.experienceReviewRepository.create({
            experienceId,
            userId: user.id,
            rating: dto.rating,
            comment: dto.comment || '',
        });
        const saved = await this.experienceReviewRepository.save(review);
        await this.updateExperienceRating(experienceId);
        return this.experienceReviewRepository.findOne({
            where: { id: saved.id },
            relations: ['user'],
        });
    }
    async findByExperience(experienceId) {
        return this.experienceReviewRepository.find({
            where: { experienceId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateExperienceRating(experienceId) {
        const result = await this.experienceReviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'avg')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.experienceId = :experienceId', { experienceId })
            .getRawOne();
        const avg = parseFloat(result?.avg || '0');
        const count = parseInt(result?.count || '0', 10);
        await this.experienceRepository.update(experienceId, {
            rating: Math.round(avg * 100) / 100,
            reviewCount: count,
        });
    }
};
exports.ExperienceReviewsService = ExperienceReviewsService;
exports.ExperienceReviewsService = ExperienceReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(experience_review_entity_1.ExperienceReview)),
    __param(1, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExperienceReviewsService);
//# sourceMappingURL=experience-reviews.service.js.map