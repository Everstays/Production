import { MessagesService } from './messages.service';
import { CreateMessageDto } from '../dto/message.dto';
import { User } from '../entities/user.entity';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, user: User): Promise<import("../entities/message.entity").Message>;
    findAll(user: User): Promise<import("../entities/message.entity").Message[]>;
    findConversation(userId: string, propertyId: string, user: User): Promise<import("../entities/message.entity").Message[]>;
    getUnreadCount(user: User): Promise<number>;
    markAsRead(id: string, user: User): Promise<import("../entities/message.entity").Message>;
}
