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
exports.Cab = exports.CabSeats = exports.CabType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var CabType;
(function (CabType) {
    CabType["SEDAN"] = "Sedan";
    CabType["SUV"] = "SUV";
    CabType["HATCHBACK"] = "Hatchback";
    CabType["VAN"] = "Van";
    CabType["LUXURY"] = "Luxury";
})(CabType || (exports.CabType = CabType = {}));
var CabSeats;
(function (CabSeats) {
    CabSeats[CabSeats["FOUR"] = 4] = "FOUR";
    CabSeats[CabSeats["FIVE"] = 5] = "FIVE";
    CabSeats[CabSeats["SEVEN"] = 7] = "SEVEN";
    CabSeats[CabSeats["EIGHT"] = 8] = "EIGHT";
})(CabSeats || (exports.CabSeats = CabSeats = {}));
let Cab = class Cab {
};
exports.Cab = Cab;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cab.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cab.prototype, "vehicleName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cab.prototype, "vehicleNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CabType }),
    __metadata("design:type", String)
], Cab.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CabSeats }),
    __metadata("design:type", Number)
], Cab.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Cab.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Cab.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cab.prototype, "pricePerKm", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cab.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Cab.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Cab.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cab.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cab.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Cab.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cab.prototype, "driverName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cab.prototype, "driverPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cab.prototype, "driverLicense", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cab.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cab.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Cab.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cab.prototype, "hostId", void 0);
exports.Cab = Cab = __decorate([
    (0, typeorm_1.Entity)('cabs')
], Cab);
//# sourceMappingURL=cab.entity.js.map