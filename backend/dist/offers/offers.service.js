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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const offer_entity_1 = require("../entities/offer.entity");
function generateOfferCode() {
    return 'OFF' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
let OffersService = class OffersService {
    constructor(offerRepository) {
        this.offerRepository = offerRepository;
    }
    async create(createOfferDto, user) {
        const isAdmin = user && user.role === 'admin';
        const offerData = {
            ...createOfferDto,
            validFrom: createOfferDto.validFrom ? new Date(createOfferDto.validFrom) : new Date(createOfferDto.expiryDate),
            expiryDate: new Date(createOfferDto.expiryDate),
            discountType: createOfferDto.discountType || offer_entity_1.DiscountType.FIXED,
        };
        if (isAdmin && createOfferDto.type === 'host') {
            offerData.hostId = user.id;
            if (!createOfferDto.code) {
                offerData.code = generateOfferCode();
            }
        }
        const offer = this.offerRepository.create(offerData);
        const saved = await this.offerRepository.save(offer);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async findAll() {
        const today = new Date().toISOString().split('T')[0];
        return this.offerRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.host', 'host')
            .where('offer.isActive = :active', { active: true })
            .andWhere('offer.expiryDate >= :today', { today })
            .andWhere('(offer.validFrom IS NULL OR offer.validFrom <= :today)', { today })
            .orderBy('offer.createdAt', 'DESC')
            .getMany();
    }
    async findByHost(hostId) {
        return this.offerRepository.find({
            where: { hostId },
            relations: ['host'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const offer = await this.offerRepository.findOne({
            where: { id },
            relations: ['host'],
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return offer;
    }
    async findByCode(code) {
        const offer = await this.offerRepository.findOne({
            where: { code, isActive: true },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Invalid offer code');
        }
        if (new Date(offer.expiryDate) < new Date()) {
            throw new common_1.NotFoundException('Offer has expired');
        }
        return offer;
    }
    async update(id, updateOfferDto, user) {
        const offer = await this.offerRepository.findOne({ where: { id } });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        if (user) {
            if (user.role === 'admin') {
            }
            else if (offer.hostId) {
                if (offer.hostId !== user.id) {
                    throw new common_1.ForbiddenException('You can only update your own offers');
                }
            }
            else {
                throw new common_1.ForbiddenException('Only admin can update this offer');
            }
        }
        if (updateOfferDto.discountType !== undefined) {
            offer.discountType = updateOfferDto.discountType;
        }
        Object.assign(offer, updateOfferDto);
        return this.offerRepository.save(offer);
    }
    async remove(id, user) {
        const offer = await this.offerRepository.findOne({ where: { id } });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        if (user) {
            if (user.role === 'admin') {
            }
            else if (offer.hostId) {
                if (offer.hostId !== user.id) {
                    throw new common_1.ForbiddenException('You can only delete your own offers');
                }
            }
            else {
                throw new common_1.ForbiddenException('Only admin can delete this offer');
            }
        }
        await this.offerRepository.remove(offer);
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OffersService);
//# sourceMappingURL=offers.service.js.map