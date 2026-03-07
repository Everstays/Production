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
exports.CabsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cab_entity_1 = require("../entities/cab.entity");
let CabsService = class CabsService {
    constructor(cabRepository) {
        this.cabRepository = cabRepository;
    }
    async create(createCabDto, host) {
        const cab = this.cabRepository.create({
            ...createCabDto,
            hostId: host.id,
        });
        return this.cabRepository.save(cab);
    }
    async findAll(filters) {
        const query = this.cabRepository.createQueryBuilder('cab')
            .leftJoinAndSelect('cab.host', 'host');
        if (filters?.hostId) {
            query.where('cab.hostId = :hostId', { hostId: filters.hostId });
        }
        if (filters?.isActive !== undefined) {
            query.andWhere('cab.isActive = :isActive', { isActive: filters.isActive });
        }
        if (filters?.vehicleType) {
            query.andWhere('cab.vehicleType = :vehicleType', { vehicleType: filters.vehicleType });
        }
        if (filters?.seats) {
            query.andWhere('cab.seats = :seats', { seats: filters.seats });
        }
        return query.orderBy('cab.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const cab = await this.cabRepository.findOne({
            where: { id },
            relations: ['host'],
        });
        if (!cab) {
            throw new common_1.NotFoundException(`Cab with ID ${id} not found`);
        }
        return cab;
    }
    async findByHost(hostId) {
        return this.cabRepository.find({
            where: { hostId },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateCabDto, user) {
        const cab = await this.findOne(id);
        if (cab.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only update your own cabs');
        }
        Object.assign(cab, updateCabDto);
        return this.cabRepository.save(cab);
    }
    async remove(id, user) {
        const cab = await this.findOne(id);
        if (cab.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only delete your own cabs');
        }
        await this.cabRepository.remove(cab);
    }
};
exports.CabsService = CabsService;
exports.CabsService = CabsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cab_entity_1.Cab)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CabsService);
//# sourceMappingURL=cabs.service.js.map