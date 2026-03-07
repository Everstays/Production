import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripPlanItem } from '../entities/trip-plan-item.entity';
import { TripPlanItemsService } from './trip-plan-items.service';
import { TripPlanItemsController } from './trip-plan-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripPlanItem])],
  controllers: [TripPlanItemsController],
  providers: [TripPlanItemsService],
  exports: [TripPlanItemsService],
})
export class TripPlanItemsModule {}
