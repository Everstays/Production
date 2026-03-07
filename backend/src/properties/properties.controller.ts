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
import { PropertiesService } from './properties.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyQueryDto,
} from '../dto/property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.create(createPropertyDto, user);
  }

  @Get()
  findAll(@Query() query: PropertyQueryDto) {
    return this.propertiesService.findAll(query);
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findMyProperties(@CurrentUser() user: User) {
    return this.propertiesService.findByHost(user.id);
  }

  @Get('featured')
  findFeatured(@Query('limit') limit?: number) {
    const limitNum = limit ? parseInt(limit.toString(), 10) : 12;
    return this.propertiesService.findFeatured(limitNum);
  }

  @Get('with-offers')
  findWithOffers(@Query('limit') limit?: number) {
    const limitNum = limit ? parseInt(limit.toString(), 10) : 20;
    return this.propertiesService.findWithOffers(limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser() user: User,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.propertiesService.remove(id, user);
  }
}
