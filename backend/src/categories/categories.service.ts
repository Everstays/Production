import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Property } from '../entities/property.entity';
import { Experience } from '../entities/experience.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      link: createCategoryDto.link || `/${createCategoryDto.name.toLowerCase().replace(/\s+/g, '-')}`,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(filters?: { isActive?: boolean; isFeatured?: boolean }): Promise<Category[]> {
    const query = this.categoryRepository.createQueryBuilder('category');

    if (filters?.isActive !== undefined) {
      query.andWhere('category.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isFeatured !== undefined) {
      query.andWhere('category.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
    }

    const categories = await query.orderBy('category.createdAt', 'ASC').getMany();

    // Update counts for each category
    for (const category of categories) {
      const propertyCount = await this.propertyRepository.count({
        where: { isActive: true },
      });
      const experienceCount = await this.experienceRepository.count({
        where: { isActive: true },
      });
      
      // For now, we'll use total counts. In future, you can add category field to properties/experiences
      category.propertyCount = propertyCount;
      category.experienceCount = experienceCount;
    }

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async getFeatured(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isFeatured: true, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }
}
