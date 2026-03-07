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
exports.UpdateContactDto = exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
const contact_entity_1 = require("../entities/contact.entity");
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contact_entity_1.ContactSubject),
    __metadata("design:type", String)
], CreateContactDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "userId", void 0);
class UpdateContactDto {
}
exports.UpdateContactDto = UpdateContactDto;
__decorate([
    (0, class_validator_1.IsEnum)(contact_entity_1.ContactStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "response", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContactDto.prototype, "respondedBy", void 0);
//# sourceMappingURL=contact.dto.js.map