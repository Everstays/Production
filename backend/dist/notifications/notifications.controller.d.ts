import { NotificationsService } from './notifications.service';
import { User } from '../entities/user.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(user: User, unreadOnly?: string): Promise<import("../entities/notification.entity").Notification[]>;
    markAllAsRead(user: User): Promise<void>;
    markAsRead(id: string, user: User): Promise<import("../entities/notification.entity").Notification>;
}
