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
exports.GuidesController = void 0;
const common_1 = require("@nestjs/common");
const guides_service_1 = require("./guides.service");
const guide_dto_1 = require("../dto/guide.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let GuidesController = class GuidesController {
    constructor(guidesService) {
        this.guidesService = guidesService;
    }
    create(createGuideDto, user) {
        return this.guidesService.create(createGuideDto, user);
    }
    findAll(hostId, isActive, isAvailable, location) {
        const filters = {};
        if (hostId)
            filters.hostId = hostId;
        if (isActive !== undefined && isActive !== '')
            filters.isActive = isActive === 'true';
        if (isAvailable !== undefined && isAvailable !== '')
            filters.isAvailable = isAvailable === 'true';
        if (location)
            filters.location = location;
        if (!hostId && isActive === undefined && filters.isActive === undefined) {
            filters.isActive = true;
        }
        if (!hostId && (isAvailable === undefined || isAvailable === '') && filters.isAvailable === undefined) {
            filters.isAvailable = true;
        }
        return this.guidesService.findAll(filters);
    }
    findMyGuides(user) {
        return this.guidesService.findByHost(user.id);
    }
    findOne(id) {
        return this.guidesService.findOne(id);
    }
    update(id, updateGuideDto, user) {
        return this.guidesService.update(id, updateGuideDto, user);
    }
    remove(id, user) {
        return this.guidesService.remove(id, user);
    }
};
exports.GuidesController = GuidesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [guide_dto_1.CreateGuideDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hostId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('isAvailable')),
    __param(3, (0, common_1.Query)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-guides'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "findMyGuides", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guide_dto_1.UpdateGuideDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "remove", null);
exports.GuidesController = GuidesController = __decorate([
    (0, common_1.Controller)('guides'),
    __metadata("design:paramtypes", [guides_service_1.GuidesService])
], GuidesController);
//# sourceMappingURL=guides.controller.js.map