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
import { CabsService } from './cabs.service';
import { CreateCabDto, UpdateCabDto } from '../dto/cab.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('cabs')
export class CabsController {
  constructor(private readonly cabsService: CabsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCabDto: CreateCabDto, @CurrentUser() user: User) {
    return this.cabsService.create(createCabDto, user);
  }

  @Get()
  findAll(
    @Query('hostId') hostId?: string,
    @Query('isActive') isActive?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('seats') seats?: string,
  ) {
    const filters: any = {};
    if (hostId) filters.hostId = hostId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (vehicleType) filters.vehicleType = vehicleType;
    if (seats) filters.seats = parseInt(seats, 10);
    return this.cabsService.findAll(filters);
  }

  @Get('my-cabs')
  @UseGuards(JwtAuthGuard)
  findMyCabs(@CurrentUser() user: User) {
    return this.cabsService.findByHost(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cabsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCabDto: UpdateCabDto,
    @CurrentUser() user: User,
  ) {
    return this.cabsService.update(id, updateCabDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cabsService.remove(id, user);
  }
}
