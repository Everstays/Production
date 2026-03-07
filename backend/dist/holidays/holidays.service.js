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
exports.HolidaysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const holiday_entity_1 = require("../entities/holiday.entity");
let HolidaysService = class HolidaysService {
    constructor(holidayRepository) {
        this.holidayRepository = holidayRepository;
    }
    async create(createHolidayDto, host) {
        const holiday = this.holidayRepository.create({
            ...createHolidayDto,
            startDate: new Date(createHolidayDto.startDate),
            endDate: new Date(createHolidayDto.endDate),
            hostId: host.id,
        });
        return this.holidayRepository.save(holiday);
    }
    async findAll(filters) {
        const query = this.holidayRepository.createQueryBuilder('holiday')
            .leftJoinAndSelect('holiday.host', 'host');
        if (filters?.hostId) {
            query.where('holiday.hostId = :hostId', { hostId: filters.hostId });
        }
        if (filters?.isActive !== undefined) {
            query.andWhere('holiday.isActive = :isActive', { isActive: filters.isActive });
        }
        return query.orderBy('holiday.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const holiday = await this.holidayRepository.findOne({
            where: { id },
            relations: ['host'],
        });
        if (!holiday) {
            throw new common_1.NotFoundException(`Holiday with ID ${id} not found`);
        }
        return holiday;
    }
    async findByHost(hostId) {
        return this.holidayRepository.find({
            where: { hostId },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateHolidayDto, user) {
        const holiday = await this.findOne(id);
        if (holiday.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only update your own holidays');
        }
        if (updateHolidayDto.startDate) {
            updateHolidayDto.startDate = new Date(updateHolidayDto.startDate).toISOString();
        }
        if (updateHolidayDto.endDate) {
            updateHolidayDto.endDate = new Date(updateHolidayDto.endDate).toISOString();
        }
        Object.assign(holiday, updateHolidayDto);
        return this.holidayRepository.save(holiday);
    }
    async remove(id, user) {
        const holiday = await this.findOne(id);
        if (holiday.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You can only delete your own holidays');
        }
        await this.holidayRepository.remove(holiday);
    }
};
exports.HolidaysService = HolidaysService;
exports.HolidaysService = HolidaysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HolidaysService);
//# sourceMappingURL=holidays.service.js.map