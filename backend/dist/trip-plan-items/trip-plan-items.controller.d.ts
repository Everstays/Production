import { TripPlanItemsService } from './trip-plan-items.service';
import { CreateTripPlanItemDto } from '../dto/trip-plan-item.dto';
import { UpdateTripPlanItemDto } from '../dto/trip-plan-item.dto';
export declare class TripPlanItemsController {
    private readonly tripPlanItemsService;
    constructor(tripPlanItemsService: TripPlanItemsService);
    findAll(all?: string): Promise<import("../entities/trip-plan-item.entity").TripPlanItem[]>;
    findOne(id: string): Promise<import("../entities/trip-plan-item.entity").TripPlanItem>;
    create(dto: CreateTripPlanItemDto): Promise<import("../entities/trip-plan-item.entity").TripPlanItem>;
    update(id: string, dto: UpdateTripPlanItemDto): Promise<import("../entities/trip-plan-item.entity").TripPlanItem>;
    remove(id: string): Promise<void>;
}
