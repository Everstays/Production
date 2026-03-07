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
exports.GuidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guide_entity_1 = require("../entities/guide.entity");
let GuidesService = class GuidesService {
    constructor(guideRepository) {
        this.guideRepository = guideRepository;
    }
    async create(createGuideDto, host) {
        const guide = this.guideRepository.create({
            ...createGuideDto,
            hostId: host.id,
        });
        return this.guideRepository.save(guide);
    }
    async findAll(filters) {
        const query = this.guideRepository.createQueryBuilder('guide')
            .leftJoinAndSelect('guide.host', 'host');
        if (filters?.hostId) {
            query.where('guide.hostId = :hostId', { hostId: filters.hostId });
        }
        if (filters?.isActive !== undefined) {
            query.andWhere('guide.isActive = :isActive', { isActive: filters.isActive });
        }
        if (filters?.isAvailable !== undefined) {
            query.andWhere('guide.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
        }
        if (filters?.location) {
            query.andWhere('guide.location ILIKE :location', { location: `%${filters.location}%` });
        }
        return query.orderBy('guide.isFeatured', 'DESC').addOrderBy('guide.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const guide = await this.guideRepository.findOne({
            where: { id },
            relations: ['host'],
        });
        if (!guide) {
            throw new common_1.NotFoundException(`Guide with ID ${id} not found`);
        }
        return guide;
    }
    async findByHost(hostId) {
        return this.guideRepository.find({
            where: { hostId },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateGuideDto, user) {
        const guide = await this.findOne(id);
        if (guide.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only update your own guides');
        }
        Object.assign(guide, updateGuideDto);
        return this.guideRepository.save(guide);
    }
    async remove(id, user) {
        const guide = await this.findOne(id);
        if (guide.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only delete your own guides');
        }
        await this.guideRepository.remove(guide);
    }
};
exports.GuidesService = GuidesService;
exports.GuidesService = GuidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guide_entity_1.Guide)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GuidesService);
//# sourceMappingURL=guides.service.js.map