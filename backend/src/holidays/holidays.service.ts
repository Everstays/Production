import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import { CreateHolidayDto, UpdateHolidayDto } from '../dto/holiday.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto, host: User): Promise<Holiday> {
    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      startDate: new Date(createHolidayDto.startDate),
      endDate: new Date(createHolidayDto.endDate),
      hostId: host.id,
    });

    return this.holidayRepository.save(holiday);
  }

  async findAll(filters?: { hostId?: string; isActive?: boolean }): Promise<Holiday[]> {
    const query = this.holidayRepository.createQueryBuilder('holiday')
      .leftJoinAndSelect('holiday.host', 'host');

    if (filters?.hostId) {
      query.where('holiday.hostId = :hostId', { hostId: filters.hostId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('holiday.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.orderBy('holiday.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    return holiday;
  }

  async findByHost(hostId: string): Promise<Holiday[]> {
    return this.holidayRepository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateHolidayDto: UpdateHolidayDto, user: User): Promise<Holiday> {
    const holiday = await this.findOne(id);

    if (holiday.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own holidays');
    }

    if (updateHolidayDto.startDate) {
      updateHolidayDto.startDate = new Date(updateHolidayDto.startDate).toISOString();
    }
    if (updateHolidayDto.endDate) {
      updateHolidayDto.endDate = new Date(updateHolidayDto.endDate).toISOString();
    }

    Object.assign(holiday, updateHolidayDto);
    return this.holidayRepository.save(holiday);
  }

  async remove(id: string, user: User): Promise<void> {
    const holiday = await this.findOne(id);

    if (holiday.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own holidays');
    }

    await this.holidayRepository.remove(holiday);
  }
}
