import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from '../entities/contact.entity';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      userId: createContactDto.userId || null,
    });

    return this.contactRepository.save(contact);
  }

  async findAll(filters?: {
    status?: string;
    subject?: string;
    userId?: string;
  }): Promise<Contact[]> {
    const query = this.contactRepository.createQueryBuilder('contact')
      .leftJoinAndSelect('contact.user', 'user');

    if (filters?.status) {
      query.andWhere('contact.status = :status', { status: filters.status });
    }

    if (filters?.subject) {
      query.andWhere('contact.subject = :subject', { subject: filters.subject });
    }

    if (filters?.userId) {
      query.andWhere('contact.userId = :userId', { userId: filters.userId });
    }

    return query.orderBy('contact.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    adminUser: User,
  ): Promise<Contact> {
    const contact = await this.findOne(id);

    Object.assign(contact, {
      ...updateContactDto,
      respondedBy: adminUser.id,
    });

    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
  }

  async getStats() {
    const total = await this.contactRepository.count();
    const pending = await this.contactRepository.count({ where: { status: ContactStatus.PENDING } });
    const inProgress = await this.contactRepository.count({ where: { status: ContactStatus.IN_PROGRESS } });
    const resolved = await this.contactRepository.count({ where: { status: ContactStatus.RESOLVED } });

    return {
      total,
      pending,
      inProgress,
      resolved,
    };
  }
}
