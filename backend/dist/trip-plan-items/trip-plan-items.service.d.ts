import { Repository } from 'typeorm';
import { TripPlanItem } from '../entities/trip-plan-item.entity';
import { CreateTripPlanItemDto } from '../dto/trip-plan-item.dto';
import { UpdateTripPlanItemDto } from '../dto/trip-plan-item.dto';
export declare class TripPlanItemsService {
    private tripPlanItemRepository;
    constructor(tripPlanItemRepository: Repository<TripPlanItem>);
    findAll(all?: boolean): Promise<TripPlanItem[]>;
    findOne(id: string): Promise<TripPlanItem>;
    create(dto: CreateTripPlanItemDto): Promise<TripPlanItem>;
    update(id: string, dto: UpdateTripPlanItemDto): Promise<TripPlanItem>;
    remove(id: string): Promise<void>;
}
