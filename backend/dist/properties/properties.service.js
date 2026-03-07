"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../entities/property.entity");
const city_entity_1 = require("../entities/city.entity");
const category_entity_1 = require("../entities/category.entity");
const offer_entity_1 = require("../entities/offer.entity");
let PropertiesService = class PropertiesService {
    constructor(propertyRepository, cityRepository, categoryRepository, offerRepository) {
        this.propertyRepository = propertyRepository;
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
        this.offerRepository = offerRepository;
    }
    async create(createPropertyDto, host) {
        let category = null;
        if (createPropertyDto.categoryId) {
            category = await this.categoryRepository.findOne({
                where: { id: createPropertyDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${createPropertyDto.categoryId} not found`);
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
        await this.ensureCityExists(createPropertyDto.city);
        if (category) {
            await this.updateCategoryPropertyCount(category.id);
        }
        return savedProperty;
    }
    async ensureCityExists(cityName) {
        const existingCity = await this.cityRepository.findOne({
            where: { name: cityName },
        });
        if (!existingCity) {
            const cityIcons = {
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
    async findAll(query) {
        const { categoryId, city, location, minPrice, maxPrice, guests, checkIn, checkOut, minRating, amenities, page = 1, limit = 100, } = query;
        const queryBuilder = this.propertyRepository
            .createQueryBuilder('property')
            .leftJoinAndSelect('property.host', 'host')
            .leftJoinAndSelect('property.reviews', 'reviews')
            .where('property.isActive = :isActive', { isActive: true });
        if (categoryId) {
            queryBuilder.andWhere('property.categoryId = :categoryId', { categoryId });
        }
        if (city) {
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
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [properties, total] = await queryBuilder.getManyAndCount();
        const propertiesWithRatings = await Promise.all(properties.map(async (property) => {
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
        }));
        return {
            properties: propertiesWithRatings,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['host', 'reviews', 'reviews.user'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
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
    async update(id, updatePropertyDto, user) {
        const property = await this.propertyRepository.findOne({
            where: { id },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to update this property');
        }
        const oldCategoryId = property.categoryId;
        if (updatePropertyDto.categoryId !== undefined) {
            if (updatePropertyDto.categoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: updatePropertyDto.categoryId },
                });
                if (!category) {
                    throw new common_1.NotFoundException(`Category with ID ${updatePropertyDto.categoryId} not found`);
                }
                property.category = category;
                property.categoryId = updatePropertyDto.categoryId;
            }
            else {
                property.category = null;
                property.categoryId = null;
            }
        }
        Object.assign(property, updatePropertyDto);
        const savedProperty = await this.propertyRepository.save(property);
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
    async updateCategoryPropertyCount(categoryId) {
        const propertyCount = await this.propertyRepository.count({
            where: { categoryId, isActive: true },
        });
        await this.categoryRepository.update({ id: categoryId }, { propertyCount });
    }
    async remove(id, user) {
        const property = await this.propertyRepository.findOne({
            where: { id },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.hostId !== user.id && user.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to delete this property');
        }
        await this.propertyRepository.remove(property);
    }
    async findByHost(hostId) {
        return this.propertyRepository.find({
            where: { hostId },
            relations: ['bookings', 'reviews'],
        });
    }
    async findFeatured(limit = 12) {
        const properties = await this.propertyRepository.find({
            where: { isFeatured: true, isActive: true },
            relations: ['host', 'reviews'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const propertiesWithRatings = await Promise.all(properties.map(async (property) => {
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
        }));
        return propertiesWithRatings;
    }
    async findWithOffers(limit = 20) {
        const today = new Date().toISOString().split('T')[0];
        const offersWithHosts = await this.offerRepository
            .createQueryBuilder('offer')
            .select('DISTINCT offer.hostId')
            .where('offer.isActive = :active', { active: true })
            .andWhere('offer.expiryDate >= :today', { today })
            .andWhere('offer.hostId IS NOT NULL')
            .andWhere('(offer.validFrom IS NULL OR offer.validFrom <= :today)', { today })
            .getRawMany();
        const hostIds = offersWithHosts
            .map((o) => o.hostId)
            .filter((id) => !!id);
        if (hostIds.length === 0) {
            return [];
        }
        const properties = await this.propertyRepository.find({
            where: { hostId: (0, typeorm_2.In)(hostIds), isActive: true },
            relations: ['host', 'reviews'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const propertiesWithRatings = await Promise.all(properties.map(async (property) => {
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
        }));
        return propertiesWithRatings;
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(3, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map