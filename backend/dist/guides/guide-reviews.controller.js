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
exports.GuideReviewsController = void 0;
const common_1 = require("@nestjs/common");
const guide_reviews_service_1 = require("./guide-reviews.service");
const guide_review_dto_1 = require("../dto/guide-review.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
let GuideReviewsController = class GuideReviewsController {
    constructor(guideReviewsService) {
        this.guideReviewsService = guideReviewsService;
    }
    findAll(guideId) {
        return this.guideReviewsService.findByGuide(guideId);
    }
    create(guideId, createGuideReviewDto, user) {
        return this.guideReviewsService.create(guideId, createGuideReviewDto, user);
    }
};
exports.GuideReviewsController = GuideReviewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('guideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuideReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('guideId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guide_review_dto_1.CreateGuideReviewDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], GuideReviewsController.prototype, "create", null);
exports.GuideReviewsController = GuideReviewsController = __decorate([
    (0, common_1.Controller)('guides/:guideId/reviews'),
    __metadata("design:paramtypes", [guide_reviews_service_1.GuideReviewsService])
], GuideReviewsController);
//# sourceMappingURL=guide-reviews.controller.js.map