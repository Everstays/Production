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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideReview = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const guide_entity_1 = require("./guide.entity");
let GuideReview = class GuideReview {
};
exports.GuideReview = GuideReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GuideReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GuideReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], GuideReview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GuideReview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], GuideReview.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GuideReview.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guide_entity_1.Guide),
    (0, typeorm_1.JoinColumn)({ name: 'guideId' }),
    __metadata("design:type", guide_entity_1.Guide)
], GuideReview.prototype, "guide", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GuideReview.prototype, "guideId", void 0);
exports.GuideReview = GuideReview = __decorate([
    (0, typeorm_1.Entity)('guide_reviews')
], GuideReview);
//# sourceMappingURL=guide-review.entity.js.map