import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabBadge } from '../entities/tab-badge.entity';
import { TabBadgesService } from './tab-badges.service';
import { TabBadgesController } from './tab-badges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TabBadge])],
  controllers: [TabBadgesController],
  providers: [TabBadgesService],
  exports: [TabBadgesService],
})
export class TabBadgesModule {}
