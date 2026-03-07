import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { GuideBookingsService } from './guide-bookings.service';
import { UpdateGuideBookingStatusDto } from '../dto/guide-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('guide-bookings')
export class GuideBookingsHostController {
  constructor(private readonly guideBookingsService: GuideBookingsService) {}

  @Get('for-host')
  @UseGuards(JwtAuthGuard)
  findForHost(@CurrentUser() user: User) {
    return this.guideBookingsService.findForHost(user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateGuideBookingStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.guideBookingsService.updateStatus(id, dto.status, user);
  }
}
