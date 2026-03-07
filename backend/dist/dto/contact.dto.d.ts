import { ContactSubject, ContactStatus } from '../entities/contact.entity';
export declare class CreateContactDto {
    name: string;
    email: string;
    subject: ContactSubject;
    message: string;
    userId?: string;
}
export declare class UpdateContactDto {
    status?: ContactStatus;
    response?: string;
    respondedBy?: string;
}
