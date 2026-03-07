import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { CreateMessageDto } from '../dto/message.dto';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(createMessageDto: CreateMessageDto, sender: User): Promise<Message>;
    findAll(user: User): Promise<Message[]>;
    findConversation(userId: string, otherUserId: string, propertyId?: string): Promise<Message[]>;
    markAsRead(id: string, user: User): Promise<Message>;
    getUnreadCount(userId: string): Promise<number>;
}
