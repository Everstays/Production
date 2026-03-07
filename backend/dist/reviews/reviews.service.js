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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../entities/review.entity");
const property_entity_1 = require("../entities/property.entity");
const booking_entity_1 = require("../entities/booking.entity");
const booking_entity_2 = require("../entities/booking.entity");
const typeorm_3 = require("typeorm");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, propertyRepository, bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
    }
    async create(createReviewDto, user) {
        const { propertyId, rating, comment } = createReviewDto;
        const property = await this.propertyRepository.findOne({
            where: { id: propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const bookings = await this.bookingRepository.find({
            where: {
                propertyId,
                userId: user.id,
                status: (0, typeorm_3.In)([booking_entity_2.BookingStatus.COMPLETED, booking_entity_2.BookingStatus.CONFIRMED, booking_entity_2.BookingStatus.PENDING]),
            },
        });
        const now = new Date();
        const nowMs = now.getTime();
        const eligibleBooking = bookings.find((b) => {
            if (b.status === booking_entity_2.BookingStatus.COMPLETED)
                return true;
            const checkout = new Date(b.checkOut);
            return checkout.getTime() <= nowMs;
        });
        if (!eligibleBooking) {
            throw new common_1.ForbiddenException('You can only review properties you have stayed at');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                propertyId,
                userId: user.id,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this property');
        }
        const review = this.reviewRepository.create({
            propertyId,
            userId: user.id,
            rating,
            comment,
            user,
            property,
        });
        return this.reviewRepository.save(review);
    }
    async findAll(propertyId, userId) {
        const where = {};
        if (propertyId)
            where.propertyId = propertyId;
        if (userId)
            where.userId = userId;
        return this.reviewRepository.find({
            where,
            relations: ['user', 'property'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['user', 'property'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async update(id, updateReviewDto, user) {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to update this review');
        }
        Object.assign(review, updateReviewDto);
        return this.reviewRepository.save(review);
    }
    async remove(id, user) {
        const review = await this.reviewRepository.findOne({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to delete this review');
        }
        await this.reviewRepository.remove(review);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map