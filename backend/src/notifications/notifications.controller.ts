import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findMine(
    @CurrentUser() user: User,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const unread = unreadOnly === 'true';
    return this.notificationsService.findByUserId(user.id, unread);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}
