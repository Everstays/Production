import { Repository } from 'typeorm';
import { CabRequest } from '../entities/cab-request.entity';
import { CreateCabRequestDto } from '../dto/cab-request.dto';
import { Property } from '../entities/property.entity';
import { Cab } from '../entities/cab.entity';
import { User } from '../entities/user.entity';
export declare class CabRequestsService {
    private cabRequestRepository;
    private propertyRepository;
    private cabRepository;
    constructor(cabRequestRepository: Repository<CabRequest>, propertyRepository: Repository<Property>, cabRepository: Repository<Cab>);
    create(dto: CreateCabRequestDto, userId?: string | null): Promise<CabRequest>;
    findByHost(hostId: string): Promise<CabRequest[]>;
    findOne(id: string): Promise<CabRequest>;
    assign(requestId: string, cabId: string, user: User): Promise<CabRequest>;
}
