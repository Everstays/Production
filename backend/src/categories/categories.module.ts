import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../entities/category.entity';
import { Property } from '../entities/property.entity';
import { Experience } from '../entities/experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Property, Experience])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
