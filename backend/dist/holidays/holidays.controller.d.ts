import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../dto/holiday.dto';
import { User } from '../entities/user.entity';
export declare class HolidaysController {
    private readonly holidaysService;
    constructor(holidaysService: HolidaysService);
    create(createHolidayDto: CreateHolidayDto, user: User): Promise<import("../entities/holiday.entity").Holiday>;
    findAll(hostId?: string, isActive?: string): Promise<import("../entities/holiday.entity").Holiday[]>;
    findMyHolidays(user: User): Promise<import("../entities/holiday.entity").Holiday[]>;
    findOne(id: string): Promise<import("../entities/holiday.entity").Holiday>;
    update(id: string, updateHolidayDto: UpdateHolidayDto, user: User): Promise<import("../entities/holiday.entity").Holiday>;
    remove(id: string, user: User): Promise<void>;
}
