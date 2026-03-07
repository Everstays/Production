import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { CreateMessageDto } from '../dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    sender: User,
  ): Promise<Message> {
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

  async findAll(user: User): Promise<Message[]> {
    return this.messageRepository.find({
      where: [{ senderId: user.id }, { receiverId: user.id }],
      relations: ['sender', 'receiver', 'property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findConversation(
    userId: string,
    otherUserId: string,
    propertyId?: string,
  ): Promise<Message[]> {
    const where: any = [
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

  async markAsRead(id: string, user: User): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to mark this message as read',
      );
    }

    message.isRead = true;
    return this.messageRepository.save(message);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
  }
}
