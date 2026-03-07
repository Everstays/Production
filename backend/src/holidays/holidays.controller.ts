import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../dto/holiday.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createHolidayDto: CreateHolidayDto, @CurrentUser() user: User) {
    return this.holidaysService.create(createHolidayDto, user);
  }

  @Get()
  findAll(@Query('hostId') hostId?: string, @Query('isActive') isActive?: string) {
    const filters: any = {};
    if (hostId) filters.hostId = hostId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    return this.holidaysService.findAll(filters);
  }

  @Get('my-holidays')
  @UseGuards(JwtAuthGuard)
  findMyHolidays(@CurrentUser() user: User) {
    return this.holidaysService.findByHost(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidaysService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
    @CurrentUser() user: User,
  ) {
    return this.holidaysService.update(id, updateHolidayDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.holidaysService.remove(id, user);
  }
}
