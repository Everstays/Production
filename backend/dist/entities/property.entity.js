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
exports.Property = exports.AvailabilityStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const booking_entity_1 = require("./booking.entity");
const review_entity_1 = require("./review.entity");
const category_entity_1 = require("./category.entity");
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE"] = "available";
    AvailabilityStatus["LIMITED"] = "limited";
    AvailabilityStatus["BOOKED"] = "booked";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
let Property = class Property {
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true }),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Property.prototype, "hostRating", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Property.prototype, "pricePerNight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AvailabilityStatus,
        default: AvailabilityStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Property.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Property.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Property.prototype, "houseRules", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Property.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "bedrooms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "bathrooms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Property.prototype, "maxGuests", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.properties),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Property.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "hostId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", category_entity_1.Category)
], Property.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.property),
    __metadata("design:type", Array)
], Property.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.property),
    __metadata("design:type", Array)
], Property.prototype, "reviews", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)('properties')
], Property);
//# sourceMappingURL=property.entity.js.map