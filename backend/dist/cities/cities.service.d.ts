import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Property } from '../entities/property.entity';
export declare class CitiesService {
    private cityRepository;
    private propertyRepository;
    constructor(cityRepository: Repository<City>, propertyRepository: Repository<Property>);
    findAll(): Promise<City[]>;
    findOne(id: string): Promise<City>;
    create(name: string, icon?: string, image?: string): Promise<City>;
    reverseGeocode(lat: string, lon: string): Promise<{
        city: string;
    } | null>;
}
