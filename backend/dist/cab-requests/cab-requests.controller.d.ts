import { CabRequestsService } from './cab-requests.service';
import { CreateCabRequestDto, AssignCabRequestDto } from '../dto/cab-request.dto';
import { User } from '../entities/user.entity';
export declare class CabRequestsController {
    private readonly cabRequestsService;
    constructor(cabRequestsService: CabRequestsService);
    create(createCabRequestDto: CreateCabRequestDto, user?: User | null): Promise<import("../entities/cab-request.entity").CabRequest>;
    findForHost(user: User): Promise<import("../entities/cab-request.entity").CabRequest[]>;
    assign(id: string, body: AssignCabRequestDto, user: User): Promise<import("../entities/cab-request.entity").CabRequest>;
}
