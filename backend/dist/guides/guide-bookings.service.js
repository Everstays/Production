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
exports.GuideBookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guide_booking_entity_1 = require("../entities/guide-booking.entity");
const guide_entity_1 = require("../entities/guide.entity");
let GuideBookingsService = class GuideBookingsService {
    constructor(guideBookingRepository, guideRepository) {
        this.guideBookingRepository = guideBookingRepository;
        this.guideRepository = guideRepository;
    }
    async create(guideId, dto, user) {
        const guide = await this.guideRepository.findOne({
            where: { id: guideId },
            relations: ['host'],
        });
        if (!guide) {
            throw new common_1.NotFoundException(`Guide with ID ${guideId} not found`);
        }
        if (!guide.isAvailable || !guide.isActive) {
            throw new common_1.NotFoundException('This guide is not available for booking');
        }
        const days = dto.numberOfDays || 1;
        const pricePerDay = Number(guide.pricePerDay);
        const totalAmount = pricePerDay * days;
        const booking = this.guideBookingRepository.create({
            guideId,
            userId: user.id,
            bookingDate: dto.bookingDate,
            numberOfDays: days,
            message: dto.message,
            totalAmount,
            status: guide_booking_entity_1.GuideBookingStatus.PENDING,
        });
        return this.guideBookingRepository.save(booking);
    }
    async findBookings(guideId, user) {
        const guide = await this.guideRepository.findOne({
            where: { id: guideId },
            relations: ['host'],
        });
        if (!guide)
            throw new common_1.NotFoundException('Guide not found');
        if (guide.hostId === user.id || user.role === 'admin') {
            return this.guideBookingRepository.find({
                where: { guideId },
                relations: ['user', 'guide'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.guideBookingRepository.find({
            where: { userId: user.id, guideId },
            relations: ['guide'],
            order: { createdAt: 'DESC' },
        });
    }
    async findForHost(hostId) {
        return this.guideBookingRepository
            .createQueryBuilder('gb')
            .leftJoinAndSelect('gb.user', 'user')
            .leftJoinAndSelect('gb.guide', 'guide')
            .where('guide.hostId = :hostId', { hostId })
            .orderBy('gb.createdAt', 'DESC')
            .getMany();
    }
    async updateStatus(bookingId, status, user) {
        const booking = await this.guideBookingRepository.findOne({
            where: { id: bookingId },
            relations: ['guide', 'guide.host'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Guide booking not found');
        }
        if (booking.guide.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only update bookings for your own guides');
        }
        if (status !== guide_booking_entity_1.GuideBookingStatus.CONFIRMED && status !== guide_booking_entity_1.GuideBookingStatus.CANCELLED) {
            throw new common_1.ForbiddenException('Host can only confirm or cancel bookings');
        }
        booking.status = status;
        return this.guideBookingRepository.save(booking);
    }
};
exports.GuideBookingsService = GuideBookingsService;
exports.GuideBookingsService = GuideBookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guide_booking_entity_1.GuideBooking)),
    __param(1, (0, typeorm_1.InjectRepository)(guide_entity_1.Guide)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GuideBookingsService);
//# sourceMappingURL=guide-bookings.service.js.map