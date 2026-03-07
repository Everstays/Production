import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/experience.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto, user: User): Promise<Experience> {
    // Only hosts and admins can create experiences
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can create experiences');
    }

    const experience = this.experienceRepository.create({
      ...createExperienceDto,
      hostId: user.id,
      images: createExperienceDto.images || [],
    });

    return this.experienceRepository.save(experience);
  }

  async findAll(filters?: {
    city?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
  }): Promise<Experience[]> {
    const query = this.experienceRepository.createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .where('experience.isActive = :isActive', { isActive: filters?.isActive ?? true });

    if (filters?.city) {
      query.andWhere('experience.city = :city', { city: filters.city });
    }

    if (filters?.category) {
      query.andWhere('experience.category = :category', { category: filters.category });
    }

    if (filters?.minPrice !== undefined) {
      query.andWhere('experience.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters?.maxPrice !== undefined) {
      query.andWhere('experience.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return query.orderBy('experience.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return experience;
  }

  async findByHost(hostId: string): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { hostId },
      relations: ['host'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    user: User,
  ): Promise<Experience> {
    const experience = await this.findOne(id);

    // Only the host who created it or admin can update
    if (experience.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own experiences');
    }

    Object.assign(experience, updateExperienceDto);
    return this.experienceRepository.save(experience);
  }

  async remove(id: string, user: User): Promise<void> {
    const experience = await this.findOne(id);

    // Only the host who created it or admin can delete
    if (experience.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own experiences');
    }

    await this.experienceRepository.remove(experience);
  }

  async getFeatured(): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['host'],
      order: { createdAt: 'DESC' },
      take: 12,
    });
  }
}
