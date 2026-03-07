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
exports.CabRequestsController = void 0;
const common_1 = require("@nestjs/common");
const cab_requests_service_1 = require("./cab-requests.service");
const cab_request_dto_1 = require("../dto/cab-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/optional-jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let CabRequestsController = class CabRequestsController {
    constructor(cabRequestsService) {
        this.cabRequestsService = cabRequestsService;
    }
    create(createCabRequestDto, user) {
        return this.cabRequestsService.create(createCabRequestDto, user ? user.id : null);
    }
    findForHost(user) {
        return this.cabRequestsService.findByHost(user.id);
    }
    assign(id, body, user) {
        return this.cabRequestsService.assign(id, body.cabId, user);
    }
};
exports.CabRequestsController = CabRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cab_request_dto_1.CreateCabRequestDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('for-host'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabRequestsController.prototype, "findForHost", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cab_request_dto_1.AssignCabRequestDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CabRequestsController.prototype, "assign", null);
exports.CabRequestsController = CabRequestsController = __decorate([
    (0, common_1.Controller)('cab-requests'),
    __metadata("design:paramtypes", [cab_requests_service_1.CabRequestsService])
], CabRequestsController);
//# sourceMappingURL=cab-requests.controller.js.map