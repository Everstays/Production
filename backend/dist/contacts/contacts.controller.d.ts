import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { User } from '../entities/user.entity';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    create(createContactDto: CreateContactDto, user?: User | null): Promise<import("../entities/contact.entity").Contact>;
    findAll(status?: string, subject?: string, userId?: string): Promise<import("../entities/contact.entity").Contact[]>;
    findMyContacts(user: User): Promise<import("../entities/contact.entity").Contact[]>;
    getStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
    }>;
    findOne(id: string): Promise<import("../entities/contact.entity").Contact>;
    update(id: string, updateContactDto: UpdateContactDto, user: User): Promise<import("../entities/contact.entity").Contact>;
    remove(id: string): Promise<void>;
}
