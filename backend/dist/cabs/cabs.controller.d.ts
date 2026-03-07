import { CabsService } from './cabs.service';
import { CreateCabDto, UpdateCabDto } from '../dto/cab.dto';
import { User } from '../entities/user.entity';
export declare class CabsController {
    private readonly cabsService;
    constructor(cabsService: CabsService);
    create(createCabDto: CreateCabDto, user: User): Promise<import("../entities/cab.entity").Cab>;
    findAll(hostId?: string, isActive?: string, vehicleType?: string, seats?: string): Promise<import("../entities/cab.entity").Cab[]>;
    findMyCabs(user: User): Promise<import("../entities/cab.entity").Cab[]>;
    findOne(id: string): Promise<import("../entities/cab.entity").Cab>;
    update(id: string, updateCabDto: UpdateCabDto, user: User): Promise<import("../entities/cab.entity").Cab>;
    remove(id: string, user: User): Promise<void>;
}
