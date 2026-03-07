import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from '../entities/city.entity';
import { Property } from '../entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Property])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
