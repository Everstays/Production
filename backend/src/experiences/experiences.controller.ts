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
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createExperienceDto: CreateExperienceDto, @CurrentUser() user: User) {
    return this.experiencesService.create(createExperienceDto, user);
  }

  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (city) filters.city = city;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.experiencesService.findAll(filters);
  }

  @Get('featured')
  getFeatured() {
    return this.experiencesService.getFeatured();
  }

  @Get('my-experiences')
  @UseGuards(JwtAuthGuard)
  findMyExperiences(@CurrentUser() user: User) {
    return this.experiencesService.findByHost(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @CurrentUser() user: User,
  ) {
    return this.experiencesService.update(id, updateExperienceDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.experiencesService.remove(id, user);
  }
}
