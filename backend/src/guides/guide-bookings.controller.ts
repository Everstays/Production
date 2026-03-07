import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GuideBookingsService } from './guide-bookings.service';
import { CreateGuideBookingDto } from '../dto/guide-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('guides/:guideId/bookings')
export class GuideBookingsController {
  constructor(private readonly guideBookingsService: GuideBookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('guideId') guideId: string,
    @Body() createGuideBookingDto: CreateGuideBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.guideBookingsService.create(guideId, createGuideBookingDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findBookings(@Param('guideId') guideId: string, @CurrentUser() user: User) {
    return this.guideBookingsService.findBookings(guideId, user);
  }
}
