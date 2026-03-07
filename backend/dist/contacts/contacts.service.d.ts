import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { User } from '../entities/user.entity';
export declare class ContactsService {
    private contactRepository;
    constructor(contactRepository: Repository<Contact>);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    findAll(filters?: {
        status?: string;
        subject?: string;
        userId?: string;
    }): Promise<Contact[]>;
    findOne(id: string): Promise<Contact>;
    update(id: string, updateContactDto: UpdateContactDto, adminUser: User): Promise<Contact>;
    remove(id: string): Promise<void>;
    getStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
    }>;
}
