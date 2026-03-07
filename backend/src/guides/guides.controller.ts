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
import { GuidesService } from './guides.service';
import { CreateGuideDto, UpdateGuideDto } from '../dto/guide.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGuideDto: CreateGuideDto, @CurrentUser() user: User) {
    return this.guidesService.create(createGuideDto, user);
  }

  @Get()
  findAll(
    @Query('hostId') hostId?: string,
    @Query('isActive') isActive?: string,
    @Query('isAvailable') isAvailable?: string,
    @Query('location') location?: string,
  ) {
    const filters: any = {};
    if (hostId) filters.hostId = hostId;
    if (isActive !== undefined && isActive !== '') filters.isActive = isActive === 'true';
    if (isAvailable !== undefined && isAvailable !== '') filters.isAvailable = isAvailable === 'true';
    if (location) filters.location = location;
    // For public search (no hostId), default to active and available guides only
    if (!hostId && isActive === undefined && filters.isActive === undefined) {
      filters.isActive = true;
    }
    if (!hostId && (isAvailable === undefined || isAvailable === '') && filters.isAvailable === undefined) {
      filters.isAvailable = true;
    }
    return this.guidesService.findAll(filters);
  }

  @Get('my-guides')
  @UseGuards(JwtAuthGuard)
  findMyGuides(@CurrentUser() user: User) {
    return this.guidesService.findByHost(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateGuideDto: UpdateGuideDto,
    @CurrentUser() user: User,
  ) {
    return this.guidesService.update(id, updateGuideDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.guidesService.remove(id, user);
  }
}
