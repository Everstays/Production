import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from '../entities/guide.entity';
import { CreateGuideDto, UpdateGuideDto } from '../dto/guide.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class GuidesService {
  constructor(
    @InjectRepository(Guide)
    private guideRepository: Repository<Guide>,
  ) {}

  async create(createGuideDto: CreateGuideDto, host: User): Promise<Guide> {
    const guide = this.guideRepository.create({
      ...createGuideDto,
      hostId: host.id,
    });

    return this.guideRepository.save(guide);
  }

  async findAll(filters?: { hostId?: string; isActive?: boolean; isAvailable?: boolean; location?: string }): Promise<Guide[]> {
    const query = this.guideRepository.createQueryBuilder('guide')
      .leftJoinAndSelect('guide.host', 'host');

    if (filters?.hostId) {
      query.where('guide.hostId = :hostId', { hostId: filters.hostId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('guide.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isAvailable !== undefined) {
      query.andWhere('guide.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
    }

    if (filters?.location) {
      query.andWhere('guide.location ILIKE :location', { location: `%${filters.location}%` });
    }

    return query.orderBy('guide.isFeatured', 'DESC').addOrderBy('guide.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Guide> {
    const guide = await this.guideRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!guide) {
      throw new NotFoundException(`Guide with ID ${id} not found`);
    }

    return guide;
  }

  async findByHost(hostId: string): Promise<Guide[]> {
    return this.guideRepository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateGuideDto: UpdateGuideDto, user: User): Promise<Guide> {
    const guide = await this.findOne(id);

    if (guide.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own guides');
    }

    Object.assign(guide, updateGuideDto);
    return this.guideRepository.save(guide);
  }

  async remove(id: string, user: User): Promise<void> {
    const guide = await this.findOne(id);

    if (guide.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own guides');
    }

    await this.guideRepository.remove(guide);
  }
}
