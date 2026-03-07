import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { City } from '../entities/city.entity';
import { Category } from '../entities/category.entity';
import { Offer } from '../entities/offer.entity';
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryDto } from '../dto/property.dto';
export declare class PropertiesService {
    private propertyRepository;
    private cityRepository;
    private categoryRepository;
    private offerRepository;
    constructor(propertyRepository: Repository<Property>, cityRepository: Repository<City>, categoryRepository: Repository<Category>, offerRepository: Repository<Offer>);
    create(createPropertyDto: CreatePropertyDto, host: User): Promise<Property>;
    private ensureCityExists;
    findAll(query: PropertyQueryDto): Promise<{
        properties: Property[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, user: User): Promise<Property>;
    private updateCategoryPropertyCount;
    remove(id: string, user: User): Promise<void>;
    findByHost(hostId: string): Promise<Property[]>;
    findFeatured(limit?: number): Promise<Property[]>;
    findWithOffers(limit?: number): Promise<Property[]>;
}
