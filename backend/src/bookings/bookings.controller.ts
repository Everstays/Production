import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findAll(user);
  }

  @Get('earnings/stats')
  getEarnings(@CurrentUser() user: User) {
    return this.bookingsService.getEarnings(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.cancel(id, user);
  }
}
