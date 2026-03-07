import { Controller, Get, Put, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { TabBadgesService } from './tab-badges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('tab-badges')
export class TabBadgesController {
  constructor(private readonly tabBadgesService: TabBadgesService) {}

  @Get()
  findAll() {
    return this.tabBadgesService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllForAdmin() {
    return this.tabBadgesService.findAllForAdmin();
  }

  @Put(':tabId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  upsert(
    @Param('tabId') tabId: string,
    @Body('badgeText') badgeText: string | null,
  ) {
    return this.tabBadgesService.upsert(tabId, badgeText);
  }

  @Delete(':tabId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('tabId') tabId: string) {
    return this.tabBadgesService.remove(tabId);
  }
}
