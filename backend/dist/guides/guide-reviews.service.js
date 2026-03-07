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
exports.GuideReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guide_review_entity_1 = require("../entities/guide-review.entity");
const guide_entity_1 = require("../entities/guide.entity");
let GuideReviewsService = class GuideReviewsService {
    constructor(guideReviewRepository, guideRepository) {
        this.guideReviewRepository = guideReviewRepository;
        this.guideRepository = guideRepository;
    }
    async create(guideId, createGuideReviewDto, user) {
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new common_1.NotFoundException(`Guide with ID ${guideId} not found`);
        }
        const existing = await this.guideReviewRepository.findOne({
            where: { guideId, userId: user.id },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already reviewed this guide');
        }
        const review = this.guideReviewRepository.create({
            guideId,
            userId: user.id,
            ...createGuideReviewDto,
        });
        const saved = await this.guideReviewRepository.save(review);
        await this.updateGuideRating(guideId);
        return this.guideReviewRepository.findOne({
            where: { id: saved.id },
            relations: ['user'],
        });
    }
    async findByGuide(guideId) {
        return this.guideReviewRepository.find({
            where: { guideId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateGuideRating(guideId) {
        const result = await this.guideReviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'avg')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.guideId = :guideId', { guideId })
            .getRawOne();
        const avg = parseFloat(result?.avg || '0');
        const count = parseInt(result?.count || '0', 10);
        await this.guideRepository.update(guideId, {
            rating: Math.round(avg * 100) / 100,
            reviewCount: count,
        });
    }
};
exports.GuideReviewsService = GuideReviewsService;
exports.GuideReviewsService = GuideReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guide_review_entity_1.GuideReview)),
    __param(1, (0, typeorm_1.InjectRepository)(guide_entity_1.Guide)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GuideReviewsService);
//# sourceMappingURL=guide-reviews.service.js.map