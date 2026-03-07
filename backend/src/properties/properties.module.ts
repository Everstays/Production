import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from '../entities/property.entity';
import { City } from '../entities/city.entity';
import { Category } from '../entities/category.entity';
import { Offer } from '../entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, City, Category, Offer])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
