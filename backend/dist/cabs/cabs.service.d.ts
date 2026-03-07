import { Repository } from 'typeorm';
import { Cab } from '../entities/cab.entity';
import { CreateCabDto, UpdateCabDto } from '../dto/cab.dto';
import { User } from '../entities/user.entity';
export declare class CabsService {
    private cabRepository;
    constructor(cabRepository: Repository<Cab>);
    create(createCabDto: CreateCabDto, host: User): Promise<Cab>;
    findAll(filters?: {
        hostId?: string;
        isActive?: boolean;
        vehicleType?: string;
        seats?: number;
    }): Promise<Cab[]>;
    findOne(id: string): Promise<Cab>;
    findByHost(hostId: string): Promise<Cab[]>;
    update(id: string, updateCabDto: UpdateCabDto, user: User): Promise<Cab>;
    remove(id: string, user: User): Promise<void>;
}
