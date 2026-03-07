import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { GuideReviewsController } from './guide-reviews.controller';
import { GuideReviewsService } from './guide-reviews.service';
import { GuideBookingsController } from './guide-bookings.controller';
import { GuideBookingsHostController } from './guide-bookings-host.controller';
import { GuideBookingsService } from './guide-bookings.service';
import { Guide } from '../entities/guide.entity';
import { GuideReview } from '../entities/guide-review.entity';
import { GuideBooking } from '../entities/guide-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guide, GuideReview, GuideBooking]),
  ],
  controllers: [
    GuidesController,
    GuideReviewsController,
    GuideBookingsController,
    GuideBookingsHostController,
  ],
  providers: [GuidesService, GuideReviewsService, GuideBookingsService],
  exports: [GuidesService, GuideReviewsService, GuideBookingsService],
})
export class GuidesModule {}
