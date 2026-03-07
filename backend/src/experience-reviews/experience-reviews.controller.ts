import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExperienceReviewsService } from './experience-reviews.service';
import { CreateExperienceReviewDto } from '../dto/experience-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('experiences/:experienceId/reviews')
export class ExperienceReviewsController {
  constructor(
    private readonly experienceReviewsService: ExperienceReviewsService,
  ) {}

  @Get()
  findAll(@Param('experienceId') experienceId: string) {
    return this.experienceReviewsService.findByExperience(experienceId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('experienceId') experienceId: string,
    @Body() createExperienceReviewDto: CreateExperienceReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.experienceReviewsService.create(
      experienceId,
      createExperienceReviewDto,
      user,
    );
  }
}
