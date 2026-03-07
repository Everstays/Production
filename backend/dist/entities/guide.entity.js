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
exports.Guide = exports.GuideLanguage = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var GuideLanguage;
(function (GuideLanguage) {
    GuideLanguage["ENGLISH"] = "English";
    GuideLanguage["HINDI"] = "Hindi";
    GuideLanguage["MALAYALAM"] = "Malayalam";
    GuideLanguage["TAMIL"] = "Tamil";
    GuideLanguage["TELUGU"] = "Telugu";
    GuideLanguage["KANNADA"] = "Kannada";
    GuideLanguage["OTHER"] = "Other";
})(GuideLanguage || (exports.GuideLanguage = GuideLanguage = {}));
let Guide = class Guide {
};
exports.Guide = Guide;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Guide.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Guide.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Guide.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Guide.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Guide.prototype, "pricePerDay", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Guide.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Guide.prototype, "languages", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Guide.prototype, "specialties", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Guide.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Guide.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Guide.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Guide.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Guide.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Guide.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Guide.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Guide.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Guide.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Guide.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Guide.prototype, "hostId", void 0);
exports.Guide = Guide = __decorate([
    (0, typeorm_1.Entity)('guides')
], Guide);
//# sourceMappingURL=guide.entity.js.map