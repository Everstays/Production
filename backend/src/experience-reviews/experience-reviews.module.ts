import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceReview } from '../entities/experience-review.entity';
import { Experience } from '../entities/experience.entity';
import { ExperienceReviewsController } from './experience-reviews.controller';
import { ExperienceReviewsService } from './experience-reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperienceReview, Experience]),
  ],
  controllers: [ExperienceReviewsController],
  providers: [ExperienceReviewsService],
})
export class ExperienceReviewsModule {}
