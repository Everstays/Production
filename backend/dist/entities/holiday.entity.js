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
exports.Holiday = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Holiday = class Holiday {
};
exports.Holiday = Holiday;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Holiday.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Holiday.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Holiday.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Holiday.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Holiday.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Holiday.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Holiday.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Holiday.prototype, "inclusions", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Holiday.prototype, "exclusions", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], Holiday.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], Holiday.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Holiday.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Holiday.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Holiday.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Holiday.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Holiday.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Holiday.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Holiday.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Holiday.prototype, "hostId", void 0);
exports.Holiday = Holiday = __decorate([
    (0, typeorm_1.Entity)('holidays')
], Holiday);
//# sourceMappingURL=holiday.entity.js.map