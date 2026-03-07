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
import { TripPlanItemsService } from './trip-plan-items.service';
import { CreateTripPlanItemDto } from '../dto/trip-plan-item.dto';
import { UpdateTripPlanItemDto } from '../dto/trip-plan-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('trip-plan-items')
export class TripPlanItemsController {
  constructor(private readonly tripPlanItemsService: TripPlanItemsService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.tripPlanItemsService.findAll(all === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripPlanItemsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTripPlanItemDto) {
    return this.tripPlanItemsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTripPlanItemDto) {
    return this.tripPlanItemsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.tripPlanItemsService.remove(id);
  }
}
