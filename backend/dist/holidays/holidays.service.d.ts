import { Repository } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import { CreateHolidayDto, UpdateHolidayDto } from '../dto/holiday.dto';
import { User } from '../entities/user.entity';
export declare class HolidaysService {
    private holidayRepository;
    constructor(holidayRepository: Repository<Holiday>);
    create(createHolidayDto: CreateHolidayDto, host: User): Promise<Holiday>;
    findAll(filters?: {
        hostId?: string;
        isActive?: boolean;
    }): Promise<Holiday[]>;
    findOne(id: string): Promise<Holiday>;
    findByHost(hostId: string): Promise<Holiday[]>;
    update(id: string, updateHolidayDto: UpdateHolidayDto, user: User): Promise<Holiday>;
    remove(id: string, user: User): Promise<void>;
}
