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
exports.CabRequest = exports.CabRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const property_entity_1 = require("./property.entity");
const cab_entity_1 = require("./cab.entity");
var CabRequestStatus;
(function (CabRequestStatus) {
    CabRequestStatus["PENDING"] = "pending";
    CabRequestStatus["ASSIGNED"] = "assigned";
})(CabRequestStatus || (exports.CabRequestStatus = CabRequestStatus = {}));
let CabRequest = class CabRequest {
};
exports.CabRequest = CabRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CabRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "dropLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], CabRequest.prototype, "travelDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "travelTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '5 or 7' }),
    __metadata("design:type", String)
], CabRequest.prototype, "seatsPreference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], CabRequest.prototype, "numberOfPeople", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "guestName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "guestPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CabRequest.prototype, "guestEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CabRequest.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CabRequestStatus,
        default: CabRequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], CabRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CabRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CabRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CabRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property),
    (0, typeorm_1.JoinColumn)({ name: 'propertyId' }),
    __metadata("design:type", property_entity_1.Property)
], CabRequest.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], CabRequest.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CabRequest.prototype, "hostId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cab_entity_1.Cab, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedCabId' }),
    __metadata("design:type", cab_entity_1.Cab)
], CabRequest.prototype, "assignedCab", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CabRequest.prototype, "assignedCabId", void 0);
exports.CabRequest = CabRequest = __decorate([
    (0, typeorm_1.Entity)('cab_requests')
], CabRequest);
//# sourceMappingURL=cab-request.entity.js.map