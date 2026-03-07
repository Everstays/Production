import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripPlanItem } from '../entities/trip-plan-item.entity';
import { CreateTripPlanItemDto } from '../dto/trip-plan-item.dto';
import { UpdateTripPlanItemDto } from '../dto/trip-plan-item.dto';

@Injectable()
export class TripPlanItemsService {
  constructor(
    @InjectRepository(TripPlanItem)
    private tripPlanItemRepository: Repository<TripPlanItem>,
  ) {}

  async findAll(all?: boolean): Promise<TripPlanItem[]> {
    const where = all ? {} : { isActive: true };
    return this.tripPlanItemRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TripPlanItem> {
    const item = await this.tripPlanItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Trip plan item not found');
    return item;
  }

  async create(dto: CreateTripPlanItemDto): Promise<TripPlanItem> {
    const item = this.tripPlanItemRepository.create({
      name: dto.name,
      description: dto.description,
      iconName: dto.iconName ?? 'map',
      link: dto.link ?? '/',
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.tripPlanItemRepository.save(item);
  }

  async update(id: string, dto: UpdateTripPlanItemDto): Promise<TripPlanItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.tripPlanItemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.tripPlanItemRepository.remove(item);
  }
}
