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
exports.Offer = exports.DiscountType = exports.OfferType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var OfferType;
(function (OfferType) {
    OfferType["BANK"] = "bank";
    OfferType["SEASONAL"] = "seasonal";
    OfferType["FIRST_TIME"] = "first-time";
    OfferType["LONG_STAY"] = "long-stay";
    OfferType["HOST"] = "host";
})(OfferType || (exports.OfferType = OfferType = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["FIXED"] = "fixed";
    DiscountType["PERCENTAGE"] = "percentage";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
let Offer = class Offer {
};
exports.Offer = Offer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Offer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Offer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Offer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Offer.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DiscountType,
        default: DiscountType.FIXED,
    }),
    __metadata("design:type", String)
], Offer.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Offer.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Offer.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OfferType,
    }),
    __metadata("design:type", String)
], Offer.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Offer.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Offer.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Offer.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Offer.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Offer.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Offer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Offer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Offer.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Offer.prototype, "hostId", void 0);
exports.Offer = Offer = __decorate([
    (0, typeorm_1.Entity)('offers')
], Offer);
//# sourceMappingURL=offer.entity.js.map