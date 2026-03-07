import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideReview } from '../entities/guide-review.entity';
import { Guide } from '../entities/guide.entity';
import { CreateGuideReviewDto } from '../dto/guide-review.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class GuideReviewsService {
  constructor(
    @InjectRepository(GuideReview)
    private guideReviewRepository: Repository<GuideReview>,
    @InjectRepository(Guide)
    private guideRepository: Repository<Guide>,
  ) {}

  async create(
    guideId: string,
    createGuideReviewDto: CreateGuideReviewDto,
    user: User,
  ): Promise<GuideReview> {
    const guide = await this.guideRepository.findOne({ where: { id: guideId } });
    if (!guide) {
      throw new NotFoundException(`Guide with ID ${guideId} not found`);
    }

    const existing = await this.guideReviewRepository.findOne({
      where: { guideId, userId: user.id },
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this guide');
    }

    const review = this.guideReviewRepository.create({
      guideId,
      userId: user.id,
      ...createGuideReviewDto,
    });
    const saved = await this.guideReviewRepository.save(review);

    await this.updateGuideRating(guideId);
    return this.guideReviewRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async findByGuide(guideId: string): Promise<GuideReview[]> {
    return this.guideReviewRepository.find({
      where: { guideId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateGuideRating(guideId: string): Promise<void> {
    const result = await this.guideReviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.guideId = :guideId', { guideId })
      .getRawOne();

    const avg = parseFloat(result?.avg || '0');
    const count = parseInt(result?.count || '0', 10);

    await this.guideRepository.update(guideId, {
      rating: Math.round(avg * 100) / 100,
      reviewCount: count,
    });
  }
}
