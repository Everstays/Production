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
exports.CabsController = void 0;
const common_1 = require("@nestjs/common");
const cabs_service_1 = require("./cabs.service");
const cab_dto_1 = require("../dto/cab.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let CabsController = class CabsController {
    constructor(cabsService) {
        this.cabsService = cabsService;
    }
    create(createCabDto, user) {
        return this.cabsService.create(createCabDto, user);
    }
    findAll(hostId, isActive, vehicleType, seats) {
        const filters = {};
        if (hostId)
            filters.hostId = hostId;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        if (vehicleType)
            filters.vehicleType = vehicleType;
        if (seats)
            filters.seats = parseInt(seats, 10);
        return this.cabsService.findAll(filters);
    }
    findMyCabs(user) {
        return this.cabsService.findByHost(user.id);
    }
    findOne(id) {
        return this.cabsService.findOne(id);
    }
    update(id, updateCabDto, user) {
        return this.cabsService.update(id, updateCabDto, user);
    }
    remove(id, user) {
        return this.cabsService.remove(id, user);
    }
};
exports.CabsController = CabsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cab_dto_1.CreateCabDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hostId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('vehicleType')),
    __param(3, (0, common_1.Query)('seats')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-cabs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "findMyCabs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cab_dto_1.UpdateCabDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabsController.prototype, "remove", null);
exports.CabsController = CabsController = __decorate([
    (0, common_1.Controller)('cabs'),
    __metadata("design:paramtypes", [cabs_service_1.CabsService])
], CabsController);
//# sourceMappingURL=cabs.controller.js.map