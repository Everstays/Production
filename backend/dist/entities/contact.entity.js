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
exports.Contact = exports.ContactStatus = exports.ContactSubject = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ContactSubject;
(function (ContactSubject) {
    ContactSubject["BOOKING_ISSUE"] = "Booking Issue";
    ContactSubject["CANCELLATION_HELP"] = "Cancellation Help";
    ContactSubject["PAYMENT_ISSUE"] = "Payment Issue";
    ContactSubject["OTHER"] = "Other";
})(ContactSubject || (exports.ContactSubject = ContactSubject = {}));
var ContactStatus;
(function (ContactStatus) {
    ContactStatus["PENDING"] = "pending";
    ContactStatus["IN_PROGRESS"] = "in_progress";
    ContactStatus["RESOLVED"] = "resolved";
    ContactStatus["CLOSED"] = "closed";
})(ContactStatus || (exports.ContactStatus = ContactStatus = {}));
let Contact = class Contact {
};
exports.Contact = Contact;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Contact.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContactSubject,
        default: ContactSubject.OTHER,
    }),
    __metadata("design:type", String)
], Contact.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Contact.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContactStatus,
        default: ContactStatus.PENDING,
    }),
    __metadata("design:type", String)
], Contact.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "respondedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Contact.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "userId", void 0);
exports.Contact = Contact = __decorate([
    (0, typeorm_1.Entity)('contacts')
], Contact);
//# sourceMappingURL=contact.entity.js.map