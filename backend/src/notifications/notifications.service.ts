import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findByUserId(userId: string, unreadOnly = false): Promise<Notification[]> {
    const qb = this.notificationRepository
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .orderBy('n.createdAt', 'DESC')
      .take(50);
    if (unreadOnly) {
      qb.andWhere('n.read = :read', { read: false });
    }
    return qb.getMany();
  }

  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });
    if (!notification) return null;
    notification.read = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId }, { read: true });
  }
}
