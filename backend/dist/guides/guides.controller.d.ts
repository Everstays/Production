import { GuidesService } from './guides.service';
import { CreateGuideDto, UpdateGuideDto } from '../dto/guide.dto';
import { User } from '../entities/user.entity';
export declare class GuidesController {
    private readonly guidesService;
    constructor(guidesService: GuidesService);
    create(createGuideDto: CreateGuideDto, user: User): Promise<import("../entities/guide.entity").Guide>;
    findAll(hostId?: string, isActive?: string, isAvailable?: string, location?: string): Promise<import("../entities/guide.entity").Guide[]>;
    findMyGuides(user: User): Promise<import("../entities/guide.entity").Guide[]>;
    findOne(id: string): Promise<import("../entities/guide.entity").Guide>;
    update(id: string, updateGuideDto: UpdateGuideDto, user: User): Promise<import("../entities/guide.entity").Guide>;
    remove(id: string, user: User): Promise<void>;
}
