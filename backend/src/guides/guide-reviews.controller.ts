import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GuideReviewsService } from './guide-reviews.service';
import { CreateGuideReviewDto } from '../dto/guide-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('guides/:guideId/reviews')
export class GuideReviewsController {
  constructor(private readonly guideReviewsService: GuideReviewsService) {}

  @Get()
  findAll(@Param('guideId') guideId: string) {
    return this.guideReviewsService.findByGuide(guideId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('guideId') guideId: string,
    @Body() createGuideReviewDto: CreateGuideReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.guideReviewsService.create(guideId, createGuideReviewDto, user);
  }
}
