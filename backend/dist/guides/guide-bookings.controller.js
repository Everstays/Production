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
exports.GuideBookingsController = void 0;
const common_1 = require("@nestjs/common");
const guide_bookings_service_1 = require("./guide-bookings.service");
const guide_booking_dto_1 = require("../dto/guide-booking.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let GuideBookingsController = class GuideBookingsController {
    constructor(guideBookingsService) {
        this.guideBookingsService = guideBookingsService;
    }
    create(guideId, createGuideBookingDto, user) {
        return this.guideBookingsService.create(guideId, createGuideBookingDto, user);
    }
    findBookings(guideId, user) {
        return this.guideBookingsService.findBookings(guideId, user);
    }
};
exports.GuideBookingsController = GuideBookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('guideId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guide_booking_dto_1.CreateGuideBookingDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuideBookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('guideId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuideBookingsController.prototype, "findBookings", null);
exports.GuideBookingsController = GuideBookingsController = __decorate([
    (0, common_1.Controller)('guides/:guideId/bookings'),
    __metadata("design:paramtypes", [guide_bookings_service_1.GuideBookingsService])
], GuideBookingsController);
//# sourceMappingURL=guide-bookings.controller.js.map