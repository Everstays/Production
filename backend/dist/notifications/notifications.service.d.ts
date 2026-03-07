import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<Notification | null>;
    markAllAsRead(userId: string): Promise<void>;
}
