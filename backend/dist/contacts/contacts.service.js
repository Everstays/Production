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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("../entities/contact.entity");
let ContactsService = class ContactsService {
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async create(createContactDto) {
        const contact = this.contactRepository.create({
            ...createContactDto,
            userId: createContactDto.userId || null,
        });
        return this.contactRepository.save(contact);
    }
    async findAll(filters) {
        const query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.user', 'user');
        if (filters?.status) {
            query.andWhere('contact.status = :status', { status: filters.status });
        }
        if (filters?.subject) {
            query.andWhere('contact.subject = :subject', { subject: filters.subject });
        }
        if (filters?.userId) {
            query.andWhere('contact.userId = :userId', { userId: filters.userId });
        }
        return query.orderBy('contact.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const contact = await this.contactRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        return contact;
    }
    async update(id, updateContactDto, adminUser) {
        const contact = await this.findOne(id);
        Object.assign(contact, {
            ...updateContactDto,
            respondedBy: adminUser.id,
        });
        return this.contactRepository.save(contact);
    }
    async remove(id) {
        const contact = await this.findOne(id);
        await this.contactRepository.remove(contact);
    }
    async getStats() {
        const total = await this.contactRepository.count();
        const pending = await this.contactRepository.count({ where: { status: contact_entity_1.ContactStatus.PENDING } });
        const inProgress = await this.contactRepository.count({ where: { status: contact_entity_1.ContactStatus.IN_PROGRESS } });
        const resolved = await this.contactRepository.count({ where: { status: contact_entity_1.ContactStatus.RESOLVED } });
        return {
            total,
            pending,
            inProgress,
            resolved,
        };
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map