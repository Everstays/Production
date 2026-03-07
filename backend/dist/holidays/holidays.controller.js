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
exports.HolidaysController = void 0;
const common_1 = require("@nestjs/common");
const holidays_service_1 = require("./holidays.service");
const holiday_dto_1 = require("../dto/holiday.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let HolidaysController = class HolidaysController {
    constructor(holidaysService) {
        this.holidaysService = holidaysService;
    }
    create(createHolidayDto, user) {
        return this.holidaysService.create(createHolidayDto, user);
    }
    findAll(hostId, isActive) {
        const filters = {};
        if (hostId)
            filters.hostId = hostId;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        return this.holidaysService.findAll(filters);
    }
    findMyHolidays(user) {
        return this.holidaysService.findByHost(user.id);
    }
    findOne(id) {
        return this.holidaysService.findOne(id);
    }
    update(id, updateHolidayDto, user) {
        return this.holidaysService.update(id, updateHolidayDto, user);
    }
    remove(id, user) {
        return this.holidaysService.remove(id, user);
    }
};
exports.HolidaysController = HolidaysController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [holiday_dto_1.CreateHolidayDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hostId')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-holidays'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "findMyHolidays", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, holiday_dto_1.UpdateHolidayDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], HolidaysController.prototype, "remove", null);
exports.HolidaysController = HolidaysController = __decorate([
    (0, common_1.Controller)('holidays'),
    __metadata("design:paramtypes", [holidays_service_1.HolidaysService])
], HolidaysController);
//# sourceMappingURL=holidays.controller.js.map