import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateHostSettingsDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Patch('me/host-settings')
  updateHostSettings(
    @Body() updateHostSettingsDto: UpdateHostSettingsDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateHostSettings(user.id, updateHostSettingsDto);
  }

  @Post('wishlist/:propertyId')
  addToWishlist(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.addToWishlist(user.id, propertyId);
  }

  @Delete('wishlist/:propertyId')
  removeFromWishlist(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.removeFromWishlist(user.id, propertyId);
  }

  @Get('wishlist/me')
  getWishlist(@CurrentUser() user: User) {
    return this.usersService.getWishlist(user.id);
  }
}
