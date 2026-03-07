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
exports.CabRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cab_request_entity_1 = require("../entities/cab-request.entity");
const property_entity_1 = require("../entities/property.entity");
const cab_entity_1 = require("../entities/cab.entity");
let CabRequestsService = class CabRequestsService {
    constructor(cabRequestRepository, propertyRepository, cabRepository) {
        this.cabRequestRepository = cabRequestRepository;
        this.propertyRepository = propertyRepository;
        this.cabRepository = cabRepository;
    }
    async create(dto, userId) {
        const property = await this.propertyRepository.findOne({
            where: { id: dto.propertyId },
            relations: ['host'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const request = this.cabRequestRepository.create({
            pickupLocation: dto.pickupLocation,
            dropLocation: dto.dropLocation,
            travelDate: dto.travelDate,
            travelTime: dto.travelTime,
            seatsPreference: dto.seatsPreference ?? '5 or 7',
            numberOfPeople: dto.numberOfPeople,
            guestName: dto.guestName,
            guestPhone: dto.guestPhone,
            guestEmail: dto.guestEmail ?? null,
            specialRequests: dto.specialRequests ?? null,
            propertyId: property.id,
            hostId: property.hostId,
            userId: userId ?? null,
            status: cab_request_entity_1.CabRequestStatus.PENDING,
        });
        return this.cabRequestRepository.save(request);
    }
    async findByHost(hostId) {
        return this.cabRequestRepository.find({
            where: { hostId },
            relations: ['property', 'assignedCab'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const request = await this.cabRequestRepository.findOne({
            where: { id },
            relations: ['property', 'assignedCab', 'host'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Cab request ${id} not found`);
        }
        return request;
    }
    async assign(requestId, cabId, user) {
        const request = await this.findOne(requestId);
        if (request.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only assign cabs to your own property requests');
        }
        if (request.status === cab_request_entity_1.CabRequestStatus.ASSIGNED) {
            throw new common_1.BadRequestException('This request is already assigned to a cab');
        }
        const cab = await this.cabRepository.findOne({
            where: { id: cabId },
        });
        if (!cab) {
            throw new common_1.NotFoundException('Cab not found');
        }
        if (cab.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only assign your own cabs');
        }
        request.assignedCabId = cabId;
        request.status = cab_request_entity_1.CabRequestStatus.ASSIGNED;
        return this.cabRequestRepository.save(request);
    }
};
exports.CabRequestsService = CabRequestsService;
exports.CabRequestsService = CabRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cab_request_entity_1.CabRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(cab_entity_1.Cab)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CabRequestsService);
//# sourceMappingURL=cab-requests.service.js.map