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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../entities/message.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async create(createMessageDto, sender) {
        const { receiverId, content, propertyId } = createMessageDto;
        const message = this.messageRepository.create({
            senderId: sender.id,
            receiverId,
            content,
            propertyId,
            sender,
        });
        return this.messageRepository.save(message);
    }
    async findAll(user) {
        return this.messageRepository.find({
            where: [{ senderId: user.id }, { receiverId: user.id }],
            relations: ['sender', 'receiver', 'property'],
            order: { createdAt: 'DESC' },
        });
    }
    async findConversation(userId, otherUserId, propertyId) {
        const where = [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
        ];
        if (propertyId) {
            where.forEach((w) => (w.propertyId = propertyId));
        }
        return this.messageRepository.find({
            where,
            relations: ['sender', 'receiver', 'property'],
            order: { createdAt: 'ASC' },
        });
    }
    async markAsRead(id, user) {
        const message = await this.messageRepository.findOne({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.receiverId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to mark this message as read');
        }
        message.isRead = true;
        return this.messageRepository.save(message);
    }
    async getUnreadCount(userId) {
        return this.messageRepository.count({
            where: { receiverId: userId, isRead: false },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map