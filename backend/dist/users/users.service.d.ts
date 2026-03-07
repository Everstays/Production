import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateHostSettingsDto } from '../dto/user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    updateHostSettings(id: string, updateHostSettingsDto: UpdateHostSettingsDto): Promise<User>;
    addToWishlist(userId: string, propertyId: string): Promise<User>;
    removeFromWishlist(userId: string, propertyId: string): Promise<User>;
    getWishlist(userId: string): Promise<string[]>;
}
