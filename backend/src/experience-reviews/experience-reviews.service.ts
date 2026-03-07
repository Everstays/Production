import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceReview } from '../entities/experience-review.entity';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceReviewDto } from '../dto/experience-review.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ExperienceReviewsService {
  constructor(
    @InjectRepository(ExperienceReview)
    private experienceReviewRepository: Repository<ExperienceReview>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async create(
    experienceId: string,
    dto: CreateExperienceReviewDto,
    user: User,
  ): Promise<ExperienceReview> {
    const experience = await this.experienceRepository.findOne({
      where: { id: experienceId },
    });
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${experienceId} not found`);
    }

    const existing = await this.experienceReviewRepository.findOne({
      where: { experienceId, userId: user.id },
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this experience');
    }

    const review = this.experienceReviewRepository.create({
      experienceId,
      userId: user.id,
      rating: dto.rating,
      comment: dto.comment || '',
    });
    const saved = await this.experienceReviewRepository.save(review);

    await this.updateExperienceRating(experienceId);
    return this.experienceReviewRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async findByExperience(experienceId: string): Promise<ExperienceReview[]> {
    return this.experienceReviewRepository.find({
      where: { experienceId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateExperienceRating(experienceId: string): Promise<void> {
    const result = await this.experienceReviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.experienceId = :experienceId', { experienceId })
      .getRawOne();

    const avg = parseFloat(result?.avg || '0');
    const count = parseInt(result?.count || '0', 10);

    await this.experienceRepository.update(experienceId, {
      rating: Math.round(avg * 100) / 100,
      reviewCount: count,
    });
  }
}
