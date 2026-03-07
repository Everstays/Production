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
exports.OffersController = void 0;
const common_1 = require("@nestjs/common");
const offers_service_1 = require("./offers.service");
const offer_dto_1 = require("../dto/offer.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../entities/user.entity");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_2 = require("../entities/user.entity");
let OffersController = class OffersController {
    constructor(offersService) {
        this.offersService = offersService;
    }
    create(createOfferDto, user) {
        return this.offersService.create(createOfferDto, user);
    }
    findAll() {
        return this.offersService.findAll();
    }
    findMyOffers(user) {
        return this.offersService.findByHost(user.id);
    }
    findByCode(code) {
        return this.offersService.findByCode(code);
    }
    findOne(id) {
        return this.offersService.findOne(id);
    }
    update(id, updateOfferDto, user) {
        return this.offersService.update(id, updateOfferDto, user);
    }
    remove(id, user) {
        return this.offersService.remove(id, user);
    }
};
exports.OffersController = OffersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [offer_dto_1.CreateOfferDto, user_entity_2.User]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-offers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findMyOffers", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, offer_dto_1.UpdateOfferDto,
        user_entity_2.User]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "remove", null);
exports.OffersController = OffersController = __decorate([
    (0, common_1.Controller)('offers'),
    __metadata("design:paramtypes", [offers_service_1.OffersService])
], OffersController);
//# sourceMappingURL=offers.controller.js.map