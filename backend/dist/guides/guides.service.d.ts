import { Repository } from 'typeorm';
import { Guide } from '../entities/guide.entity';
import { CreateGuideDto, UpdateGuideDto } from '../dto/guide.dto';
import { User } from '../entities/user.entity';
export declare class GuidesService {
    private guideRepository;
    constructor(guideRepository: Repository<Guide>);
    create(createGuideDto: CreateGuideDto, host: User): Promise<Guide>;
    findAll(filters?: {
        hostId?: string;
        isActive?: boolean;
        isAvailable?: boolean;
        location?: string;
    }): Promise<Guide[]>;
    findOne(id: string): Promise<Guide>;
    findByHost(hostId: string): Promise<Guide[]>;
    update(id: string, updateGuideDto: UpdateGuideDto, user: User): Promise<Guide>;
    remove(id: string, user: User): Promise<void>;
}
