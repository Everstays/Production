import { User } from './user.entity';
import { Property } from './property.entity';
export declare class Message {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: User;
    senderId: string;
    receiver: User;
    receiverId: string;
    property: Property;
    propertyId: string;
}
