import { UsersService } from './users.service';
import { UpdateUserDto, UpdateHostSettingsDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<User>;
    findOne(id: string): Promise<User>;
    update(updateUserDto: UpdateUserDto, user: User): Promise<User>;
    updateHostSettings(updateHostSettingsDto: UpdateHostSettingsDto, user: User): Promise<User>;
    addToWishlist(propertyId: string, user: User): Promise<User>;
    removeFromWishlist(propertyId: string, user: User): Promise<User>;
    getWishlist(user: User): Promise<string[]>;
}
