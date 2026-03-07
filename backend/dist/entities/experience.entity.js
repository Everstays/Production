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
exports.Experience = exports.ExperienceCategory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ExperienceCategory;
(function (ExperienceCategory) {
    ExperienceCategory["CULTURE"] = "Culture";
    ExperienceCategory["FOOD"] = "Food";
    ExperienceCategory["ADVENTURE"] = "Adventure";
    ExperienceCategory["WELLNESS"] = "Wellness";
    ExperienceCategory["NATURE"] = "Nature";
    ExperienceCategory["PHOTOGRAPHY"] = "Photography";
    ExperienceCategory["ART"] = "Art";
    ExperienceCategory["MUSIC"] = "Music";
    ExperienceCategory["OTHER"] = "Other";
})(ExperienceCategory || (exports.ExperienceCategory = ExperienceCategory = {}));
let Experience = class Experience {
};
exports.Experience = Experience;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Experience.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Experience.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Experience.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Experience.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Experience.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Experience.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Experience.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExperienceCategory,
        default: ExperienceCategory.OTHER,
    }),
    __metadata("design:type", String)
], Experience.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Experience.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Experience.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Experience.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Experience.prototype, "maxParticipants", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Experience.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Experience.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Experience.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Experience.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Experience.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Experience.prototype, "hostId", void 0);
exports.Experience = Experience = __decorate([
    (0, typeorm_1.Entity)('experiences')
], Experience);
//# sourceMappingURL=experience.entity.js.map