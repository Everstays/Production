import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../entities/review.entity';
import { Property } from '../entities/property.entity';
import { Booking } from '../entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Property, Booking])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
