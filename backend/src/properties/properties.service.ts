import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { City } from '../entities/city.entity';
import { Category } from '../entities/category.entity';
import { Offer } from '../entities/offer.entity';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyQueryDto,
} from '../dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    host: User,
  ): Promise<Property> {
    // Validate category if provided
    let category: Category | null = null;
    if (createPropertyDto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: createPropertyDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${createPropertyDto.categoryId} not found`);
      }
    }

    const property = this.propertyRepository.create({
      ...createPropertyDto,
      host,
      hostId: host.id,
      category,
      categoryId: createPropertyDto.categoryId || null,
    });

    const savedProperty = await this.propertyRepository.save(property);

    // Auto-create city if it doesn't exist
    await this.ensureCityExists(createPropertyDto.city);

    // Update category property count if category was assigned
    if (category) {
      await this.updateCategoryPropertyCount(category.id);
    }

    return savedProperty;
  }

  private async ensureCityExists(cityName: string): Promise<void> {
    const existingCity = await this.cityRepository.findOne({
      where: { name: cityName },
    });

    if (!existingCity) {
      const cityIcons: Record<string, string> = {
        'Kochi': '🏙️',
        'Thiruvananthapuram': '🏛️',
        'Kozhikode': '🌳',
        'Alappuzha': '🏖️',
        'Thrissur': '🏰',
        'Kollam': '🌴',
        'Kannur': '⛰️',
        'Kottayam': '🏘️',
        'Palakkad': '🌾',
        'Malappuram': '🕌',
        'Ernakulam': '🏢',
        'Idukki': '🌲',
        'Wayanad': '🌿',
        'Pathanamthitta': '🕉️',
        'Kasaragod': '🏝️',
        'Munnar': '⛰️',
      };

      const city = this.cityRepository.create({
        name: cityName,
        icon: cityIcons[cityName] || '🏘️',
        propertyCount: 0,
      });

      await this.cityRepository.save(city);
    }
  }

  async findAll(query: PropertyQueryDto): Promise<{
    properties: Property[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      categoryId,
      city,
      location,
      minPrice,
      maxPrice,
      guests,
      checkIn,
      checkOut,
      minRating,
      amenities,
      page = 1,
      limit = 100, // Increased default limit to show more results
    } = query;

    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.host', 'host')
      .leftJoinAndSelect('property.reviews', 'reviews')
      .where('property.isActive = :isActive', { isActive: true });

    if (categoryId) {
      queryBuilder.andWhere('property.categoryId = :categoryId', { categoryId });
    }

    if (city) {
      // Use ILIKE for case-insensitive partial matching
      queryBuilder.andWhere('property.city ILIKE :city', { city: `%${city}%` });
    }

    if (location) {
      queryBuilder.andWhere('property.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('property.pricePerNight >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('property.pricePerNight <= :maxPrice', {
        maxPrice,
      });
    }

    if (guests) {
      queryBuilder.andWhere('property.maxGuests >= :guests', { guests });
    }

    if (minRating !== undefined) {
      queryBuilder.andHaving('AVG(reviews.rating) >= :minRating', {
        minRating,
      });
    }

    if (amenities) {
      const amenityArray = amenities.split(',');
      queryBuilder.andWhere('property.amenities && :amenities', {
        amenities: amenityArray,
      });
    }

    // Show all active properties in search; booking flow validates availability
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [properties, total] = await queryBuilder.getManyAndCount();

    // Calculate average ratings
    const propertiesWithRatings = await Promise.all(
      properties.map(async (property) => {
        const reviews = await this.propertyRepository.manager
          .createQueryBuilder()
          .select('AVG(rating)', 'avgRating')
          .from('reviews', 'review')
          .where('review.propertyId = :propertyId', {
            propertyId: property.id,
          })
          .getRawOne();

        property.hostRating = reviews?.avgRating
          ? parseFloat(reviews.avgRating)
          : 0;

        return property;
      }),
    );

    return {
      properties: propertiesWithRatings,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['host', 'reviews', 'reviews.user'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Calculate average rating
    const reviews = await this.propertyRepository.manager
      .createQueryBuilder()
      .select('AVG(rating)', 'avgRating')
      .from('reviews', 'review')
      .where('review.propertyId = :propertyId', { propertyId: id })
      .getRawOne();

    property.hostRating = reviews?.avgRating
      ? parseFloat(reviews.avgRating)
      : 0;

    return property;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    user: User,
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to update this property',
      );
    }

    // Handle category update
    const oldCategoryId = property.categoryId;
    if (updatePropertyDto.categoryId !== undefined) {
      if (updatePropertyDto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updatePropertyDto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(`Category with ID ${updatePropertyDto.categoryId} not found`);
        }
        property.category = category;
        property.categoryId = updatePropertyDto.categoryId;
      } else {
        // Remove category
        property.category = null;
        property.categoryId = null;
      }
    }

    Object.assign(property, updatePropertyDto);
    const savedProperty = await this.propertyRepository.save(property);

    // Update category property counts if category changed
    if (oldCategoryId !== savedProperty.categoryId) {
      if (oldCategoryId) {
        await this.updateCategoryPropertyCount(oldCategoryId);
      }
      if (savedProperty.categoryId) {
        await this.updateCategoryPropertyCount(savedProperty.categoryId);
      }
    }

    return savedProperty;
  }

  private async updateCategoryPropertyCount(categoryId: string): Promise<void> {
    const propertyCount = await this.propertyRepository.count({
      where: { categoryId, isActive: true },
    });

    await this.categoryRepository.update(
      { id: categoryId },
      { propertyCount },
    );
  }

  async remove(id: string, user: User): Promise<void> {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.hostId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to delete this property',
      );
    }

    await this.propertyRepository.remove(property);
  }

  async findByHost(hostId: string): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { hostId },
      relations: ['bookings', 'reviews'],
    });
  }

  async findFeatured(limit: number = 12): Promise<Property[]> {
    const properties = await this.propertyRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['host', 'reviews'],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Calculate average ratings
    const propertiesWithRatings = await Promise.all(
      properties.map(async (property) => {
        const reviews = await this.propertyRepository.manager
          .createQueryBuilder()
          .select('AVG(rating)', 'avgRating')
          .from('reviews', 'review')
          .where('review.propertyId = :propertyId', {
            propertyId: property.id,
          })
          .getRawOne();

        property.hostRating = reviews?.avgRating
          ? parseFloat(reviews.avgRating)
          : 0;

        return property;
      }),
    );

    return propertiesWithRatings;
  }

  /** Returns properties from hosts who have active host-type offers */
  async findWithOffers(limit: number = 20): Promise<Property[]> {
    const today = new Date().toISOString().split('T')[0];

    const offersWithHosts = await this.offerRepository
      .createQueryBuilder('offer')
      .select('DISTINCT offer.hostId')
      .where('offer.isActive = :active', { active: true })
      .andWhere('offer.expiryDate >= :today', { today })
      .andWhere('offer.hostId IS NOT NULL')
      .andWhere('(offer.validFrom IS NULL OR offer.validFrom <= :today)', { today })
      .getRawMany<{ hostId: string }>();

    const hostIds = offersWithHosts
      .map((o) => o.hostId)
      .filter((id): id is string => !!id);

    if (hostIds.length === 0) {
      return [];
    }

    const properties = await this.propertyRepository.find({
      where: { hostId: In(hostIds), isActive: true },
      relations: ['host', 'reviews'],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const propertiesWithRatings = await Promise.all(
      properties.map(async (property) => {
        const reviews = await this.propertyRepository.manager
          .createQueryBuilder()
          .select('AVG(rating)', 'avgRating')
          .from('reviews', 'review')
          .where('review.propertyId = :propertyId', {
            propertyId: property.id,
          })
          .getRawOne();

        property.hostRating = reviews?.avgRating
          ? parseFloat(reviews.avgRating)
          : 0;

        return property;
      }),
    );

    return propertiesWithRatings;
  }
}
