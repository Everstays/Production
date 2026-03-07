import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, PropertyQueryDto } from '../dto/property.dto';
import { User } from '../entities/user.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: CreatePropertyDto, user: User): Promise<import("../entities/property.entity").Property>;
    findAll(query: PropertyQueryDto): Promise<{
        properties: import("../entities/property.entity").Property[];
        total: number;
        page: number;
        limit: number;
    }>;
    findMyProperties(user: User): Promise<import("../entities/property.entity").Property[]>;
    findFeatured(limit?: number): Promise<import("../entities/property.entity").Property[]>;
    findWithOffers(limit?: number): Promise<import("../entities/property.entity").Property[]>;
    findOne(id: string): Promise<import("../entities/property.entity").Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, user: User): Promise<import("../entities/property.entity").Property>;
    remove(id: string, user: User): Promise<void>;
}
