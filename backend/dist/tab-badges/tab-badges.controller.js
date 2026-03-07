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
exports.TabBadgesController = void 0;
const common_1 = require("@nestjs/common");
const tab_badges_service_1 = require("./tab-badges.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../entities/user.entity");
let TabBadgesController = class TabBadgesController {
    constructor(tabBadgesService) {
        this.tabBadgesService = tabBadgesService;
    }
    findAll() {
        return this.tabBadgesService.findAll();
    }
    findAllForAdmin() {
        return this.tabBadgesService.findAllForAdmin();
    }
    upsert(tabId, badgeText) {
        return this.tabBadgesService.upsert(tabId, badgeText);
    }
    remove(tabId) {
        return this.tabBadgesService.remove(tabId);
    }
};
exports.TabBadgesController = TabBadgesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TabBadgesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TabBadgesController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Put)(':tabId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('tabId')),
    __param(1, (0, common_1.Body)('badgeText')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TabBadgesController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(':tabId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('tabId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TabBadgesController.prototype, "remove", null);
exports.TabBadgesController = TabBadgesController = __decorate([
    (0, common_1.Controller)('tab-badges'),
    __metadata("design:paramtypes", [tab_badges_service_1.TabBadgesService])
], TabBadgesController);
//# sourceMappingURL=tab-badges.controller.js.map