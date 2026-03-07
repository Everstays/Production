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
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from '../dto/offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createOfferDto: CreateOfferDto, @CurrentUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get('my-offers')
  @UseGuards(JwtAuthGuard)
  findMyOffers(@CurrentUser() user: User) {
    return this.offersService.findByHost(user.id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.offersService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @CurrentUser() user: User,
  ) {
    return this.offersService.update(id, updateOfferDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.offersService.remove(id, user);
  }
}
