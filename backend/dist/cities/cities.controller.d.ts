import { CitiesService } from './cities.service';
export declare class CitiesController {
    private readonly citiesService;
    constructor(citiesService: CitiesService);
    findAll(): Promise<import("../entities/city.entity").City[]>;
    reverseGeocode(lat: string, lon: string): Promise<{
        city: string;
    }>;
    findOne(id: string): Promise<import("../entities/city.entity").City>;
}
